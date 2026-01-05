import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  lfm: [
    // 'getting-started/index',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: [
        'getting-started/intro',
        'getting-started/quickstart', // Keep in nav, but pagination will skip it
        'key-concepts/models',
      ],
    },
    {
      type: 'category',
      label: 'Key concepts',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'key-concepts/chat-template',
      },
      items: [
        'key-concepts/chat-template', // Keep in nav, but pagination will skip it
        'key-concepts/text-generation-and-prompting',
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
        'inference/modal-deployment',
        'inference/baseten-deployment',
        'inference/fal-deployment',
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
        // 'fine-tuning/axolotl', // Hidden but not deleted
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
