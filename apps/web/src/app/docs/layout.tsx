import { Footer, Layout } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';

import Header from '@/components/Header';

const footer = <Footer />;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap();

  return (
    <main className="bg-nextra-bg">
      <Layout
        sidebar={{ autoCollapse: true }}
        navbar={<Header />}
        pageMap={pageMap}
        editLink={null}
        feedback={{
          content: null,
        }}
        footer={footer}
      >
        <div className="mx-auto max-w-7xl items-center">{children}</div>
      </Layout>
    </main>
  );
}
