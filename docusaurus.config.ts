import { PluginOptions } from '@docusaurus/plugin-content-docs';
import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Liquid Docs',
  tagline: 'Redefining possibility on the edge',
  favicon: 'img/liquid-black.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.liquid.ai',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Liquid4All', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'leap',
          routeBasePath: 'leap',
          sidebarPath: './sidebarsLeap.ts',
          editUrl: 'https://github.com/Liquid4All/docs/tree/main',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    'vercel-analytics',
    './src/plugins/tailwind-config.ts',
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'lfm',
        path: 'lfm',
        routeBasePath: 'lfm',
        sidebarPath: require.resolve('./sidebarsLfm.ts'),
        editUrl: 'https://github.com/Liquid4All/docs/tree/main',
      } satisfies Partial<PluginOptions>,
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'examples',
        path: 'examples',
        routeBasePath: 'examples',
        sidebarPath: require.resolve('./sidebarsExamples.ts'),
        editUrl: 'https://github.com/Liquid4All/docs/tree/main',
      } satisfies Partial<PluginOptions>,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/liquid-hero-black.png',
    navbar: {
      logo: {
        alt: 'Logo',
        src: 'img/liquid-docs-logo-light.svg',
        srcDark: 'img/liquid-docs-logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'lfm',
          docsPluginId: 'lfm',
          position: 'left',
          label: 'LFM',
        },
        {
          type: 'docSidebar',
          docsPluginId: 'default',
          sidebarId: 'leap',
          position: 'left',
          label: 'LEAP',
        },
        {
          type: 'docSidebar',
          docsPluginId: 'examples',
          sidebarId: 'examples',
          position: 'left',
          label: 'Examples',
        },
        {
          href: 'https://github.com/Liquid4All/docs',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://discord.gg/DFU3WQeaYD',
          label: 'Discord',
          position: 'right',
        },
      ],
    },
    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: true,
      },
    },
    footer: {
      logo: {
        alt: 'Logo',
        src: 'img/liquid-docs-logo-light.svg',
        srcDark: 'img/liquid-docs-logo-dark.svg',
      },
      style: 'light',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'LFM',
              to: '/lfm',
            },
            {
              label: 'LEAP',
              to: '/leap',
            },
            {
              label: 'Examples',
              to: '/examples',
            },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/liquid-ai',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Liquid4All/docs',
            },
            {
              label: 'Liquid AI',
              href: 'https://liquid.ai',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              label: 'About',
              href: 'https://www.liquid.ai/company/about',
            },
            {
              label: 'Careers',
              href: 'https://jobs.ashbyhq.com/liquid-ai',
            },
            {
              label: 'Acceptable Use Policy',
              href: 'https://leap.liquid.ai/acceptable-use',
            },
            {
              label: 'Terms & Conditions',
              href: 'https://www.liquid.ai/terms-conditions',
            },
            {
              label: 'Privacy Policy',
              href: 'https://www.liquid.ai/privacy-policy',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()}, Liquid AI, Inc. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: 'NU3OWTAZ9V',
      apiKey: 'b820a975003c366a585fb67b0b9ab89e',
      indexName: 'liquid-docs',
      contextualSearch: true,
      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',
      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,
    },
  } satisfies Preset.ThemeConfig,
  customFields: {
    address: '314 Main St, Cambridge, MA 02142',
  },
};

export default config;
