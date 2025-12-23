import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link'; // Import Link component
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  imgSrc: string; 
  description: ReactNode;
  link: string; // Added link property to the type
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    imgSrc: require('@site/static/img/easy_to_use.png').default,
    link: '/docs/intro', // Provide the subpage path
    description: (
      <>
        Get started with the Analytical Life Cycle.
      </>
    ),
  },
  {
    title: 'Focus on Updates',
    imgSrc: require('@site/static/img/being_productive.png').default,
    link: '/updates/intro',
    description: (
      <>
        The insight scoop on the latest SAS Viya features enhancements.
      </>
    ),
  },
  {
    title: 'Impactful Results',
    imgSrc: require('@site/static/img/business_impact.png').default,
    link: '/docs/intro',
    description: (
      <>
        Dive into advanced techniques and best practices for maximum impact.
      </>
    ),
  },
];

function Feature({title, imgSrc, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/* Wrap the image in a Link component */}
        <Link to={link}>
          <img src={imgSrc} className={styles.featureSvg} alt={title} />
        </Link>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">
          {/* Optional: Make the title clickable too */}
          <Link to={link}>{title}</Link>
        </Heading>
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