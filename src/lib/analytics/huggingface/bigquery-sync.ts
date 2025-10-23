import { HfModelStat, prisma } from '@liquidai/leap-database';

import { getPreviousUtcDate, getUtcMidnight } from '@/lib/analytics/huggingface/persistence';
import { getBigQueryClient } from '@/lib/bqClient';

interface HfModelStatBigQueryRow {
  id: string;
  organization: string;
  model_slug: string;
  model_modality: string | null;
  model_size: string;
  model_variant: string | null;
  hf_url: string;
  total_downloads: number;
  new_downloads: number | null;
  total_likes: number;
  new_likes: number | null;
  utc_date: string; // DATE format: YYYY-MM-DD
  updated_at: string; // TIMESTAMP format: ISO string
}

const BQ_TABLE_NAME = 'hf_model_stat';

export async function getYesterdayHfModelStats(dateToFetch?: string): Promise<HfModelStat[]> {
  let yesterday: Date;
  if (dateToFetch != null) {
    yesterday = getUtcMidnight(new Date(dateToFetch));
  } else {
    const today = getUtcMidnight(new Date());
    yesterday = getPreviousUtcDate(today);
  }
  console.info(`Fetching HfModelStat data for ${yesterday.toISOString().split('T')[0]}`);

  return prisma.hfModelStat.findMany({
    where: {
      utc_date: yesterday,
    },
    orderBy: [{ organization: 'asc' }, { model_slug: 'asc' }],
  });
}

export async function syncHfModelStatsToBigQuery(data: HfModelStat[]): Promise<void> {
  if (data.length === 0) {
    console.info('No HfModelStat data to sync to BigQuery');
    return;
  }

  const bqClient = getBigQueryClient();
  const datasetId = process.env.GCP_BQ_MODEL_STATS_DATASET;
  if (!datasetId) {
    throw new Error('GCP_BQ_MODEL_STATS_DATASET environment variable is required');
  }

  const dataset = bqClient.dataset(datasetId);
  const table = dataset.table(BQ_TABLE_NAME);

  const [exists] = await table.exists();
  if (!exists) {
    console.info(`BigQuery ${BQ_TABLE_NAME} table does not exist, creating...`);
    throw new Error(
      `BigQuery ${BQ_TABLE_NAME} table does not exist. Please create it using the provided SQL script.`
    );
  }

  const transformedData: HfModelStatBigQueryRow[] = data.map((stat) => ({
    id: stat.id,
    organization: stat.organization,
    model_slug: stat.model_slug,
    model_modality: stat.model_modality,
    model_size: stat.model_size,
    model_variant: stat.model_variant,
    hf_url: stat.hf_url,
    total_downloads: stat.total_downloads,
    new_downloads: stat.new_downloads,
    total_likes: stat.total_likes,
    new_likes: stat.new_likes,
    utc_date: stat.utc_date.toISOString().split('T')[0], // Convert to DATE format: YYYY-MM-DD
    updated_at: stat.updated_at.toISOString(), // Convert to TIMESTAMP format: ISO string
  }));

  console.info(`Inserting ${transformedData.length} rows into BigQuery ${BQ_TABLE_NAME} table`);

  await table.insert(transformedData);
  console.info(
    `Successfully synced ${transformedData.length} ${BQ_TABLE_NAME} records to BigQuery`
  );
}
