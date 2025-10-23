import fs from 'fs';
import path from 'path';

import { extractModelSlugs } from '@/lib/analytics/huggingface/web-query';

describe('extractModelSlugs', () => {
  it('extracts the correct model slugs from HTML', () => {
    const htmlContent = fs.readFileSync(path.join(__dirname, 'web-query-results.html'), 'utf-8');
    const modelSlugs = extractModelSlugs(htmlContent);
    expect(modelSlugs.length).toBe(30);
    expect(modelSlugs).toStrictEqual([
      'aghatage/lfm2-350m-marathi-Q4_K_M-GGUF',
      'aghatage/lfm2-350m-marathi',
      'aghatage/lfm2-350m-smoltalk-Q4_K_M-GGUF',
      'aghatage/lfm2-350m-smoltalk',
      'azeddinShr/LFM2-350M-Math-Arabic',
      'LiquidAI/LFM2-Audio-v0',
      'ngxson/LFM2-VL-450M-GGUF-Q4_0',
      'mradermacher/LFM2-1.2B-FRMOO-GGUF',
      'ggml-org/LFM2-test-ci-80M',
      'ngxson/LFM2-test-ci-80M',
      'LiquidAI/LFM2-Audio-600M',
      'LiquidAI/LFM2-ColBERT-350M-RC',
      'sawadogosalif/LFM2-1.2B-FRMOO',
      '9x25dillon/LFM2-8B-A1B-Dimensional-Entanglement',
      'manasdhir04/LFM2-VL-Finetune-v1',
      'mradermacher/LFM2-1.2B-LEAP-multi-counselor-1012-i1-GGUF',
      'mradermacher/LFM2-2.6B-LEAP-multi-counselor-i1-GGUF',
      'mradermacher/shisa-v2.1c-lfm2-350m-i1-GGUF',
      'madoss/LFM2-700M-FRMOO',
      'mradermacher/lfm2b-GGUF',
      'jquessada/LFM2_fr_GGUF',
      'mradermacher/LFM2-1.2B-LEAP-multi-counselor-1012-GGUF',
      'mradermacher/LFM2-2.6B-LEAP-multi-counselor-GGUF',
      'mradermacher/shisa-v2.1c-lfm2-350m-GGUF',
      'mtfum/catan-lfm2-vm',
      'kainoj/LiquidAI-LFM2-1.2B-Extract-ja-pii-finetuned',
      'a1273352/LFM2-1.2B-LEAP-multi-counselor-1012',
      'HayatoHongo/lfm2-vl-ja-finetuned-enmt1ep-jamt10eponall-v2-vqa',
      'kainoj/LiquidAI-LFM2-1.2B-ja-pii-finetuned',
      'HayatoHongo/lfm2-vl-ja-finetuned-enmt1ep-jamt10eponall-v2',
    ]);
  });
});
