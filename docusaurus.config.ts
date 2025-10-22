import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {PluginOptions} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Liquid Edge AI Platform',
  favicon: 'img/favicon.ico',

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
    }
  },
  onBrokenLinks: 'warn',

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
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'ios_sdk',
        path: 'ios_sdk',
        routeBasePath: 'ios-sdk',
        sidebarPath: require.resolve('./sidebarsIosSdk.ts'),
        versions: {
          current: {
            label: 'Next',
            path: 'next',
            banner: 'unreleased',
          },
          '0.6.0': {
            label: '0.6.0 (Latest)',
            path: undefined,
            banner: 'none',
          }
        },
        includeCurrentVersion: true,
      } satisfies Partial<PluginOptions>,
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'android_sdk',
        path: 'android_sdk',
        routeBasePath: 'android-sdk',
        sidebarPath: require.resolve('./sidebarsAndroidSdk.ts'),
        versions: {
          current: {
            label: 'Next',
            path: 'next',
            banner: 'unreleased',
          },
          '0.6.0': {
            label: '0.6.0 (Latest)',
            path: undefined,
            banner: 'none',
          }
        },
        includeCurrentVersion: true,
      } satisfies Partial<PluginOptions>,
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'leap_bundle',
        path: 'leap-bundle',
        routeBasePath: 'leap-bundle',
        sidebarPath: require.resolve('./sidebarsLeapBundle.ts'),
      } satisfies Partial<PluginOptions>,
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'example',
        path: 'example',
        routeBasePath: 'example',
        sidebarPath: require.resolve('./sidebarsExample.ts'),
      } satisfies Partial<PluginOptions>,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Liquid AI Docs',
      logo: {
        alt: 'Liquid AI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'dropdown',
          label: 'Leap',
          position: 'left',
          items: [
            {
              to: '/docs/intro',
              label: 'Docs',
            },
            {
              to: '/ios-sdk/ios-quick-start-guide',
              label: 'iOS SDK',
            },
            {
              to: '/android-sdk/android-quick-start-guide',
              label: 'Android SDK',
            },
            {
              to: '/leap-bundle/quick-start',
              label: 'Model Bundling',
            },
          ],
        },
        {
          type: 'docSidebar',
          docsPluginId: 'example',
          sidebarId: 'exampleSidebar',
          position: 'left',
          label: 'Example',
        },
        {
          type: 'docsVersionDropdown',
          docsPluginId: 'ios_sdk',
          position: 'right',
          // This attribute must be false to auto show / hide the dropdown using custom css
          dropdownActiveClassDisabled: false,
        },
        {
          type: 'docsVersionDropdown',
          docsPluginId: 'android_sdk',
          position: 'right',
          // This attribute must be false to auto show / hide the dropdown using custom css
          dropdownActiveClassDisabled: false,
        },
        {
          href: 'https://github.com/Liquid4All',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'iOS SDK',
              to: '/ios-sdk',
            },
            {
              label: 'Android SDK',
              to: '/android-sdk',
            },
            {
              label: 'Model Bundling',
              to: '/leap-bundle/quick-start',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/liquid-ai',
            },
            {
              label: 'X',
              href: 'https://x.com/LiquidAI_',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Liquid4All',
            },
            {
              label: 'Liquid AI',
              href: 'https://www.liquid.ai',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Liquid AI. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
