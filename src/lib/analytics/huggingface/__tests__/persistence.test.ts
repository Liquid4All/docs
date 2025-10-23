import { Lfm2Modality } from '@/lib/analytics/huggingface/types';

import { parseModelName } from '../persistence';

describe('parseModelName', () => {
  describe('valid inputs', () => {
    const testCases = [
      // Models without modality
      {
        input: 'LiquidAI/LFM2-1.2B',
        expected: {
          organization: 'LiquidAI',
          model_slug: 'LFM2-1.2B',
          model_size: '1.2B',
          model_variant: null,
          model_modality: null,
        },
        description: 'simple LFM2',
      },
      {
        input: 'LiquidAI/LFM2-350M',
        expected: {
          organization: 'LiquidAI',
          model_slug: 'LFM2-350M',
          model_size: '350M',
          model_variant: null,
          model_modality: null,
        },
        description: 'simple LFM2 with M size',
      },
      {
        input: 'LiquidAI/LFM2-9000K',
        expected: {
          organization: 'LiquidAI',
          model_slug: 'LFM2-9000K',
          model_size: '9000K',
          model_variant: null,
          model_modality: null,
        },
        description: 'simplest LFM2 with K size',
      },
      {
        input: 'LiquidAI/LFM2-1.2B-unsloth-bnb-4bit',
        expected: {
          organization: 'LiquidAI',
          model_slug: 'LFM2-1.2B-unsloth-bnb-4bit',
          model_size: '1.2B',
          model_variant: 'unsloth-bnb-4bit',
          model_modality: null,
        },
        description: 'BNB model',
      },
      {
        input: 'LiquidAI/LFM2-700M-MLX-8bit',
        expected: {
          organization: 'LiquidAI',
          model_slug: 'LFM2-700M-MLX-8bit',
          model_size: '700M',
          model_variant: 'MLX-8bit',
          model_modality: null,
        },
        description: 'MLX model',
      },
      {
        input: 'Meta/Llama-7B',
        expected: {
          organization: 'Meta',
          model_slug: 'Llama-7B',
          model_size: '7B',
          model_variant: null,
          model_modality: null,
        },
        description: 'model from other organization',
      },
      {
        input: 'OpenAI/GPT-3.5B-turbo',
        expected: {
          organization: 'OpenAI',
          model_slug: 'GPT-3.5B-turbo',
          model_size: '3.5B',
          model_variant: 'turbo',
          model_modality: null,
        },
        description: 'model from other organization with more tokens',
      },
      // Models with modality
      {
        input: 'LiquidAI/LFM2-VL-1.2B',
        expected: {
          organization: 'LiquidAI',
          model_slug: 'LFM2-VL-1.2B',
          model_size: '1.2B',
          model_variant: null,
          model_modality: Lfm2Modality.VL,
        },
        description: 'model with VL modality',
      },
      {
        input: 'LiquidAI/LFM2-VL-1.2B-math',
        expected: {
          organization: 'LiquidAI',
          model_slug: 'LFM2-VL-1.2B-math',
          model_size: '1.2B',
          model_variant: 'math',
          model_modality: Lfm2Modality.VL,
        },
        description: 'model with VL modality and variant',
      },
      {
        input: 'Meta/Llama-VL-500M-base',
        expected: {
          organization: 'Meta',
          model_slug: 'Llama-VL-500M-base',
          model_size: '500M',
          model_variant: 'base',
          model_modality: Lfm2Modality.VL,
        },
        description: 'model with VL modality and M size',
      },
      {
        input: 'TestOrg/Model-VL-250K-test',
        expected: {
          organization: 'TestOrg',
          model_slug: 'Model-VL-250K-test',
          model_size: '250K',
          model_variant: 'test',
          model_modality: Lfm2Modality.VL,
        },
        description: 'model with VL modality and K size',
      },
      {
        input: 'TestOrg/Model-VL-1.3B-test',
        expected: {
          organization: 'TestOrg',
          model_slug: 'Model-VL-1.3B-test',
          model_size: '1.3B',
          model_variant: 'test',
          model_modality: Lfm2Modality.VL,
        },
        description: 'model with VL modality and decimal size',
      },
      {
        input: 'TestOrg/Model-VL-1B',
        expected: {
          organization: 'TestOrg',
          model_slug: 'Model-VL-1B',
          model_size: '1B',
          model_variant: null,
          model_modality: Lfm2Modality.VL,
        },
        description: 'model with VL modality but no variant',
      },
      {
        input: 'TestOrg/Model-VL-1B-chat-instruct',
        expected: {
          organization: 'TestOrg',
          model_slug: 'Model-VL-1B-chat-instruct',
          model_size: '1B',
          model_variant: 'chat-instruct',
          model_modality: Lfm2Modality.VL,
        },
        description: 'model with VL modality and complex variant',
      },
      {
        input: 'TestOrg/Model-VL-1B-v2.1',
        expected: {
          organization: 'TestOrg',
          model_slug: 'Model-VL-1B-v2.1',
          model_size: '1B',
          model_variant: 'v2.1',
          model_modality: Lfm2Modality.VL,
        },
        description: 'model with VL modality and version variant',
      },
      {
        input: 'TestOrg/Model-vl-1B-test',
        expected: {
          organization: 'TestOrg',
          model_slug: 'Model-vl-1B-test',
          model_size: '1B',
          model_variant: 'test',
          model_modality: Lfm2Modality.VL,
        },
        description: 'case insensitive VL modality',
      },
      // Edge cases
      {
        input: 'TestOrg/SimpleModel',
        expected: {
          organization: 'TestOrg',
          model_slug: 'SimpleModel',
          model_size: '',
          model_variant: null,
          model_modality: null,
        },
        description: 'model names without size',
      },
      {
        input: 'TestOrg/LFM-TTS-ALIAS-1',
        expected: {
          organization: 'TestOrg',
          model_slug: 'LFM-TTS-ALIAS-1',
          model_size: '',
          model_variant: 'TTS-ALIAS-1',
          model_modality: null,
        },
        description: 'model names with variant but without size',
      },
      {
        input: 'TestOrg/',
        expected: {
          organization: 'TestOrg',
          model_slug: '',
          model_size: '',
          model_variant: null,
          model_modality: null,
        },
        description: 'model names with empty model part',
      },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(description, () => {
        const result = parseModelName(input);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('error cases', () => {
    const testCases = [
      {
        input: '',
        expectedError: 'Model name cannot be empty',
        description: 'empty string',
      },
      {
        input: '   ',
        expectedError: 'Model name cannot be empty',
        description: 'whitespace-only string',
      },
      {
        input: 'SimpleModel-VL-1B-test',
        expectedError: 'Model part is required in format "organization/model"',
        description: 'model names without organization separator',
      },
      {
        input: '/Model-VL-1B-test',
        expectedError: 'Organization is required in model name',
        description: 'empty organization',
      },
      {
        input: '   /Model-VL-1B-test',
        expectedError: 'Organization is required in model name',
        description: 'whitespace-only organization',
      },
    ];

    testCases.forEach(({ input, expectedError, description }) => {
      it(description, () => {
        expect(() => parseModelName(input)).toThrow(expectedError);
      });
    });
  });
});
