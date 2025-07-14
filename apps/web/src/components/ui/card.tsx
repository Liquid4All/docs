'use client';

import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

import { Icon } from '@/components/Icon';
import { Tag } from '@/components/Tag';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CardProps {
  title: string;
  subtitle?: string;
  description?: string;
  value?: string;
  unit?: string;
  items?: string[];
  icon?: React.ComponentType<{ className?: string }>;
  width?: 1 | 2;
  mobileWidth?: 1 | 2;
  variant?: 'white' | 'glass-gradient' | 'backdrop' | 'gradient-border';
  customClasses?: string;
  badge?: string;
  button?: string;
  buttonLink?: string;
  href?: string;
  onClick?: () => void;
  isVisible?: boolean;
  animationDelay?: number;
  contentAlignment?: 'left' | 'center';
  buttonVariant?: 'ghost' | 'default';
}

const CARD_VARIANTS: Record<string, string> = {
  'glass-gradient': 'bg-gradient-to-br from-purple-300 to-orange-200 border',
  white: 'border border-neutral-200 bg-white',
  backdrop: 'backdrop-blur-sm border border-neutral-300',
  'gradient-border': 'p-px bg-gradient-to-br from-orange-400 to-purple-600',
};

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  description,
  value,
  unit,
  items,
  icon,
  width = 1,
  mobileWidth,
  variant = 'white',
  customClasses = '',
  badge,
  button,
  buttonLink,
  href,
  onClick,
  isVisible = true,
  animationDelay = 0,
  contentAlignment = 'left',
  buttonVariant = 'ghost',
}) => {
  const effectiveMobileWidth: number = mobileWidth || width;
  const cardVariant: string = CARD_VARIANTS[variant] || CARD_VARIANTS.white;

  const isLink: boolean = Boolean(href && !onClick);
  const isClickable: boolean = Boolean(onClick || isLink);

  const baseClasses: string = cn(
    effectiveMobileWidth === 2 ? 'col-span-2' : 'col-span-1',
    width === 2 ? 'lg:flex-[2]' : 'lg:flex-1',
    'rounded-sm transition-all duration-700 ease-out relative',
    cardVariant,
    isClickable && 'hover:shadow-lg cursor-pointer group',
    contentAlignment === 'center' && 'text-center items-center',
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    customClasses
  );

  const animationStyle: React.CSSProperties = {
    transitionDelay: `${animationDelay}ms`,
  };

  // Content variants
  const GradientBorderContent: React.FC = () => (
    <div
      className={cn(
        'rounded-[calc(0.4rem-1px)] backdrop-blur-sm bg-white/90 p-3 md:p-4 h-full flex flex-col',
        contentAlignment === 'center' && 'text-center items-center'
      )}
    >
      {badge && <Tag label={badge} variant="gradient" className="w-fit" />}
      <div className={cn('flex flex-col h-full', badge && 'mt-4')}>
        {icon && <Icon icon={icon} className="flex justify-start mb-4" />}
        <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
        {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{subtitle}</p>}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        )}
        {button && (
          <div className="mt-auto pt-4">
            <Button
              variant={buttonVariant}
              href={!onClick ? buttonLink || href : undefined}
              onClick={onClick}
              icon={IconArrowRight}
              className="p-0 hover:bg-transparent font-normal text-neutral-800 dark:text-neutral-200"
              target="_blank"
            >
              {button}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const GlassGradientContent: React.FC = () => (
    <div className="p-3 md:p-4 flex flex-col h-full">
      {icon ? (
        <>
          <Icon icon={icon} className="flex justify-center my-3" />
          <h4 className="mb-4 leading-9">{title}</h4>
        </>
      ) : (
        <>
          <div className="text-left my-auto">
            <h4 className="mb-4 leading-9">{title}</h4>
            {button && (
              <div className="">
                <Button
                  variant={buttonVariant}
                  href={!onClick ? buttonLink || href : undefined}
                  onClick={onClick}
                  icon={IconArrowRight}
                  className="p-0 hover:bg-transparent font-normal text-neutral-800"
                >
                  {button}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const BackdropContent: React.FC = () => (
    <div className="p-3 md:p-4 flex flex-col h-full">
      {value ? (
        <>
          {icon && <Icon icon={icon} className="flex justify-start mb-6 md:mb-8" />}
          <h3 className="!text-primary/80 mb-1">
            {value}
            {unit && <span className="text-lg"> {unit}</span>}
          </h3>
          <p className="font-medium text-sm">{title}</p>
        </>
      ) : items ? (
        <div className="m-auto w-full">
          <ul className="space-y-2 mt-4">
            {items.map((item: string, i: number) => (
              <li key={i} className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 bg-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <IconCheck className="w-4 h-4 text-white" />
                </span>
                <p className="text-sm md:text-base">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <h4 className="mb-4">{title}</h4>
          {button && (
            <div className="mt-auto pt-6">
              <Button
                variant={buttonVariant}
                href={!onClick ? buttonLink || href : undefined}
                onClick={onClick}
                icon={IconArrowRight}
                className="p-0 hover:bg-transparent font-normal text-neutral-800"
              >
                {button}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );

  const WhiteContent: React.FC = () => (
    <div className="p-3 md:p-4 flex flex-col h-full">
      {icon && <Icon icon={icon} className="flex justify-start mb-6 md:mb-8" />}
      <h4 className="mb-1">{title}</h4>
      {description && <p className="mb-6">{description}</p>}
      {button && (
        <div className="mt-auto">
          <Button
            variant={buttonVariant}
            href={!onClick ? buttonLink || href : undefined}
            onClick={onClick}
            forceButton
            icon={IconArrowRight}
            className="p-0 hover:bg-transparent font-normal text-neutral-800"
          >
            {button}
          </Button>
        </div>
      )}
    </div>
  );

  // Select content based on variant
  const CardContent: React.FC = () => {
    switch (variant) {
      case 'gradient-border':
        return <GradientBorderContent />;
      case 'glass-gradient':
        return <GlassGradientContent />;
      case 'backdrop':
        return <BackdropContent />;
      case 'white':
      default:
        return <WhiteContent />;
    }
  };

  // Render with link wrapper if needed
  if (isLink) {
    return (
      <Link href={href!} className={baseClasses} style={animationStyle}>
        <CardContent />
      </Link>
    );
  }

  return (
    <div
      className={baseClasses}
      style={animationStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <CardContent />
    </div>
  );
};

export interface CardGridProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

export const CardGrid: React.FC<CardGridProps> = ({ children, className = '', gap = 'md' }) => {
  const gapClasses: Record<string, string> = {
    sm: 'gap-2 lg:gap-4',
    md: 'gap-4 lg:gap-6',
    lg: 'gap-6 lg:gap-8',
  };

  return (
    <div className={cn('grid grid-cols-2 lg:flex lg:flex-row', gapClasses[gap], className)}>
      {children}
    </div>
  );
};

export interface CardRowProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

export const CardRow: React.FC<CardRowProps> = ({ children, className = '', gap = 'md' }) => {
  const gapClasses: Record<string, string> = {
    sm: 'gap-2 lg:gap-4',
    md: 'gap-4 lg:gap-6',
    lg: 'gap-6 lg:gap-8',
  };

  return (
    <div className={cn('flex flex-col lg:flex-row', gapClasses[gap], className)}>{children}</div>
  );
};

export default Card;
