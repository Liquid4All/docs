import { appendQueryParams, getHfModel, isLmf2Model } from '@/lib/analytics/huggingface/helpers';
import {
  HfCrawlerResult,
  HfModelStatEntry,
  HubModelResponse,
} from '@/lib/analytics/huggingface/types';
import { searchLfm2ModelSlugsFromWebQuery } from '@/lib/analytics/huggingface/web-query';

async function fetchWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000;
        console.warn(`Rate limited, waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

export const searchLfm2ModelsFromHfApi = async (): Promise<HfModelStatEntry[]> => {
  const models: HfModelStatEntry[] = [];

  const taggedModels = await fetchWithRetry(async () => {
    const url = new URL('https://huggingface.co/api/models');
    url.searchParams.set('filter', 'lfm2');
    appendQueryParams(url);
    console.debug(`Searching by "lfm2" models with URL: ${url.toString()}`);

    const res = await fetch(url.toString());
    if (!res.ok) {
      const error = new Error(`HTTP ${res.status}: ${res.statusText}`);
      (error as any).status = res.status;
      throw error;
    }
    return res.json();
  });

  taggedModels.forEach((model: HubModelResponse) => {
    if (isLmf2Model(model)) {
      models.push({
        name: model.id,
        downloadCount: model.downloadsAllTime ?? 0,
        likeCount: model.likes ?? 0,
      });
    }
  });

  console.info(`HF Hub API search found ${models.length} LFM2 models`);
  return models;
};

export const searchLiquidLfm2Collection = async (): Promise<HfModelStatEntry[]> => {
  const models: HfModelStatEntry[] = [];

  const liquidAIModels = await fetchWithRetry(async () => {
    const url = new URL('https://huggingface.co/api/models');
    url.searchParams.set('author', 'LiquidAI');
    url.searchParams.set('search', 'LFM2');
    appendQueryParams(url);

    const res = await fetch(url.toString());
    if (!res.ok) {
      const error = new Error(`HTTP ${res.status}: ${res.statusText}`);
      (error as any).status = res.status;
      throw error;
    }
    return res.json();
  });

  liquidAIModels.forEach((model: HubModelResponse) => {
    models.push({
      name: model.id,
      downloadCount: model.downloadsAllTime ?? 0,
      likeCount: model.likes ?? 0,
    });
  });

  console.info(`Liquid LFM2 collection has ${models.length} LFM2 models`);
  return models;
};

export const searchLfm2ModelsFromWebQuery = async (
  existingModelSlugs: Set<string>
): Promise<HfModelStatEntry[]> => {
  const webQueryModelSlugs = await searchLfm2ModelSlugsFromWebQuery();

  const newModelSlugs = webQueryModelSlugs.filter((slug) => !existingModelSlugs.has(slug));
  const models: HfModelStatEntry[] = [];
  console.info('New models from web query:', newModelSlugs.length);

  for (const model of newModelSlugs) {
    const modelResponse = await getHfModel(model);
    if (isLmf2Model(modelResponse)) {
      models.push({
        name: modelResponse.id,
        downloadCount: modelResponse.downloadsAllTime ?? 0,
        likeCount: modelResponse.likes ?? 0,
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.info(`Web query found ${models.length} new LFM2 models`);
  return models;
};

export const searchAllLfm2Models = async (): Promise<HfModelStatEntry[]> => {
  console.info('Searching for LFM2 models...');

  try {
    const modelsFromApiQuery = await searchLfm2ModelsFromHfApi();
    const modelsFromLiquidCollection = await searchLiquidLfm2Collection();
    const modelsFromWebQuery: HfModelStatEntry[] = await searchLfm2ModelsFromWebQuery(
      new Set([
        ...modelsFromApiQuery.map((m) => m.name),
        ...modelsFromLiquidCollection.map((m) => m.name),
      ])
    );

    const allModels: HfModelStatEntry[] = Object.values(
      [...modelsFromApiQuery, ...modelsFromLiquidCollection, ...modelsFromWebQuery].reduce(
        (acc, model) => {
          acc[model.name] = model;
          return acc;
        },
        {} as Record<string, HfModelStatEntry>
      )
    );
    console.info(`Total unique models discovered: ${allModels.length}`);

    return allModels;
  } catch (error: any) {
    console.error('Error discovering models:', error);
    throw error;
  }
};

export const crawlLfm2ModelsFromHf = async (verbose: boolean = false): Promise<HfCrawlerResult> => {
  console.info('Starting scraping LFM2 model stats from HF...');

  try {
    const models: HfModelStatEntry[] = await searchAllLfm2Models();

    // Sort by downloads (descending)
    models.sort((a, b) => {
      const downloadsA = a.downloadCount || 0;
      const downloadsB = b.downloadCount || 0;
      return downloadsB - downloadsA;
    });

    const modelStats: HfModelStatEntry[] = models.map((model) => {
      const downloadCount = model.downloadCount || 0;
      const likeCount = model.likeCount || 0;

      return {
        name: model.name,
        downloadCount,
        likeCount,
      };
    });

    console.info(`Successfully scraped ${modelStats.length} LFM2 models`);
    console.info(`Total downloads: ${modelStats.reduce((sum, m) => sum + m.downloadCount, 0)}`);
    console.info(`Total likes: ${modelStats.reduce((sum, m) => sum + m.likeCount, 0)}`);

    if (verbose) {
      console.debug('All scraped models:');
      modelStats.forEach((m, idx) => {
        console.debug(
          `${idx + 1}. ${m.name} - Downloads: ${m.downloadCount}, Likes: ${m.likeCount}`
        );
      });
    }

    return {
      models: modelStats,
      totalModels: modelStats.length,
      scrapedAt: new Date(),
    };
  } catch (error: any) {
    console.error('Error scraping HuggingFace collection:', error);
    throw error;
  }
};
