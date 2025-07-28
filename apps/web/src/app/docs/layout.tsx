import { Layout } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';

import { Container } from '@/components/Container';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const footer = <Footer />;

export default async function DocumentationLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap();

  return (
    <main className="bg-nextra-bg">
      <Layout
        sidebar={{ autoCollapse: true }}
        navbar={<Header key="navbar" showSearch />}
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
        <Container>
          <div className="mx-auto items-center pt-4">{children}</div>
        </Container>
      </Layout>
    </main>
  );
}
