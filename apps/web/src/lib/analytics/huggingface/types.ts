export interface HubModelResponse {
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

export interface HfModelStatEntry {
  name: string;
  downloadCount: number;
  likeCount: number;
}

export interface HfCrawlerResult {
  models: HfModelStatEntry[];
  totalModels: number;
  scrapedAt: Date;
}

export enum Lfm2Modality {
  VL = 'VL',
}
