import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import Link from 'next/link';
import * as React from 'react';
import { ComponentPropsWithoutRef } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        // shadcn/ui variants
        default: 'bg-[var(--primary)] text-primary-foreground hover:bg-[var(--primary)]/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-neutral-400/50 font-bold bg-transparent hover:bg-black/5',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'text-black hover:text-[var(--primary)]',
        link: 'text-[var(--primary)] underline-offset-4 hover:underline hover:text-[var(--primary)]/80',
        primary:
          'bg-black text-white font-bold hover:bg-black/70 focus-visible:outline-[var(--primary)] transform',
        tertiary: 'text-gray-900 hover:text-[var(--primary)] hover:font-bold transform',
        square: 'bg-transparent text-neutral-400 font-bold hover:text-black',
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

// Utility function to convert text to Title Case
const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Recursively transform text content to Title Case
const transformTextToTitleCase = (children: React.ReactNode): React.ReactNode => {
  if (typeof children === 'string') {
    return toTitleCase(children);
  }

  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      children: transformTextToTitleCase(children.props.children),
    });
  }

  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <React.Fragment key={index}>{transformTextToTitleCase(child)}</React.Fragment>
    ));
  }

  return children;
};

type TooltipWrapperProps = {
  tooltipText?: string;
  tooltipAlign?: 'start' | 'center' | 'end';
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
};

// Server-safe tooltip wrapper that only shows on desktop
const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  tooltipText,
  tooltipSide,
  tooltipAlign,
  children,
}) => {
  if (!tooltipText) {
    return <>{children}</>;
  }

  return (
    <div className="hidden md:block">
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={tooltipSide} align={tooltipAlign}>
          {tooltipText}
        </TooltipContent>
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
  tooltipAlign?: 'start' | 'center' | 'end';
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  // Add this prop to force rendering as a button even when href is provided
  forceButton?: boolean;
  // Capitalize the button label, enabled by default
  titleize?: boolean;
} & VariantProps<typeof buttonVariants>;

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonBaseProps> & {
    href: string;
  };

export const getButtonIconSize = (size: ButtonProps['size']): number => {
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
      tooltipAlign,
      tooltipSide,
      forceButton = false,
      titleize = true,
      children,
      ...props
    },
    ref
  ) => {
    // Transform children to Title Case when needed
    const buttonLabelChildren = titleize ? transformTextToTitleCase(children) : children;

    // Handle icon spacing and animations
    const hasIcon = TablerIcon;
    const iconSpacing = hasIcon ? 'gap-2 transition-all duration-200' : '';
    const tertiaryHover = hasIcon && variant === 'tertiary' ? 'hover:gap-3' : '';

    // Disable animations for simple variant
    const simpleNoAnimation = variant === 'square' && hasIcon ? 'gap-2' : '';

    // Render content with icon positioning
    const renderContent = () => {
      if (!hasIcon) {
        return buttonLabelChildren;
      }

      const iconElement = (
        <TablerIcon
          size={getButtonIconSize(size)}
          stroke={1.5}
          className={variant === 'square' ? '' : 'transition-all duration-200'}
        />
      );

      return iconPosition === 'left' ? (
        <>
          {iconElement}
          {buttonLabelChildren}
        </>
      ) : (
        <>
          {buttonLabelChildren}
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
      // If forceButton is true, always render as button regardless of href
      if (forceButton) {
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
        <TooltipWrapper
          tooltipText={tooltipText}
          tooltipSide={tooltipSide}
          tooltipAlign={tooltipAlign}
        >
          {buttonElement}
        </TooltipWrapper>
        <MobileWrapper hasTooltip={hasTooltip}>{buttonElement}</MobileWrapper>
      </>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
