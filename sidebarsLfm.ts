import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  lfm: [
    'getting-started/index',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'getting-started/quickstart',
      },
      items: [
        'getting-started/quickstart', // Keep in nav, but pagination will skip it
        'key-concepts/models',
        'key-concepts/chat-template',
        'getting-started/text-generation-and-prompting',
        'getting-started/vision',
        'key-concepts/tool-use',
      ],
    },
    {
      type: 'category',
      label: 'Inference',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'inference/transformers',
      },
      items: [
        'inference/transformers', // Keep in nav, but pagination will skip it
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
      collapsed: true,
      link: {
        type: 'doc',
        id: 'fine-tuning/trl',
      },
      items: [
        'fine-tuning/trl', // Keep in nav, but pagination will skip it
        'fine-tuning/unsloth',
        'fine-tuning/axolotl',
      ],
    },
    {
      type: 'category',
      label: 'Frameworks',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'frameworks/leap',
      },
      items: [
        'frameworks/leap', // Keep in nav, but pagination will skip it
        'frameworks/outlines',
      ],
    },
    {
      type: 'link',
      label: 'Discord',
      href: 'https://discord.gg/DFU3WQeaYD',
    },
  ],
};

export default sidebars;
