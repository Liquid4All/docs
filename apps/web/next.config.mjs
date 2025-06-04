import nextra from 'nextra';

const withNextra = nextra({
  search: true,
  defaultShowCopyCode: true,
  contentDirBasePath: '/docs',
});

export default withNextra({
  // ... Other Next.js config options
  transpilePackages: ['@liquidai/leap-lib'],
  output: 'standalone',
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  devIndicators: false,
});
