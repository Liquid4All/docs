import { ComponentPropsWithoutRef } from 'react';

import LogoBlack from '@/assets/images/leap-black.png';
import LogoWhite from '@/assets/images/leap-white.png';

interface LogoProps extends ComponentPropsWithoutRef<'div'> {
  color?: 'light' | 'dark';
  size?: number;
  textSize?: string;
}

export function Logo({ color = 'dark', size = 120, textSize = 'text-3xl', ...props }: LogoProps) {
  const logoImport = color === 'light' ? LogoWhite : LogoBlack;

  return (
    <div {...props}>
      <img
        src={logoImport.src}
        style={{ height: size }}
        alt="leap logo"
        className="w-auto object-contain"
      />
    </div>
  );
}
