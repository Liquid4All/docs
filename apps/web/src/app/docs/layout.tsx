import { Layout } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

const footer = <Footer />;

export default async function DocumentationLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap();

  return (
    <main className="bg-nextra-bg">
      <Layout
        sidebar={{ autoCollapse: true }}
        navbar={<Header showSearch />}
        pageMap={pageMap}
        editLink={null}
        feedback={{
          content: null,
        }}
        footer={footer}
        darkMode={false}
        nextThemes={{
          defaultTheme: 'light',
          forcedTheme: 'light',
        }}
      >
        <div className="mx-auto max-w-7xl items-center">{children}</div>
      </Layout>
    </main>
  );
}
