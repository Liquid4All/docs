import { parseModelName } from '../persistence';

describe('parseModelName', () => {
  describe('complete model names with all components', () => {
    it('parses model with VL modality and variant', () => {
      const result = parseModelName('LiquidAI/LFM2-VL-1.2B-math');
      expect(result).toEqual({
        organization: 'LiquidAI',
        model_slug: 'LFM2-VL-1.2B-math',
        model_size: '1.2B',
        model_variant: 'math',
        model_modality: 'VL',
      });
    });

    it('parses model with different size formats', () => {
      const result = parseModelName('OpenAI/GPT-VL-7B-instruct');
      expect(result).toEqual({
        organization: 'OpenAI',
        model_slug: 'GPT-VL-7B-instruct',
        model_size: '7B',
        model_variant: 'instruct',
        model_modality: 'VL',
      });
    });

    it('parses model with M (million) size', () => {
      const result = parseModelName('Meta/Llama-VL-500M-base');
      expect(result).toEqual({
        organization: 'Meta',
        model_slug: 'Llama-VL-500M-base',
        model_size: '500M',
        model_variant: 'base',
        model_modality: 'VL',
      });
    });

    it('parses model with K (thousand) size', () => {
      const result = parseModelName('TestOrg/Model-VL-250K-test');
      expect(result).toEqual({
        organization: 'TestOrg',
        model_slug: 'Model-VL-250K-test',
        model_size: '250K',
        model_variant: 'test',
        model_modality: 'VL',
      });
    });
  });

  describe('models without modality', () => {
    it('parses model without modality but with variant', () => {
      const result = parseModelName('OpenAI/GPT-3.5B-turbo');
      expect(result).toEqual({
        organization: 'OpenAI',
        model_slug: 'GPT-3.5B-turbo',
        model_size: '3.5B',
        model_variant: 'turbo',
        model_modality: null,
      });
    });

    it('parses simple model without modality or variant', () => {
      const result = parseModelName('Meta/Llama-7B');
      expect(result).toEqual({
        organization: 'Meta',
        model_slug: 'Llama-7B',
        model_size: '7B',
        model_variant: null,
        model_modality: null,
      });
    });
  });

  describe('models without variants', () => {
    it('parses model with modality but no variant', () => {
      const result = parseModelName('TestOrg/Model-VL-1B');
      expect(result).toEqual({
        organization: 'TestOrg',
        model_slug: 'Model-VL-1B',
        model_size: '1B',
        model_variant: null,
        model_modality: 'VL',
      });
    });
  });

  describe('edge cases and error handling', () => {
    it('handles model names without size', () => {
      const result = parseModelName('TestOrg/SimpleModel');
      expect(result).toEqual({
        organization: 'TestOrg',
        model_slug: 'SimpleModel',
        model_size: '',
        model_variant: null,
        model_modality: null,
      });
    });

    it('throws error for empty string', () => {
      expect(() => parseModelName('')).toThrow('Model name cannot be empty');
    });

    it('throws error for whitespace-only string', () => {
      expect(() => parseModelName('   ')).toThrow('Model name cannot be empty');
    });

    it('throws error for model names without organization separator', () => {
      expect(() => parseModelName('SimpleModel-VL-1B-test')).toThrow(
        'Model part is required in format "organization/model"'
      );
    });

    it('throws error for empty organization', () => {
      expect(() => parseModelName('/Model-VL-1B-test')).toThrow(
        'Organization is required in model name'
      );
    });

    it('throws error for whitespace-only organization', () => {
      expect(() => parseModelName('   /Model-VL-1B-test')).toThrow(
        'Organization is required in model name'
      );
    });

    it('handles model names with empty model part', () => {
      const result = parseModelName('TestOrg/');
      expect(result).toEqual({
        organization: 'TestOrg',
        model_slug: '',
        model_size: '',
        model_variant: null,
        model_modality: null,
      });
    });
  });

  describe('case sensitivity', () => {
    it('handles lowercase modality and converts to uppercase', () => {
      const result = parseModelName('TestOrg/Model-vl-1B-test');
      expect(result).toEqual({
        organization: 'TestOrg',
        model_slug: 'Model-vl-1B-test',
        model_size: '1B',
        model_variant: 'test',
        model_modality: 'VL',
      });
    });

    it('handles mixed case modality', () => {
      const result = parseModelName('TestOrg/Model-Vl-1B-test');
      expect(result).toEqual({
        organization: 'TestOrg',
        model_slug: 'Model-Vl-1B-test',
        model_size: '1B',
        model_variant: 'test',
        model_modality: 'VL',
      });
    });
  });

  describe('different modality lengths', () => {
    it('handles single character modality', () => {
      const result = parseModelName('TestOrg/Model-V-1B-test');
      expect(result).toEqual({
        organization: 'TestOrg',
        model_slug: 'Model-V-1B-test',
        model_size: '1B',
        model_variant: 'test',
        model_modality: 'V',
      });
    });

    it('handles three character modality', () => {
      const result = parseModelName('TestOrg/Model-VLA-1B-test');
      expect(result).toEqual({
        organization: 'TestOrg',
        model_slug: 'Model-VLA-1B-test',
        model_size: '1B',
        model_variant: 'test',
        model_modality: 'VLA',
      });
    });
  });

  describe('complex variants', () => {
    it('handles variant with multiple words separated by dashes', () => {
      const result = parseModelName('TestOrg/Model-VL-1B-chat-instruct');
      expect(result).toEqual({
        organization: 'TestOrg',
        model_slug: 'Model-VL-1B-chat-instruct',
        model_size: '1B',
        model_variant: 'chat-instruct',
        model_modality: 'VL',
      });
    });

    it('handles variant with numbers', () => {
      const result = parseModelName('TestOrg/Model-VL-1B-v2.1');
      expect(result).toEqual({
        organization: 'TestOrg',
        model_slug: 'Model-VL-1B-v2.1',
        model_size: '1B',
        model_variant: 'v2.1',
        model_modality: 'VL',
      });
    });
  });

  describe('decimal sizes', () => {
    it('handles decimal sizes with modality', () => {
      const result = parseModelName('TestOrg/Model-VL-1.3B-test');
      expect(result).toEqual({
        organization: 'TestOrg',
        model_slug: 'Model-VL-1.3B-test',
        model_size: '1.3B',
        model_variant: 'test',
        model_modality: 'VL',
      });
    });

    it('handles decimal sizes without modality', () => {
      const result = parseModelName('TestOrg/Model-2.7B-instruct');
      expect(result).toEqual({
        organization: 'TestOrg',
        model_slug: 'Model-2.7B-instruct',
        model_size: '2.7B',
        model_variant: 'instruct',
        model_modality: null,
      });
    });
  });
});
