import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  android_sdk: [
    { type: 'doc', id: 'android-quick-start-guide', label: 'Quick Start' },
    { type: 'doc', id: 'android-api-spec', label: 'API Reference' },
    { type: 'doc', id: 'constrained-generation', label: 'Constrained Generation' },
    { type: 'doc', id: 'function-calling', label: 'Function Calling' },
    { type: 'doc', id: 'cloud-ai-comparison', label: 'Comparison with Cloud AI API' },
  ],
};

export default sidebars;
