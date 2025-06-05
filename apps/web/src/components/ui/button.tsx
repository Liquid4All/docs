import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import Link from 'next/link';
import * as React from 'react';
import { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        // shadcn/ui variants
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input font-bold bg-transparent hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent font-bold hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        primary:
          'bg-black text-white font-bold hover:bg-[var(--bg-primary)] focus-visible:outline-[var(--bg-primary)]',
        tertiary:
          'text-slate-900 hover:text-[var(--bg-primary)] focus-visible:outline-[var(--bg-primary)]',
      },
      size: {
        sm: 'rounded-sm px-3 text-sm',
        default: 'px-4 py-2 text-sm',
        lg: 'rounded-sm px-8 text-base',
        icon: 'h-10 w-10',
        // Custom sizes from second implementation
        small: 'text-sm px-3 py-1.5',
        big: 'text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-4',
      },
      justify: {
        center: 'justify-center',
        start: 'justify-start sm:justify-center',
        left: 'justify-start text-left sm:text-center',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      justify: 'center',
    },
  }
);

type ButtonBaseProps = {
  asChild?: boolean;
  icon?: React.ComponentType<{
    size?: string | number;
    stroke?: string | number;
    className?: string;
  }>;
  iconPosition?: 'left' | 'right';
  targetBlank?: boolean;
} & VariantProps<typeof buttonVariants>;

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonBaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      justify,
      asChild = false,
      icon: TablerIcon,
      iconPosition = 'right',
      targetBlank = false,
      children,
      ...props
    },
    ref
  ) => {
    // Handle icon spacing and animations
    const hasIcon = TablerIcon;
    const iconSpacing = hasIcon ? 'gap-2 transition-all duration-200' : '';
    const tertiaryHover = hasIcon && variant === 'tertiary' ? 'hover:gap-3' : '';

    // Get icon size based on button size
    const getIconSize = () => {
      switch (size) {
        case 'sm':
        case 'small':
          return 12;
        case 'lg':
        case 'big':
          return 20;
        case 'icon':
          return 16;
        default:
          return 16;
      }
    };

    // Render content with icon positioning
    const renderContent = () => {
      if (!hasIcon) {
        return children;
      }

      const iconElement = (
        <TablerIcon size={getIconSize()} stroke={1.5} className="transition-all duration-200" />
      );

      return iconPosition === 'left' ? (
        <>
          {iconElement}
          {children}
        </>
      ) : (
        <>
          {children}
          {iconElement}
        </>
      );
    };

    const finalClassName = cn(
      buttonVariants({ variant, size, justify, className }),
      iconSpacing,
      tertiaryHover
    );

    // If href is provided, render as Link
    if ('href' in props && props.href) {
      return (
        <Link
          className={finalClassName}
          {...(targetBlank && { target: '_blank', rel: 'noopener noreferrer' })}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as ButtonAsLink)}
        >
          {renderContent()}
        </Link>
      );
    }

    // If asChild is true, use Slot for composition
    if (asChild) {
      return (
        <Slot
          className={finalClassName}
          ref={ref as React.Ref<HTMLElement>}
          {...(props as ButtonAsButton)}
        >
          {renderContent()}
        </Slot>
      );
    }

    // Default button element
    return (
      <button
        className={finalClassName}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(props as ButtonAsButton)}
      >
        {renderContent()}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
