import { BigQuery, BigQueryTimestamp } from '@google-cloud/bigquery';

import { DEFAULT_LFM_COLLECTION_URL, ScrapingResult } from '@/lib/analytics/huggingface/crawler';
import { getBigQueryClient } from '@/lib/bqClient';

interface BigQueryHfModelStatsEntry {
  id: string; // UUID
  organization: string;
  model_slug: string;
  model_size: string;
  model_variant: string | null;
  collection_url: string;
  total_downloads: number;
  total_likes: number;
  new_downloads: number | null;
  new_likes: number | null;
  scraped_at: string; // ISO 8601 UTC timestamp
}

interface PreviousModelStats {
  total_downloads: number;
  total_likes: number;
  scraped_at: BigQueryTimestamp;
}

export function parseModelName(fullName: string): {
  organization: string;
  model_slug: string;
  model_size: string;
  model_variant: string | null;
} {
  // Split by first slash to get org and model
  const [organization, modelPart] = fullName.split('/');

  // Extract size (pattern like 1.2B, 700M, 350M)
  const sizeMatch = modelPart.match(/(\d+(?:\.\d+)?[BMK])/i);
  const model_size = sizeMatch ? sizeMatch[1] : '';

  // Extract variant (everything after the size)
  const variantMatch = modelPart.match(/\d+(?:\.\d+)?[BMK]-(.+)/i);
  const model_variant = variantMatch ? variantMatch[1] : null;

  return {
    organization,
    model_slug: modelPart,
    model_size,
    model_variant,
  };
}

async function getPreviousModelStats(
  bqClient: BigQuery,
  entries: BigQueryHfModelStatsEntry[]
): Promise<Map<string, PreviousModelStats>> {
  const datasetName = process.env.GCP_BQ_MODEL_STATS_DATASET;
  if (!datasetName) {
    throw new Error('GCP_BQ_MODEL_STATS_DATASET environment variable is required');
  }

  if (entries.length === 0) {
    return new Map();
  }

  const modelKeys = entries
    .map((entry) => `('${entry.organization}', '${entry.model_slug}')`)
    .join(', ');

  const query = `
    WITH latest_records AS (
      SELECT 
        organization,
        model_slug,
        total_downloads,
        total_likes,
        scraped_at,
        ROW_NUMBER() OVER (PARTITION BY organization, model_slug ORDER BY scraped_at DESC) as rn
      FROM \`${datasetName}.hf_model_stats\`
      WHERE (organization, model_slug) IN (${modelKeys})
    )
    SELECT organization, model_slug, total_downloads, total_likes, scraped_at
    FROM latest_records 
    WHERE rn = 1
  `;

  const [rows] = await bqClient.query({ query });
  const previousStats = new Map<string, PreviousModelStats>();

  for (const row of rows) {
    const key = `${row.organization}:${row.model_slug}`;
    previousStats.set(key, {
      total_downloads: row.total_downloads,
      total_likes: row.total_likes,
      scraped_at: row.scraped_at,
    });
  }

  return previousStats;
}

export function getBigQueryDataEntries(
  data: ScrapingResult,
  previousStats?: Map<string, PreviousModelStats>
): BigQueryHfModelStatsEntry[] {
  return data.models.map((model) => {
    const parsed = parseModelName(model.name);
    const key = `${parsed.organization}:${parsed.model_slug}`;
    const previous = previousStats?.get(key);

    let new_downloads: number | null = null;
    let new_likes: number | null = null;

    if (previous != null) {
      const downloadDiff = model.downloadCount - previous.total_downloads;
      const likesDiff = model.likeCount - previous.total_likes;
      new_downloads = downloadDiff;
      new_likes = likesDiff;
      console.debug(
        [
          `New stats for ${key}:`,
          `new downloads - ${downloadDiff},`,
          `new likes - ${likesDiff},`,
          `previous stats - ${previous.scraped_at.value}`,
        ].join(' ')
      );
    }

    return {
      ...parsed,
      id: crypto.randomUUID(),
      collection_url: DEFAULT_LFM_COLLECTION_URL,
      total_downloads: model.downloadCount,
      total_likes: model.likeCount,
      new_downloads,
      new_likes,
      scraped_at: data.scrapedAt.toISOString(),
    };
  });
}

export async function insertDataToBigQuery(
  bqClient: BigQuery,
  data: BigQueryHfModelStatsEntry[]
): Promise<void> {
  const datasetName = process.env.GCP_BQ_MODEL_STATS_DATASET;
  if (!datasetName) {
    throw new Error('GCP_BQ_MODEL_STATS_DATASET environment variable is required');
  }

  const dataset = bqClient.dataset(datasetName);
  const table = dataset.table('hf_model_stats');

  try {
    await table.insert(data);
    console.info(`Successfully inserted ${data.length} rows to BigQuery`);
  } catch (error: any) {
    if (error.name === 'PartialFailureError') {
      console.error('Some rows failed to insert:', error.errors);
      throw new Error(`BigQuery partial insert failure: ${JSON.stringify(error.errors)}`);
    }

    console.error('Error inserting to BigQuery:', error);
    throw error;
  }
}

export async function persistModelStatsToBigQuery(data: ScrapingResult): Promise<void> {
  const preliminaryEntries = getBigQueryDataEntries(data);
  if (preliminaryEntries.length === 0) {
    console.info('No model stats to persist, skipping BigQuery insert');
    return;
  }

  try {
    const bqClient = getBigQueryClient();
    const previousStats = await getPreviousModelStats(bqClient, preliminaryEntries);
    const entries = getBigQueryDataEntries(data, previousStats);
    await insertDataToBigQuery(bqClient, entries);
  } catch (error) {
    console.error('Failed to persist model stats to BigQuery:', error);
    throw error;
  }
}
