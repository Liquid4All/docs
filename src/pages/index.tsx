import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Card from '@site/src/components/Card';
import { GradientIcon } from '@site/src/components/GradientIcon';
import {
  IconArrowRight,
  IconBrandGithub,
  IconFileDescription,
  TablerIcon,
} from '@tabler/icons-react';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import styles from './index.module.css';

const CARDS: { title: string; description: string; icon: TablerIcon; href: string }[] = [
  {
    title: 'Liquid',
    description: 'Liquid Foundation Models (LFMs) - efficient, scalable, open-source AI',
    icon: IconFileDescription,
    href: '/lfm/getting-started',
  },
  {
    title: 'LEAP',
    description: 'Customize AI models to your use case and deploy them anywhere',
    icon: IconFileDescription,
    href: '/leap',
  },
  {
    title: 'Examples',
    description: 'iOS, Android, and Laptop sample applications and guides',
    icon: IconBrandGithub,
    href: '/examples',
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
          {siteConfig.title}
        </Heading>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
      wrapperClassName={'bg-bottom-gradient'}
    >
      <HomepageHeader />
      <main style={{ display: 'flex', justifyContent: 'center' }}>
        <div className={clsx('margin-vert--xl padding-horiz--md', styles.cardContainer)}>
          {CARDS.map((card) => (
            <Card
              key={card.href}
              href={card.href}
              className="overflow-clip relative after:absolute after:gradient-corner-tr hover:after:opacity-100 after:opacity-0 after:inset-0 after:transition-opacity after:ease-in-out after:duration-300 transition-colors duration-300"
            >
              <GradientIcon Icon={card.icon} className="h-6 w-6 flex-shrink-0" />
              <div className="flex flex-col gap-1 flex-shrink-0">
                <p className="text-(--foreground) text-2xl">{card.title}</p>
                <p className="text-(--muted-foreground) leading-[130%]">{card.description}</p>
              </div>
              <div className="border-b border-(--border) self-start monospace flex flex-row items-center gap-1 text-(--muted-foreground)">
                Learn more
                <IconArrowRight className="w-4.5 h-4.5" />
              </div>
            </Card>
          ))}
        </div>
      </main>
    </Layout>
  );
}
