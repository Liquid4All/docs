import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Edge SDK',
    description: (
      <>
        Deploy LEAP models in your mobile app as easily as calling a cloud API.
        Available for iOS and Android.
      </>
    ),
  },
  {
    title: 'Model Bundling',
    description: (
      <>
        Bundle your finetuned checkpoints on-demand for usage with the Edge SDK.
      </>
    ),
  },
  {
    title: 'Laptop Support',
    description: (
      <>
        Leverage llama.cpp for blazing fast inference on laptops, particularly on AMD Ryzen™ chip technology.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
