import { clsx } from 'clsx';
import { ComponentPropsWithoutRef } from 'react';

import { TITLE } from '@/constants';

interface LogoProps extends ComponentPropsWithoutRef<'div'> {
  size?: string;
}

export function Logo({ size = 'text-3xl', ...props }: LogoProps) {
  return (
    <div
      className={clsx(`font-display font-medium tracking-tight text-slate-700`, size)}
      {...props}
      style={{
        background: `black`,
        WebkitBackgroundClip: 'text' as any,
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {TITLE}
    </div>
  );
}
