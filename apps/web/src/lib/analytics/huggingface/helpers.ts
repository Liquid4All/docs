import { HubModelResponse } from '@/lib/analytics/huggingface/types';

type Lfm2CheckResult =
  | { result: true }
  | {
      result: false;
      message: string;
    };

const isModelTypeLfm2 = (model: HubModelResponse): Lfm2CheckResult => {
  let result: boolean;
  if (model.config?.model_type == null) {
    result = false;
  } else {
    result = model.config.model_type.toLowerCase().startsWith('lfm2');
  }

  const message = `Model type: ${model.config?.model_type}`;
  return result ? { result: true } : { result: false, message };
};

const isBasedOnLfm2 = (model: HubModelResponse): Lfm2CheckResult => {
  const result = (model.tags ?? []).some(
    (tag) => tag.toLowerCase() === 'lfm2' || tag.match(/base_model:.*\/lfm2/i)
  );
  const message = `Tags: ${model.tags?.join(', ')}`;
  return result ? { result: true } : { result: false, message };
};

const hasLfm2Architecture = (model: HubModelResponse): Lfm2CheckResult => {
  const result = model.gguf?.architecture?.toLowerCase()?.startsWith('lfm2') ?? false;
  const message = `GGUF Architecture: ${model.gguf?.architecture}`;
  return result ? { result: true } : { result: false, message };
};

export const isLmf2Model = (model: HubModelResponse): boolean => {
  const messages: string[] = [];
  const checks = [isModelTypeLfm2, isBasedOnLfm2, hasLfm2Architecture];
  let isLfm2 = false;
  for (const check of checks) {
    const res = check(model);
    if (res.result) {
      isLfm2 = true;
      break;
    } else {
      messages.push(res.message);
    }
  }

  if (isLfm2) {
    return true;
  } else {
    console.warn(`Skipping model ${model.id}:`);
    for (const msg of messages) {
      console.warn(`  - ${msg}`);
    }
    return false;
  }
};

export function appendQueryParams(url: URL): void {
  url.searchParams.set('limit', '1000');

  url.searchParams.append('expand', 'downloadsAllTime');
  url.searchParams.append('expand', 'likes');
  url.searchParams.append('expand', 'cardData');
  url.searchParams.append('expand', 'config');
  url.searchParams.append('expand', 'tags');
  url.searchParams.append('expand', 'gguf');
  url.searchParams.append('expand', 'createdAt');
  url.searchParams.append('expand', 'lastModified');

  url.searchParams.append('sort', 'downloads');
  url.searchParams.append('direction', '-1');
}

export const getHfModel = async (modelSlug: string): Promise<HubModelResponse> => {
  const url = new URL(`https://huggingface.co/api/models/${modelSlug}`);
  appendQueryParams(url);
  console.debug(`Fetching model info with URL: ${url.toString()}`);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const error = new Error(`HTTP ${res.status}: ${res.statusText}`);
    (error as any).status = res.status;
    throw error;
  }
  return (await res.json()) as HubModelResponse;
};
