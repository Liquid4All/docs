import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  lfm: [
    'getting-started/index',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: [
        'getting-started/quickstart',
        'key-concepts/models',
        'key-concepts/chat-template',
        'key-concepts/tool-use',
      ],
    },
    {
      type: 'category',
      label: 'Inference',
      collapsed: false,
      items: [
        // 'inference/overview',
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
    {
      type: 'link',
      label: 'Discord',
      href: 'https://discord.gg/DFU3WQeaYD',
    },
  ],
};

export default sidebars;
