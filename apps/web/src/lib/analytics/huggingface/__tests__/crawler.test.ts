import { readFileSync } from 'fs';
import { join } from 'path';

import { parseFormattedNumber, parseModelCollectionPage } from '../crawler';

describe('parseFormattedNumber', () => {
  test('parses numbers with k suffix', () => {
    expect(parseFormattedNumber('2.5k')).toBe(2500);
    expect(parseFormattedNumber('10k')).toBe(10000);
    expect(parseFormattedNumber('1.2K')).toBe(1200);
    expect(parseFormattedNumber('21.2k')).toBe(21200);
    expect(parseFormattedNumber('36.5k')).toBe(36500);
  });

  test('parses regular numbers', () => {
    expect(parseFormattedNumber('123')).toBe(123);
    expect(parseFormattedNumber('1,234')).toBe(1234);
    expect(parseFormattedNumber('5,678,901')).toBe(5678901);
    expect(parseFormattedNumber('241')).toBe(241);
    expect(parseFormattedNumber('1.02k')).toBe(1020);
  });

  test('handles edge cases', () => {
    expect(parseFormattedNumber('')).toBe(0);
    expect(parseFormattedNumber('invalid')).toBe(0);
    expect(parseFormattedNumber('  500  ')).toBe(500);
  });
});

describe('parseHuggingFaceCollectionHtml', () => {
  let exampleHtml: string;

  beforeAll(() => {
    // Read the example HTML file
    const htmlPath = join(__dirname, 'example_page.html');
    exampleHtml = readFileSync(htmlPath, 'utf-8');
  });

  test('parses HTML and extracts model data correctly', () => {
    const result = parseModelCollectionPage(exampleHtml);

    expect(result).toHaveProperty('models');
    expect(result).toHaveProperty('totalModels');
    expect(Array.isArray(result.models)).toBe(true);
    expect(result.totalModels).toBe(result.models.length);
    expect(result.totalModels).toBe(12);

    // Test specific models from the example HTML
    const models = result.models;

    // First model: LiquidAI/LFM2-1.2B
    const lfm12b = models.find((m) => m.name === 'LiquidAI/LFM2-1.2B');
    expect(lfm12b).toBeDefined();
    expect(lfm12b?.downloadCount).toBe(21200); // 21.2k
    expect(lfm12b?.likeCount).toBe(241);

    // Second model: LiquidAI/LFM2-700M
    const lfm700m = models.find((m) => m.name === 'LiquidAI/LFM2-700M');
    expect(lfm700m).toBeDefined();
    expect(lfm700m?.downloadCount).toBe(2730); // 2.73k
    expect(lfm700m?.likeCount).toBe(64);

    // Third model: LiquidAI/LFM2-350M
    const lfm350m = models.find((m) => m.name === 'LiquidAI/LFM2-350M');
    expect(lfm350m).toBeDefined();
    expect(lfm350m?.downloadCount).toBe(12700); // 12.7k
    expect(lfm350m?.likeCount).toBe(94);

    // GGUF model: LiquidAI/LFM2-1.2B-GGUF
    const lfmGguf = models.find((m) => m.name === 'LiquidAI/LFM2-1.2B-GGUF');
    expect(lfmGguf).toBeDefined();
    expect(lfmGguf?.downloadCount).toBe(36500); // 36.5k
    expect(lfmGguf?.likeCount).toBe(65);

    // MLX model: mlx-community/LFM2-1.2B-8bit
    const mlxModel = models.find((m) => m.name === 'mlx-community/LFM2-1.2B-8bit');
    expect(mlxModel).toBeDefined();
    expect(mlxModel?.downloadCount).toBe(1020); // 1.02k
    expect(mlxModel?.likeCount).toBe(1);

    // ONNX model: onnx-community/LFM2-1.2B-ONNX
    const onnxModel = models.find((m) => m.name === 'onnx-community/LFM2-1.2B-ONNX');
    expect(onnxModel).toBeDefined();
    expect(onnxModel?.downloadCount).toBe(576);
    expect(onnxModel?.likeCount).toBe(7);
  });

  test('handles empty HTML gracefully', () => {
    const result = parseModelCollectionPage('');

    expect(result.models).toEqual([]);
    expect(result.totalModels).toBe(0);
  });

  test('handles HTML without article elements', () => {
    const htmlWithoutArticles = '<html><body><div>No articles here</div></body></html>';
    const result = parseModelCollectionPage(htmlWithoutArticles);

    expect(result.models).toEqual([]);
    expect(result.totalModels).toBe(0);
  });

  test('handles malformed article elements gracefully', () => {
    const malformedHtml = `
      <article>
        <h4>Model Name</h4>
        <div>Some content without numbers</div>
      </article>
    `;

    const result = parseModelCollectionPage(malformedHtml);

    expect(result.models).toHaveLength(1);
    expect(result.models[0].name).toBe('Model Name');
    expect(result.models[0].downloadCount).toBe(0);
    expect(result.models[0].likeCount).toBe(0);
  });

  test('handles single model with k-formatted numbers', () => {
    const singleModelHtml = `
      <article class="overview-card-wrapper group/repo">
        <a class="flex items-center justify-between gap-4 p-2" href="/test/model">
          <div class="w-full truncate">
            <header class="flex items-center mb-0.5" title="test/model">
              <h4 class="text-md truncate font-mono text-black">test/model</h4>
            </header>
            <div class="mr-1 flex items-center">
              <svg class="flex-none w-3 text-gray-400 mr-0.5" viewBox="0 0 32 32">
                <path fill="currentColor" d="M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zm0-10l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10l10-10z"></path>
              </svg>
              5.5k
              <svg class="flex-none w-3 text-gray-400 mr-1" viewBox="0 0 32 32" fill="currentColor">
                <path d="M22.5,4c-2,0-3.9,0.8-5.3,2.2L16,7.4l-1.1-1.1C12,3.3,7.2,3.3,4.3,6.2c0,0-0.1,0.1-0.1,0.1c-3,3-3,7.8,0,10.8L16,29l11.8-11.9c3-3,3-7.8,0-10.8C26.4,4.8,24.5,4,22.5,4z"></path>
              </svg>
              150
            </div>
          </div>
        </a>
      </article>
    `;

    const result = parseModelCollectionPage(singleModelHtml);

    expect(result.models).toHaveLength(1);
    expect(result.models[0].name).toBe('test/model');
    expect(result.models[0].downloadCount).toBe(5500); // 5.5k
    expect(result.models[0].likeCount).toBe(150);
  });

  test('handles model with comma-separated numbers', () => {
    const commaNumbersHtml = `
      <article class="overview-card-wrapper group/repo">
        <a class="flex items-center justify-between gap-4 p-2" href="/test/big-model">
          <div class="w-full truncate">
            <header class="flex items-center mb-0.5" title="test/big-model">
              <h4 class="text-md truncate font-mono text-black">test/big-model</h4>
            </header>
            <div class="mr-1 flex items-center">
              <svg class="flex-none w-3 text-gray-400 mr-0.5" viewBox="0 0 32 32">
                <path fill="currentColor" d="M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zm0-10l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10l10-10z"></path>
              </svg>
              1,234,567
              <svg class="flex-none w-3 text-gray-400 mr-1" viewBox="0 0 32 32" fill="currentColor">
                <path d="M22.5,4c-2,0-3.9,0.8-5.3,2.2L16,7.4l-1.1-1.1C12,3.3,7.2,3.3,4.3,6.2c0,0-0.1,0.1-0.1,0.1c-3,3-3,7.8,0,10.8L16,29l11.8-11.9c3-3,3-7.8,0-10.8C26.4,4.8,24.5,4,22.5,4z"></path>
              </svg>
              2,345
            </div>
          </div>
        </a>
      </article>
    `;

    const result = parseModelCollectionPage(commaNumbersHtml);

    expect(result.models).toHaveLength(1);
    expect(result.models[0].name).toBe('test/big-model');
    expect(result.models[0].downloadCount).toBe(1234567);
    expect(result.models[0].likeCount).toBe(2345);
  });

  test('handles model with only download count (no likes)', () => {
    const onlyDownloadsHtml = `
      <article class="overview-card-wrapper group/repo">
        <a class="flex items-center justify-between gap-4 p-2" href="/test/no-likes">
          <div class="w-full truncate">
            <header class="flex items-center mb-0.5" title="test/no-likes">
              <h4 class="text-md truncate font-mono text-black">test/no-likes</h4>
            </header>
            <div class="mr-1 flex items-center">
              <svg class="flex-none w-3 text-gray-400 mr-0.5" viewBox="0 0 32 32">
                <path fill="currentColor" d="M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zm0-10l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10l10-10z"></path>
              </svg>
              999
            </div>
          </div>
        </a>
      </article>
    `;

    const result = parseModelCollectionPage(onlyDownloadsHtml);

    expect(result.models).toHaveLength(1);
    expect(result.models[0].name).toBe('test/no-likes');
    expect(result.models[0].downloadCount).toBe(999);
    expect(result.models[0].likeCount).toBe(0);
  });

  test('handles model with zero stats', () => {
    const zeroStatsHtml = `
      <article class="overview-card-wrapper group/repo">
        <a class="flex items-center justify-between gap-4 p-2" href="/test/zero-stats">
          <div class="w-full truncate">
            <header class="flex items-center mb-0.5" title="test/zero-stats">
              <h4 class="text-md truncate font-mono text-black">test/zero-stats</h4>
            </header>
            <div class="mr-1 flex items-center">
              <svg class="flex-none w-3 text-gray-400 mr-0.5" viewBox="0 0 32 32">
                <path fill="currentColor" d="M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zm0-10l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10l10-10z"></path>
              </svg>
              0
              <svg class="flex-none w-3 text-gray-400 mr-1" viewBox="0 0 32 32" fill="currentColor">
                <path d="M22.5,4c-2,0-3.9,0.8-5.3,2.2L16,7.4l-1.1-1.1C12,3.3,7.2,3.3,4.3,6.2c0,0-0.1,0.1-0.1,0.1c-3,3-3,7.8,0,10.8L16,29l11.8-11.9c3-3,3-7.8,0-10.8C26.4,4.8,24.5,4,22.5,4z"></path>
              </svg>
              0
            </div>
          </div>
        </a>
      </article>
    `;

    const result = parseModelCollectionPage(zeroStatsHtml);

    expect(result.models).toHaveLength(1);
    expect(result.models[0].name).toBe('test/zero-stats');
    expect(result.models[0].downloadCount).toBe(0);
    expect(result.models[0].likeCount).toBe(0);
  });

  test('handles mixed number formats in multiple models', () => {
    const mixedFormatsHtml = `
      <article class="overview-card-wrapper group/repo">
        <a class="flex items-center justify-between gap-4 p-2" href="/test/model1">
          <div class="w-full truncate">
            <header class="flex items-center mb-0.5" title="test/model1">
              <h4 class="text-md truncate font-mono text-black">test/model1</h4>
            </header>
            <div class="mr-1 flex items-center">
              <svg class="flex-none w-3 text-gray-400 mr-0.5" viewBox="0 0 32 32">
                <path fill="currentColor" d="M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zm0-10l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10l10-10z"></path>
              </svg>
              10.5k
              <svg class="flex-none w-3 text-gray-400 mr-1" viewBox="0 0 32 32" fill="currentColor">
                <path d="M22.5,4c-2,0-3.9,0.8-5.3,2.2L16,7.4l-1.1-1.1C12,3.3,7.2,3.3,4.3,6.2c0,0-0.1,0.1-0.1,0.1c-3,3-3,7.8,0,10.8L16,29l11.8-11.9c3-3,3-7.8,0-10.8C26.4,4.8,24.5,4,22.5,4z"></path>
              </svg>
              1,500
            </div>
          </div>
        </a>
      </article>
      <article class="overview-card-wrapper group/repo">
        <a class="flex items-center justify-between gap-4 p-2" href="/test/model2">
          <div class="w-full truncate">
            <header class="flex items-center mb-0.5" title="test/model2">
              <h4 class="text-md truncate font-mono text-black">test/model2</h4>
            </header>
            <div class="mr-1 flex items-center">
              <svg class="flex-none w-3 text-gray-400 mr-0.5" viewBox="0 0 32 32">
                <path fill="currentColor" d="M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zm0-10l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10l10-10z"></path>
              </svg>
              500
              <svg class="flex-none w-3 text-gray-400 mr-1" viewBox="0 0 32 32" fill="currentColor">
                <path d="M22.5,4c-2,0-3.9,0.8-5.3,2.2L16,7.4l-1.1-1.1C12,3.3,7.2,3.3,4.3,6.2c0,0-0.1,0.1-0.1,0.1c-3,3-3,7.8,0,10.8L16,29l11.8-11.9c3-3,3-7.8,0-10.8C26.4,4.8,24.5,4,22.5,4z"></path>
              </svg>
              25
            </div>
          </div>
        </a>
      </article>
    `;

    const result = parseModelCollectionPage(mixedFormatsHtml);

    expect(result.models).toHaveLength(2);

    expect(result.models[0].name).toBe('test/model1');
    expect(result.models[0].downloadCount).toBe(10500); // 10.5k
    expect(result.models[0].likeCount).toBe(1500);

    expect(result.models[1].name).toBe('test/model2');
    expect(result.models[1].downloadCount).toBe(500);
    expect(result.models[1].likeCount).toBe(25);
  });
});
