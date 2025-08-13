export interface ModelData {
  name: string;
  downloadCount: number;
  likeCount: number;
}

export interface ScrapingResult {
  models: ModelData[];
  totalModels: number;
  scrapedAt: Date;
}

export const DEFAULT_LFM_COLLECTION_URL =
  'https://huggingface.co/collections/LiquidAI/lfm2-686d721927015b2ad73eaa38';

export function parseFormattedNumber(text: string): number {
  const cleanText = text.trim().toLowerCase();
  if (cleanText.includes('k')) {
    const num = parseFloat(cleanText.replace('k', ''));
    return Math.round(num * 1000);
  }
  return parseInt(cleanText.replace(/,/g, ''), 10) || 0;
}

function extractTextFromHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractArticleElements(html: string): string[] {
  const articleRegex = /<article[^>]*>([\s\S]*?)<\/article>/gi;
  const articles: string[] = [];
  let match;

  while ((match = articleRegex.exec(html)) !== null) {
    articles.push(match[1]);
  }

  return articles;
}

function extractModelName(articleHtml: string): string {
  const h4Regex = /<h4[^>]*>([\s\S]*?)<\/h4>/i;
  const match = articleHtml.match(h4Regex);
  if (match) {
    return extractTextFromHtml(match[1]).trim();
  }
  return '';
}

export async function scrapeHuggingFaceCollection(collectionUrl: string): Promise<ScrapingResult> {
  try {
    console.info(`Fetching HTML from: ${collectionUrl}`);

    const response = await fetch(collectionUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const articleElements = extractArticleElements(html);
    console.info(`Found ${articleElements.length} model cards`);

    const models: ModelData[] = [];

    for (const articleHtml of articleElements) {
      try {
        const name = extractModelName(articleHtml);

        const fullText = extractTextFromHtml(articleHtml);
        const lines = fullText.split(/\s+/).filter((line: string) => line.trim());

        let downloadCount = 0;
        let likeCount = 0;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          if (line.match(/^\d+(\.\d+)?k?$/) || line.match(/^\d{1,3}(,\d{3})*$/)) {
            const number = parseFormattedNumber(line);
            if (likeCount === 0) {
              likeCount = number;
            } else if (downloadCount === 0) {
              downloadCount = number;
              break;
            }
          }
        }

        if (name) {
          models.push({
            name: name,
            downloadCount,
            likeCount,
          });
          console.info(
            `Scraped: ${name}: total downloads - ${downloadCount}, total likes - ${likeCount}`
          );
        }
      } catch (error) {
        console.warn('Error processing model element:', error);
      }
    }

    return {
      models,
      totalModels: models.length,
      scrapedAt: new Date(),
    };
  } catch (error) {
    console.error('Error scraping HuggingFace collection:', error);
    throw error;
  }
}
