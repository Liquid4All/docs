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
  stats_date: string; // YYYY-MM-DD format
  updated_at: string; // ISO 8601 UTC timestamp
}

interface PreviousModelStats {
  total_downloads: number;
  total_likes: number;
  updated_at: BigQueryTimestamp;
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
    .map((entry) => `('${entry.model_slug}', '${entry.organization}')`)
    .join(', ');

  // Get the most recent stats for each model (latest date)
  const query = `
    WITH latest_records AS (
      SELECT
        organization,
        model_slug,
        total_downloads,
        total_likes,
        updated_at,
        ROW_NUMBER() OVER (
          PARTITION BY organization, model_slug
          ORDER BY stats_date DESC
          ) as rn
      FROM \`${datasetName}.hf_model_stats\`
      WHERE (model_slug, organization) IN (${modelKeys})
    )
    SELECT organization, model_slug, total_downloads, total_likes, updated_at
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
      updated_at: row.updated_at,
    });
  }

  return previousStats;
}

async function getCurrentModelStats(
  bqClient: BigQuery,
  entries: BigQueryHfModelStatsEntry[],
  date: string
): Promise<Map<string, BigQueryHfModelStatsEntry>> {
  const datasetName = process.env.GCP_BQ_MODEL_STATS_DATASET;
  if (!datasetName) {
    throw new Error('GCP_BQ_MODEL_STATS_DATASET environment variable is required');
  }

  if (entries.length === 0) {
    return new Map();
  }

  const modelKeys = entries
    .map((entry) => `('${entry.model_slug}', '${entry.organization}')`)
    .join(', ');

  const query = `
    SELECT *
    FROM \`${datasetName}.hf_model_stats\`
    WHERE stats_date = '${date}'
      AND (model_slug, organization) IN (${modelKeys})
  `;

  const [rows] = await bqClient.query({ query });
  const currentStats = new Map<string, BigQueryHfModelStatsEntry>();

  for (const row of rows) {
    const key = `${row.organization}:${row.model_slug}`;
    currentStats.set(key, row);
  }

  return currentStats;
}

export function getBigQueryDataEntries(
  data: ScrapingResult,
  previousStats?: Map<string, PreviousModelStats>
): BigQueryHfModelStatsEntry[] {
  const today = data.scrapedAt.toISOString().split('T')[0]; // YYYY-MM-DD format

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
          `previous stats - ${previous.updated_at.value}`,
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
      stats_date: today,
      updated_at: data.scrapedAt.toISOString(),
    };
  });
}

async function upsertDataToBigQuery(
  bqClient: BigQuery,
  data: BigQueryHfModelStatsEntry[]
): Promise<void> {
  const datasetName = process.env.GCP_BQ_MODEL_STATS_DATASET;
  if (!datasetName) {
    throw new Error('GCP_BQ_MODEL_STATS_DATASET environment variable is required');
  }

  if (data.length === 0) {
    console.info('No data to upsert, skipping BigQuery operation');
    return;
  }

  const today = data[0].stats_date;
  const dataset = bqClient.dataset(datasetName);
  const table = dataset.table('hf_model_stats');

  const existingStats = await getCurrentModelStats(bqClient, data, today);
  const updates: BigQueryHfModelStatsEntry[] = [];
  const inserts: BigQueryHfModelStatsEntry[] = [];

  for (const entry of data) {
    const key = `${entry.organization}:${entry.model_slug}`;
    const existing = existingStats.get(key);

    if (existing) {
      updates.push({
        ...entry,
        id: existing.id,
      });
    } else {
      inserts.push(entry);
    }
  }

  try {
    // Handle updates via DELETE + INSERT pattern since BigQuery doesn't support UPDATE with streaming
    if (updates.length > 0) {
      const updateIds = updates.map((entry) => `'${entry.id}'`).join(', ');

      const deleteQuery = `
        DELETE FROM \`${datasetName}.hf_model_stats\`
        WHERE id IN (${updateIds})
      `;

      await bqClient.query({ query: deleteQuery });
      console.info(`Deleted ${updates.length} existing records for today`);
    }

    // Insert all data (both new inserts and updated records)
    const allInserts = [...inserts, ...updates];
    if (allInserts.length > 0) {
      await table.insert(allInserts);
      console.info(
        `Successfully inserted ${allInserts.length} rows to BigQuery (${inserts.length} new, ${updates.length} updated)`
      );
    }
  } catch (error: any) {
    if (error.name === 'PartialFailureError') {
      console.error('Some rows failed to insert:', error.errors);
      throw new Error(`BigQuery partial insert failure: ${JSON.stringify(error.errors)}`);
    }

    console.error('Error upserting to BigQuery:', error);
    throw error;
  }
}

export async function persistModelStatsToBigQuery(data: ScrapingResult): Promise<void> {
  const today = data.scrapedAt.toISOString().split('T')[0];
  console.info(`Persisting model stats for date: ${today}`);

  const preliminaryEntries = getBigQueryDataEntries(data);
  if (preliminaryEntries.length === 0) {
    console.info('No model stats to persist, skipping BigQuery insert');
    return;
  }

  try {
    const bqClient = getBigQueryClient();
    const previousStats = await getPreviousModelStats(bqClient, preliminaryEntries);
    const entries = getBigQueryDataEntries(data, previousStats);
    await upsertDataToBigQuery(bqClient, entries);

    console.info(`Successfully persisted stats for ${entries.length} models on ${today}`);
  } catch (error) {
    console.error('Failed to persist model stats to BigQuery:', error);
    throw error;
  }
}
