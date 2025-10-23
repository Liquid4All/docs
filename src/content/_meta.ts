import type { MetaRecord } from 'nextra';

export default {
  '*': {
    type: 'page',
    display: 'hidden',
  },
  index: {
    type: 'page',
    display: 'hidden',
  },
  lfm: {
    type: 'page',
    title: 'LFM',
    display: 'children',
  },
  leap: {
    type: 'page',
    title: 'LEAP',
    display: 'children',
  },
  examples: {
    type: 'page',
    title: 'Examples',
    display: 'children',
  },
} satisfies MetaRecord;
