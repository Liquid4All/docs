import { isEmptyString } from '@liquidai/leap-lib/utils';
import * as cheerio from 'cheerio';

export const extractModelSlugs = (html: string): string[] => {
  if (isEmptyString(html)) {
    return [];
  }

  const $ = cheerio.load(html);
  const models: string[] = [];

  // Look for article elements with class "overview-card-wrapper"
  $('article.overview-card-wrapper').each((_, element) => {
    // Find the anchor tag within the article
    const anchor = $(element).find('a').first();
    const href = anchor.attr('href');

    if (href) {
      // Remove leading slash if present
      const modelSlug = href.startsWith('/') ? href.slice(1) : href;
      models.push(modelSlug);
    }
  });

  return models;
};

const fetchPage = async (pageNumber: number): Promise<string> => {
  const url = `https://huggingface.co/models?p=${pageNumber}&sort=created&search=lfm2`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return '';
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    return await response.text();
  } catch (error) {
    console.error(`Failed to fetch page ${pageNumber + 1}:`, error);
    throw error;
  }
};

export const searchLfm2ModelSlugsFromWebQuery = async (): Promise<string[]> => {
  console.group('Starting web scraping for LFM2 models...');

  const allModels: string[] = [];
  let successfulPages = 0;

  let p = 0;
  const maxPages = 99;
  while (p < maxPages) {
    try {
      const html = await fetchPage(p);
      const models = extractModelSlugs(html);

      if (models.length === 0) {
        console.info(`No models found on page ${p + 1}`);
        break;
      }

      console.debug(`Found ${models.length} models on page ${p + 1}`);
      allModels.push(...models);
      successfulPages++;

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Skipping page ${p + 1} due to error`);
      break;
    } finally {
      ++p;
    }
  }

  const uniqueModels = [...new Set(allModels)];
  console.info(`Pages successfully scraped: ${successfulPages}`);
  console.info(`Total models found: ${uniqueModels.length}`);
  console.groupEnd();

  return uniqueModels;
};
