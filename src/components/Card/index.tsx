import Link from '@docusaurus/Link';
import { clsx } from 'clsx';
import React, { CSSProperties, ReactNode } from 'react';

interface CardProps {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  shadow?: 'lw' | 'md' | 'tl';
  href?: string;
  target?: string;
}

const Card: React.FC<CardProps> = ({ className, style, children, shadow, href, target }) => {
  const cardShadow = shadow ? `item shadow--${shadow}` : '';
  const classNames = clsx('card', className, cardShadow);

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
