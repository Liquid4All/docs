import Link from '@docusaurus/Link';
import { clsx } from 'clsx';
import React, { CSSProperties, ReactNode } from 'react';

import styles from './card.module.css';

interface CardProps {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  href?: string;
  target?: string;
}

const Card: React.FC<CardProps> = ({ className, style, children, href, target }) => {
  const classNames = clsx(
    'bg-(--card) px-6 py-7 border border-(--border) rounded-3xl box-border h-[218px] flex flex-col justify-between',
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classNames}
        style={{ textDecoration: 'none', ...style }}
        rel="noopener noreferrer"
        target={target}
      >
        {children}
      </Link>
    );
  }

  return (
    <div className={classNames} style={style}>
      {children}
    </div>
  );
};

export default Card;
