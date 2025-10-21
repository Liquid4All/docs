import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {PluginOptions} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Liquid Documentation',
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
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
              'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
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
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Home',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          type: 'docSidebar',
          docsPluginId: 'ios_sdk',
          sidebarId: 'ios_sdk',
          position: 'left',
          label: 'iOS SDK',
        },
        {
          type: 'docSidebar',
          docsPluginId: 'android_sdk',
          sidebarId: 'android_sdk',
          position: 'left',
          label: 'Android SDK',
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
        {to: '/blog', label: 'Blog', position: 'left'},
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
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
