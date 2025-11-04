import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  lfm: [
    'index',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: [
        'getting-started/models',
        'getting-started/chat-template',
        'getting-started/tool-use',
      ],
    },
    {
      type: 'category',
      label: 'Inference',
      collapsed: false,
      items: [
        'inference/transformers',
        'inference/vllm',
        'inference/llama-cpp',
        'inference/mlx',
        'inference/lm-studio',
        'inference/ollama',
      ],
    },
    {
      type: 'category',
      label: 'Fine-tuning',
      collapsed: false,
      items: ['fine-tuning/trl', 'fine-tuning/unsloth', 'fine-tuning/axolotl'],
    },
    {
      type: 'category',
      label: 'Frameworks',
      collapsed: false,
      items: ['frameworks/leap', 'frameworks/outlines'],
    },
  ],
};

export default sidebars;
