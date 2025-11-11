import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  examples: [
    'index',
    {
      type: 'category',
      label: 'Laptop examples',
      items: ['laptop-examples/index', 'laptop-examples/invoice-extractor-tool-with-liquid-nanos'],
    },
    {
      type: 'category',
      label: 'iOS examples',
      items: ['deploy-models-on-ios/index', 'deploy-models-on-ios/slogan-generator-app'],
    },
    {
      type: 'category',
      label: 'Model customization',
      items: ['customize-models/index', 'customize-models/car-maker-identification'],
    },
    {
      type: 'link',
      label: 'Discord',
      href: 'https://discord.gg/DFU3WQeaYD',
    },
  ],
};

export default sidebars;
