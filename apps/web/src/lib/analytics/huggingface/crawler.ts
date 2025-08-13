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

function extractDownloadAndLikeCounts(articleHtml: string): {
  downloadCount: number;
  likeCount: number;
} {
  // Remove all SVG elements first to simplify parsing
  const cleanHtml = articleHtml.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, ' ');

  // Extract text and split into tokens
  const fullText = extractTextFromHtml(cleanHtml);
  const tokens = fullText.split(/\s+/).filter((token: string) => token.trim());

  // Find the position after "Updated" and time info
  let startIndex = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].toLowerCase().includes('updated')) {
      // Skip ahead past the time information (typically "X day ago" or similar)
      startIndex = i + 4; // Skip "Updated", number, "day/days", "ago"
      break;
    }
  }

  // If no "Updated" found, start from the beginning but skip obvious non-stats
  if (startIndex === -1) {
    startIndex = 0;
  }

  // Collect numbers that appear after the start position
  const numbers: string[] = [];
  for (let i = startIndex; i < tokens.length; i++) {
    const token = tokens[i];
    // Look for number patterns but exclude parameter counts (1B, 0.7B, etc.)
    if (
      (token.match(/^\d+(\.\d+)?k?$/) || token.match(/^\d{1,3}(,\d{3})*$/)) &&
      !token.match(/^\d+(\.\d+)?[BM]$/i)
    ) {
      numbers.push(token);
    }
  }

  // Take the last two numbers found - these should be download count and like count
  const relevantNumbers = numbers.slice(-2);

  return {
    downloadCount: relevantNumbers[0] ? parseFormattedNumber(relevantNumbers[0]) : 0,
    likeCount: relevantNumbers[1] ? parseFormattedNumber(relevantNumbers[1]) : 0,
  };
}

export function parseModelCollectionPage(html: string): Omit<ScrapingResult, 'scrapedAt'> {
  const articleElements = extractArticleElements(html);
  console.info(`Found ${articleElements.length} model cards`);

  const models: ModelData[] = [];

  for (const articleHtml of articleElements) {
    try {
      const name = extractModelName(articleHtml);
      const { downloadCount, likeCount } = extractDownloadAndLikeCounts(articleHtml);

      if (name) {
        models.push({
          name: name,
          downloadCount,
          likeCount,
        });
        console.info(`Scraped: ${name}: downloads - ${downloadCount}, likes - ${likeCount}`);
      }
    } catch (error) {
      console.warn('Error processing model element:', error);
    }
  }

  return {
    models,
    totalModels: models.length,
  };
}

export async function fetchModelCollectionPage(collectionUrl: string): Promise<string> {
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

  return response.text();
}

export async function scrapeHuggingFaceCollection(collectionUrl: string): Promise<ScrapingResult> {
  try {
    const html = await fetchModelCollectionPage(collectionUrl);
    const parseResult = parseModelCollectionPage(html);

    return {
      ...parseResult,
      scrapedAt: new Date(),
    };
  } catch (error) {
    console.error('Error scraping HuggingFace collection:', error);
    throw error;
  }
}
