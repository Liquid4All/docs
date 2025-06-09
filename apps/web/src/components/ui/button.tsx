import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import Link from 'next/link';
import * as React from 'react';
import { ComponentPropsWithoutRef } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        // shadcn/ui variants
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] hover:shadow-md',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.02] hover:shadow-md',
        outline:
          'border border-primary/50 font-bold bg-transparent hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-sm hover:border-white',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.02] hover:shadow-sm',
        ghost: 'hover:bg-accent font-bold hover:text-accent-foreground hover:scale-[1.02]',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
        primary:
          'bg-black text-white font-bold hover:bg-[var(--bg-primary)] hover:scale-[1.02] hover:shadow-lg focus-visible:outline-[var(--bg-primary)] transform',
        tertiary:
          'text-slate-900 hover:text-[var(--bg-primary)] hover:scale-[1.02] focus-visible:outline-[var(--bg-primary)] transform',
        square: 'bg-transparent text-gray-400 font-bold hover:text-black',
      },
      size: {
        sm: 'rounded-sm px-3 text-sm',
        default: 'px-4 py-2 text-sm',
        lg: 'rounded-sm px-8 text-base',
        icon: 'h-8 w-8',
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

type TooltipWrapperProps = {
  tooltipText?: string;
  children: React.ReactNode;
};

// Server-safe tooltip wrapper that only shows on desktop
const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ tooltipText, children }) => {
  if (!tooltipText) {
    return <>{children}</>;
  }

  return (
    <div className="hidden md:block">
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    </div>
  );
};

// Fallback without tooltip for mobile
const MobileWrapper: React.FC<{ children: React.ReactNode; hasTooltip: boolean }> = ({
  children,
  hasTooltip,
}) => {
  if (!hasTooltip) {
    return <>{children}</>;
  }

  return <div className="block md:hidden">{children}</div>;
};

type ButtonBaseProps = {
  asChild?: boolean;
  icon?: React.ComponentType<{
    size?: string | number;
    stroke?: string | number;
    className?: string;
  }>;
  iconPosition?: 'left' | 'right';
  targetBlank?: boolean;
  tooltipText?: string;
  tooltipClickText?: string;
  tooltipClickDuration?: number;
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
      tooltipText,
      tooltipClickText,
      tooltipClickDuration = 2000,
      children,
      ...props
    },
    ref
  ) => {
    // Handle icon spacing and animations
    const hasIcon = TablerIcon;
    const iconSpacing = hasIcon ? 'gap-2 transition-all duration-200' : '';
    const tertiaryHover = hasIcon && variant === 'tertiary' ? 'hover:gap-3' : '';

    // Disable animations for simple variant
    const simpleNoAnimation = variant === 'square' && hasIcon ? 'gap-2' : '';

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
        <TablerIcon
          size={getIconSize()}
          stroke={1.5}
          className={variant === 'square' ? '' : 'transition-all duration-200'}
        />
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
      variant === 'square' ? simpleNoAnimation : iconSpacing,
      variant === 'square' ? '' : tertiaryHover
    );

    // Create the button element based on type
    const createButtonElement = () => {
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
    };

    const buttonElement = createButtonElement();
    const hasTooltip = Boolean(tooltipText);

    // If no tooltip, return the button directly
    if (!hasTooltip) {
      return buttonElement;
    }

    // Return both desktop (with tooltip) and mobile (without tooltip) versions
    return (
      <>
        <TooltipWrapper tooltipText={tooltipText}>{buttonElement}</TooltipWrapper>
        <MobileWrapper hasTooltip={hasTooltip}>{buttonElement}</MobileWrapper>
      </>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
