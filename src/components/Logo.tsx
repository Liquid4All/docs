'use client';

import { ComponentPropsWithoutRef } from 'react';

import LiquidHeroBlack from '@/assets/images/liquid-hero-black.png';
import LiquidHeroWhite from '@/assets/images/liquid-hero-white.png';

interface LogoProps extends ComponentPropsWithoutRef<'div'> {
  size?: number;
  textSize?: string;
}

export function Logo({ size = 120, textSize = 'text-3xl', ...props }: LogoProps) {
  const logoImport = LiquidHeroBlack;

  return (
    <div {...props}>
      <img
        src={logoImport.src}
        style={{ height: size }}
        alt="liquid logo"
        className="w-auto object-contain"
      />
    </div>
  );
}
