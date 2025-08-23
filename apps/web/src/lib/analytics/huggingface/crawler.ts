import { HfCrawlerResult, HfModelStatEntry } from '@/lib/analytics/huggingface/types';

const TARGET_MODELS = [
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

export async function scrapeHuggingFaceCollection(): Promise<HfCrawlerResult> {
  const models: HfModelStatEntry[] = [];
  console.info(`Fetching stats for ${TARGET_MODELS.length} specific LFM2 models...`);

  try {
    for (const modelName of TARGET_MODELS) {
      console.info(`Fetching stats for: ${modelName}`);

      const modelData = await fetchWithRetry(async () => {
        const res = await fetch(
          `https://huggingface.co/api/models/${modelName}?expand=downloadsAllTime&expand=likes`
        );
        if (!res.ok) {
          if (res.status === 404) {
            console.warn(`Model not found: ${modelName}`);
            return null;
          }
          const error = new Error(`HTTP ${res.status}: ${res.statusText}`);
          (error as any).status = res.status;
          throw error;
        }
        return res.json();
      });

      if (modelData != null) {
        const modelStats: HfModelStatEntry = {
          name: modelData.id || modelName,
          downloadCount: modelData.downloadsAllTime || 0,
          likeCount: modelData.likes || 0,
        };

        models.push(modelStats);
        console.info(`- ${modelStats.downloadCount} downloads, ${modelStats.likeCount} likes`);
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  } catch (error: any) {
    console.error('Error fetching model stats:', error);
    throw error;
  }

  return {
    models,
    totalModels: models.length,
    scrapedAt: new Date(),
  };
}
