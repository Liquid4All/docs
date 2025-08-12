import { BigQuery } from '@google-cloud/bigquery';

import { DEFAULT_LFM_COLLECTION_URL, ScrapingResult } from '@/lib/analytics/huggingface/crawler';
import { getBigQueryClient } from '@/lib/bqClient';

interface BigQueryHfModelStatsEntry {
  organization: string;
  model_slug: string;
  model_size: string;
  model_variant: string | null;
  collection_url: string;
  downloads: number;
  likes: number;
  scraped_at: string; // ISO 8601 UTC timestamp
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

export function getBigQueryDataEntries(data: ScrapingResult): BigQueryHfModelStatsEntry[] {
  return data.models.map((model) => {
    const parsed = parseModelName(model.name);

    return {
      ...parsed,
      collection_url: DEFAULT_LFM_COLLECTION_URL,
      downloads: model.downloadCount,
      likes: model.likeCount,
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
  const bqClient = getBigQueryClient();
  const entries = getBigQueryDataEntries(data);

  if (entries.length === 0) {
    console.info('No model stats to persist, skipping BigQuery insert');
    return;
  }

  try {
    await insertDataToBigQuery(bqClient, entries);
  } catch (error) {
    console.error('Failed to persist model stats to BigQuery:', error);
    throw error;
  }
}
