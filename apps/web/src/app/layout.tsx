import { ClerkProvider } from '@clerk/nextjs';
import '@fontsource/jetbrains-mono';
import { clsx } from 'clsx';
import { type Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import 'nextra-theme-docs/style.css';
import { Head } from 'nextra/components';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { DESCRIPTION, DOMAIN_URL, TITLE } from '@/constants';
import '@/styles/fonts.css';
import '@/styles/globals.css';
import '@/styles/tailwind.css';

export const metadata: Metadata = {
  title: {
    template: `%s | ${TITLE}`,
    default: TITLE,
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
    title: `Home | ${TITLE}`,
    description: DESCRIPTION,
    url: DOMAIN_URL,
    type: 'website',
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
  return (
    <html
      lang="en"
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
      className={clsx('h-full scroll-smooth antialiased', inter.variable, lexend.variable)}
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
      <body className="h-full flex flex-col">
        <ClerkProvider
          signInFallbackRedirectUrl="/"
          appearance={{
            layout: {
              privacyPageUrl: '/privacy',
              termsPageUrl: '/terms',
            },
          }}
        >
          {children}
          <Toaster position="top-right" />
        </ClerkProvider>
      </body>
    </html>
  );
}
