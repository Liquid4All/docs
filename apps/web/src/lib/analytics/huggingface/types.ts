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
