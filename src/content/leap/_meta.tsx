import { IconAdjustments, IconCode } from '@tabler/icons-react';
import type { MetaRecord } from 'nextra';

const meta: MetaRecord = {
  index: 'Introduction',
  '-': {
    type: 'separator',
    title: (
      <div className="flex flex-row gap-1 items-center">
        <IconAdjustments className="w-5 h-5" /> Specialize
      </div>
    ),
  },
  finetuning: 'Finetuning',
  '--': {
    type: 'separator',
    title: (
      <div className="flex flex-row gap-1 items-center">
        <IconCode className="w-5 h-5" /> Deploy
      </div>
    ),
  },
  'leap-bundle': {
    title: 'Model Bundling Service',
    theme: {
      collapsed: true,
      copyPage: true,
    },
  },
  'edge-sdk': {
    title: 'Edge SDK',
    theme: {
      collapsed: true,
      copyPage: true,
    },
  },
  'laptop-support': 'Laptop Support',
  '---': {
    type: 'separator',
  },
  changelog: 'Changelog',
};

export default meta;
