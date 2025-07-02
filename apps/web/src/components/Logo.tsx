import { ComponentPropsWithoutRef } from 'react';

import LogoBlack from '@/assets/images/leap-black.png';
import LogoWhite from '@/assets/images/leap-white.png';
import { TITLE } from '@/constants';
import { cn } from '@/lib/utils';

interface LogoProps extends ComponentPropsWithoutRef<'div'> {
  variant?: 'text' | 'image';
  color?: 'light' | 'dark';
  size?: string | number;
  textSize?: string;
}

export function Logo({
  variant = 'text',
  color = 'dark',
  size = variant === 'text' ? 'text-3xl' : 120,
  textSize = 'text-3xl',
  ...props
}: LogoProps) {
  if (variant === 'image') {
    const logoImport = color === 'light' ? LogoWhite : LogoBlack;

    // Use CSS custom properties for dynamic sizing
    const dynamicStyles =
      typeof size === 'number'
        ? ({ '--logo-height': `${size}px` } as React.CSSProperties)
        : ({ '--logo-height': size } as React.CSSProperties);

    return (
      <div {...props} style={dynamicStyles}>
        <img src={logoImport.src} alt="" className="leap-logo-image object-contain" />
      </div>
    );
  }

  // Text variant
  return (
    <div
      className={cn(
        'font-display font-medium tracking-tight',
        // Text color classes
        color === 'light' && 'text-white',
        color === 'dark' && 'leap-logo-text-gradient',
        // Size classes
        typeof size === 'string' ? size : textSize
      )}
      {...props}
    >
      {TITLE}
    </div>
  );
}
