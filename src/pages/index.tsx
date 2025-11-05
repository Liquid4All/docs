import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Card from '@site/src/components/Card';
import CardBody from '@site/src/components/Card/CardBody';
import CardHeader from '@site/src/components/Card/CardHeader';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main style={{ display: 'flex', justifyContent: 'center' }}>
        <div className={clsx('margin-vert--xl padding-horiz--md', styles.cardContainer)}>
          <Card shadow="md" href="/lfm/getting-started">
            <CardHeader>
              <h3>LFM</h3>
            </CardHeader>
            <CardBody>Liquid Foundation Model (LFM)</CardBody>
          </Card>
          <Card shadow="md" href="/leap">
            <CardHeader>
              <h3>LEAP</h3>
            </CardHeader>
            <CardBody>Liquid Edge AI Platform (LEAP)</CardBody>
          </Card>
          <Card shadow="md" href="/examples">
            <CardHeader>
              <h3>Examples</h3>
            </CardHeader>
            <CardBody>Examples</CardBody>
          </Card>
        </div>
      </main>
    </Layout>
  );
}
