import { Layout } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';

import { Container } from '@/components/Container';
import Footer from '@/components/Footer';
import NextraNavbar from '@/components/navigation/NextraNavbar';

export default async function DocumentationLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap();

  return (
    <div className="nextra-content bg-muted">
      <Layout
        navbar={<NextraNavbar />}
        sidebar={{
          defaultMenuCollapseLevel: 1,
          autoCollapse: true,
        }}
        pageMap={pageMap}
        editLink={null}
        feedback={{
          content: null,
        }}
        footer={<Footer />}
        darkMode={false}
        nextThemes={{
          defaultTheme: 'light',
          forcedTheme: 'light',
        }}
      >
        <Container>
          <div className="mx-auto items-center">{children}</div>
        </Container>
      </Layout>
    </div>
  );
}
