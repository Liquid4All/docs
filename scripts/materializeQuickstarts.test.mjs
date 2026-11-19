import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { materialize, renderQuickstart } from './materializeQuickstarts.mjs';

test('text quickstarts retain literal Python and shell syntax in Markdown', () => {
  const input = 'import { TextTransformers } from "/snippets/quickstart/text-transformers.mdx";\n<TextTransformers modelId="LiquidAI/LFM2-1.2B" samplingParams="do_sample=False, " />';
  const result = materialize(input);
  assert.match(result, /```python\nfrom transformers import/);
  assert.match(result, /from_pretrained\(/);
  assert.doesNotMatch(result, /from\\_pretrained|<TextTransformers|^import /);
  assert.equal(materialize(result), result);
});

test('audio exports include complete TTS commands and unchanged media tokens', () => {
  const result = renderQuickstart({ source: '/snippets/quickstart/audio-llamacpp.mdx', component: 'AudioLlamacpp', props: { ggufRepo: 'LiquidAI/LFM3-Audio-2B-GGUF', ttsFlags: '--tts-lang ja' } });
  assert.match(result, /```bash\nhf download[^`]*\nllama-tts/);
  assert.match(result, /-p "<__media__>"/);
  assert.match(result, /--tts-lang ja -o out.wav/);
  assert.doesNotMatch(result, /undefined|<\*\*media\*\*>/);
});

test('all checked-in model quickstarts match the shared templates', () => {
  for (const file of fs.readdirSync('lfm/models').filter((name) => name.endsWith('.mdx'))) {
    const source = fs.readFileSync(`lfm/models/${file}`, 'utf8');
    assert.equal(materialize(source), source, file);
  }
});
