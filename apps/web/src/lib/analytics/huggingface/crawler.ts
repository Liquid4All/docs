import { HfCrawlerResult, HfModelStatEntry } from '@/lib/analytics/huggingface/types';

const KNOWN_LFM2_MODELS = [
  'lmstudio-community/LFM2-1.2B-MLX-8bit',
  'lmstudio-community/LFM2-1.2B-MLX-bf16',
  'LiquidAI/LFM2-1.2B-GGUF',
  'LiquidAI/LFM2-1.2B',
  'LiquidAI/LFM2-350M',
  'unsloth/LFM2-700M-GGUF',
  'LiquidAI/LFM2-350M-GGUF',
  'LiquidAI/LFM2-700M',
  'LiquidAI/LFM2-VL-450M',
  'unsloth/LFM2-1.2B-GGUF',
  'unsloth/LFM2-1.2B',
  'LiquidAI/LFM2-700M-GGUF',
  'onnx-community/LFM2-1.2B-ONNX',
  'unsloth/LFM2-350M-GGUF',
  'LiquidAI/LFM2-VL-1.6B',
  'mradermacher/Tashkeel-700M-i1-GGUF',
  'onnx-community/LFM2-350M-ONNX',
  'mradermacher/kulyk-uk-en-i1-GGUF',
  'unsloth/LFM2-1.2B-unsloth-bnb-4bit',
  'eternis/eternis_sft_tool_calling_LFM2_1_2B_lora_r8_lora_alpha16_merged',
  'mradermacher/Tashkeel-700M-GGUF',
  'mradermacher/PharmaQA-1.2B-GGUF',
  'mradermacher/LFM2-1.2B-Pirate-i1-GGUF',
  'mradermacher/LFM2-350M-i1-GGUF',
  'unsloth/LFM2-350M',
  'mradermacher/kulyk-en-uk-i1-GGUF',
  'unsloth/LFM2-700M',
  'lmstudio-community/LFM2-350M-MLX-8bit',
  'mradermacher/DentaInstruct-1.2B-GGUF',
  'mradermacher/SoftwareArchitecture-Instruct-v1-GGUF',
];

interface HubModelResponse {
  id: string;
  downloads?: number;
  downloadsAllTime?: number;
  likes?: number;
  cardData?: {
    base_model?: string;
  };
  author?: string;
  tags?: string[];
  config?: {
    model_type?: string;
  };
  gguf?: {
    architecture?: string;
  };
}

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

function isLfm2Model(model: HubModelResponse): boolean {
  if (model.config?.model_type == null) {
    return false;
  }
  return model.config.model_type.toLowerCase().startsWith('lfm2');
}

function isBasedOnLfm2(model: HubModelResponse): boolean {
  return (model.tags ?? []).some((tag) => tag.match(/base_model:.*\/lfm2/i));
}

function isLfm2Architecture(model: HubModelResponse): boolean {
  return model.gguf?.architecture?.toLowerCase()?.startsWith('lfm2') ?? false;
}

function appendQueryParams(url: URL): void {
  url.searchParams.set('limit', '1000');

  url.searchParams.append('expand', 'downloadsAllTime');
  url.searchParams.append('expand', 'likes');
  url.searchParams.append('expand', 'cardData');
  url.searchParams.append('expand', 'config');
  url.searchParams.append('expand', 'tags');
  url.searchParams.append('expand', 'gguf');

  url.searchParams.append('sort', 'downloads');
  url.searchParams.append('direction', '-1');
}

/**
 * Helper function to discover LFM2-related models using HF Hub API
 */
export async function discoverLfm2Models(): Promise<HubModelResponse[]> {
  const allModels = new Map<string, HubModelResponse>();

  console.info('Discovering LFM2 models from HuggingFace Hub API...');

  try {
    // Strategy 1: Search by "lfm2" filter/tag
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
      if (isLfm2Model(model) || isBasedOnLfm2(model) || isLfm2Architecture(model)) {
        allModels.set(model.id, model);
      } else {
        console.warn(`Skipping model ${model.id}:`);
        console.warn(`  - Model type: ${model.config?.model_type}`);
        console.warn(`  - Tags: ${model.tags?.join(', ')}`);
        console.warn(`  - GGUF Architecture: ${model.gguf?.architecture}`);
      }
    });
    console.info(`- Found ${taggedModels.length} models with "lfm2" filter`);

    // Strategy 2: Get LiquidAI models that contain LFM2
    const liquidAIModels = await fetchWithRetry(async () => {
      const url = new URL('https://huggingface.co/api/models');
      url.searchParams.set('author', 'LiquidAI');
      url.searchParams.set('search', 'LFM2');
      appendQueryParams(url);

      console.debug(`Searching LiquidAI org for LFM2 with URL: ${url.toString()}`);
      const res = await fetch(url.toString());
      if (!res.ok) {
        const error = new Error(`HTTP ${res.status}: ${res.statusText}`);
        (error as any).status = res.status;
        throw error;
      }
      return res.json();
    });

    liquidAIModels.forEach((model: HubModelResponse) => {
      allModels.set(model.id, model);
    });
    console.info(`- Found ${liquidAIModels.length} LiquidAI LFM2 models`);

    const discoveredModels = Array.from(allModels.values());
    console.info(`Total unique models discovered: ${discoveredModels.length}`);

    return discoveredModels;
  } catch (error: any) {
    console.error('Error discovering models:', error);
    throw error;
  }
}

/**
 * Main function to scrape HuggingFace model collection
 */
export async function scrapeHuggingFaceCollection(): Promise<HfCrawlerResult> {
  console.group('Starting scraping LFM2 model stats from HF...');

  try {
    const models: HubModelResponse[] = await discoverLfm2Models();

    // Sort by downloads (descending)
    models.sort((a, b) => {
      const downloadsA = a.downloadsAllTime || a.downloads || 0;
      const downloadsB = b.downloadsAllTime || b.downloads || 0;
      return downloadsB - downloadsA;
    });

    const modelStats: HfModelStatEntry[] = models.map((model) => {
      const downloadCount = model.downloadsAllTime || model.downloads || 0;
      const likeCount = model.likes || 0;

      return {
        name: model.id,
        downloadCount,
        likeCount,
      };
    });

    console.info(`Successfully scraped ${modelStats.length} LFM2 models`);
    console.info(`Total downloads: ${modelStats.reduce((sum, m) => sum + m.downloadCount, 0)}`);
    console.info(`Total likes: ${modelStats.reduce((sum, m) => sum + m.likeCount, 0)}`);

    const allModelNames = modelStats.map((m) => m.name);
    const missingModels = KNOWN_LFM2_MODELS.filter((m) => !allModelNames.includes(m));
    if (missingModels.length > 0) {
      console.warn('The following target models were not found in the scrape:');
      missingModels.forEach((m) => console.warn(`- ${m}`));
    }

    console.groupEnd();

    return {
      models: modelStats,
      totalModels: modelStats.length,
      scrapedAt: new Date(),
    };
  } catch (error: any) {
    console.error('Error scraping HuggingFace collection:', error);
    throw error;
  }
}
