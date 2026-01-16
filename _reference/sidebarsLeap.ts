import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebarsLeap: SidebarsConfig = {
  leap: [
    {
      type: 'doc',
      id: 'index',
      label: 'Introduction',
    },
    {
      type: 'doc',
      id: 'find-model',
      label: 'Best model search',
    },
    {
      type: 'doc',
      id: 'vibe-check-models',
      label: 'Vibe-check models',
    },
    {
      type: 'category',
      label: 'Deploy to mobile device',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'edge-sdk/overview',
      },
      items: [
        // Removed 'edge-sdk/overview' since it's already the category link
        {
          type: 'category',
          label: 'Android',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'edge-sdk/android/android-quick-start-guide',
          },
          items: [
            'edge-sdk/android/android-quick-start-guide', // Keep in nav, but pagination will skip it
            'edge-sdk/android/android-api-spec',
            'edge-sdk/android/cloud-ai-comparison',
            'edge-sdk/android/constrained-generation',
            'edge-sdk/android/function-calling',
          ],
        },
        {
          type: 'category',
          label: 'iOS',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'edge-sdk/ios/ios-quick-start-guide',
          },
          items: [
            'edge-sdk/ios/ios-quick-start-guide', // Keep in nav, but pagination will skip it
            'edge-sdk/ios/ios-api-spec',
            'edge-sdk/ios/cloud-ai-comparison',
            'edge-sdk/ios/constrained-generation',
            'edge-sdk/ios/function-calling',
          ],
        },
      ],
    },
    {
      type: 'doc',
      id: 'laptop-support',
      label: 'Deploy to laptop',
    },
    {
      type: 'category',
      label: 'Customize model',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'finetuning',
      },
      items: [
        'finetuning', // Keep in nav, but pagination will skip it
        {
          type: 'category',
          label: 'Model Bundling Service',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'leap-bundle/quick-start',
          },
          items: [
            'leap-bundle/quick-start', // Keep in nav, but pagination will skip it
            'leap-bundle/cli-spec',
            'leap-bundle/data-privacy',
            'leap-bundle/changelog',
          ],
        },
      ],
    },
    {
      type: 'doc',
      id: 'changelog',
      label: 'Changelog',
    },
    {
      type: 'link',
      label: 'Discord',
      href: 'https://discord.gg/DFU3WQeaYD',
    },
  ],
};

export default sidebarsLeap;
