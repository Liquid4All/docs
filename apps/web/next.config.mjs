import nextra from 'nextra';

const withNextra = nextra({
  mdxOptions: {
    rehypePrettyCodeOptions: {
      theme: {
        dark: 'dark-plus',    // Dark theme for dark mode
        light: 'dark-plus'    // Force dark theme even in light mode
      }
    }
  },
  search: true,
  defaultShowCopyCode: true,
  contentDirBasePath: '/docs',
});

export default withNextra({
  transpilePackages: ['@liquidai/leap-lib'],
  output: 'standalone',
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  devIndicators: false,
});
