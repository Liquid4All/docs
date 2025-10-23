import '@fontsource/jetbrains-mono';
import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import { type Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import { Layout } from 'nextra-theme-docs';
import 'nextra-theme-docs/style.css';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { Container } from '@/components/Container';
import Footer from '@/components/Footer';
import NextraNavbar from '@/components/navigation/nextra/NextraNavbar';
import { DEFAULT_GTM_ID, DESCRIPTION, DOMAIN_URL, FULL_TITLE, TITLE } from '@/constants';
import { cn } from '@/lib/utils';
import '@/styles/tailwind.css';

export const metadata: Metadata = {
  title: {
    template: `%s | ${TITLE}`,
    default: FULL_TITLE,
  },
  description: DESCRIPTION,
  icons: [
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
    { rel: 'manifest', url: '/site.webmanifest' },
  ],
  robots: 'index, follow',
  openGraph: {
    title: FULL_TITLE,
    siteName: FULL_TITLE,
    description: DESCRIPTION,
    url: DOMAIN_URL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: FULL_TITLE,
    description: DESCRIPTION,
    site: '@LiquidAI_',
  },
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap();

  return (
    <html
      lang="en"
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
      className={cn('h-full scroll-smooth antialiased', inter.variable, lexend.variable)}
    >
      <Head
        color={{
          hue: 269,
          saturation: 97,
          lightness: {
            light: 50,
            dark: 80,
          },
        }}
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID ?? DEFAULT_GTM_ID} />
      <body className="h-full flex flex-col">
        <div className="nextra-content bg-muted">
          <Layout
            key="doc-layout"
            navbar={<NextraNavbar key="docs-nav" pageMap={pageMap} />}
            sidebar={{
              defaultMenuCollapseLevel: 1,
              autoCollapse: true,
            }}
            pageMap={pageMap}
            editLink={null}
            feedback={{
              content: null,
            }}
            footer={<Footer key="footer" />}
            darkMode={true}
            search={null}
            nextThemes={{
              defaultTheme: 'system',
            }}
          >
            <Container>
              <div className="mx-auto items-center">{children}</div>
            </Container>
          </Layout>
        </div>
        <Analytics />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
