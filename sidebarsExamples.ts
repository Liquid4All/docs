import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  examples: [
    'index',
    {
      type: 'category',
      label: 'Laptop examples',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'laptop-examples/invoice-extractor-tool-with-liquid-nanos',
      },
      items: [
        // Removed duplicate since it's already the category link
      ],
    },
    {
      type: 'category',
      label: 'iOS examples',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'deploy-models-on-ios/slogan-generator-app',
      },
      items: [
        // Removed duplicate since it's already the category link
      ],
    },
    {
      type: 'category',
      label: 'Model customization',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'customize-models/car-maker-identification',
      },
      items: [
        // Removed duplicate since it's already the category link
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
