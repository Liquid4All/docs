import { withSentryConfig } from '@sentry/nextjs';
import nextra from 'nextra';

const withNextra = nextra({
  mdxOptions: {
    rehypePrettyCodeOptions: {
      theme: {
        dark: 'dark-plus', // Dark theme for dark mode
        light: 'dark-plus', // Force dark theme even in light mode
      },
    },
  },
  search: true,
  defaultShowCopyCode: true,
  contentDirBasePath: '/docs',
});

export default withSentryConfig(
  withNextra({
    transpilePackages: ['@liquidai/leap-lib'],
    output: 'standalone',
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    devIndicators: false,
  }),
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options
    org: 'liquid-ai',
    project: 'leap-web',

    // Mute source map uploading logs on Vercel or non-CI environments
    silent: !process.env.CI || process.env.VERCEL,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: '/monitoring',

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: false,
  }
);
