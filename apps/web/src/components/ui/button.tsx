import { Slot } from '@radix-ui/react-slot';
import { IconLoader2 } from '@tabler/icons-react';
import { type VariantProps, cva } from 'class-variance-authority';
import Link from 'next/link';
import * as React from 'react';
import { ComponentPropsWithoutRef } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex min-w-fit items-center flex-shrink-0 justify-center whitespace-nowrap rounded-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer leading-none!',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-accent focus:bg-purple-500 focus:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-red-800 focus:bg-red-900',
        outline:
          'bg-transparent text-foreground border border-border hover:bg-accent hover:text-accent-foreground focus:bg-purple-500 focus:text-accent-foreground',
        secondary:
          'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-purple-500 focus:text-accent-foreground',
        ghost: 'hover:bg-black/5 focus:bg-black/15 text-foreground',
        link: 'text-primary hover:text-accent',
      },
      size: {
        sm: 'rounded-md h-[30px] min-h-[30px] max-h-[30px] px-2 text-sm gap-1',
        default: 'rounded-lg h-10 min-h-10 max-h-10 px-3 text-base gap-1',
        lg: 'rounded-lg h-[46px] min-h-[46px] max-h-[46px] px-3.5 text-lg gap-2',
        icon: 'h-5 min-h-5 max-h-5 w-5 min-w-5 max-w-5 p-2 box-content rounded-lg',
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
  loading?: boolean;
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
      return 14;
    case 'lg':
      return 20;
    case 'icon':
    default:
      return 18;
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
      loading = false,
      ...props
    },
    ref
  ) => {
    // Transform children to Title Case when needed
    const buttonLabelChildren = titleize ? transformTextToTitleCase(children) : children;

    // Handle icon spacing and animations
    const hasIcon = TablerIcon;

    // Render content with icon positioning
    const renderContent = () => {
      const iconElement = loading ? (
        <IconLoader2 size={getButtonIconSize(size)} stroke={1.5} className={'animate-spin'} />
      ) : hasIcon ? (
        <TablerIcon
          size={getButtonIconSize(size)}
          stroke={1.5}
          className="transition-all duration-200 "
        />
      ) : null;

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
      variant === 'link' && 'px-0 h-auto'
    );

    // Create the button element based on type
    const createButtonElement = () => {
      // If forceButton is true, always render as button regardless of href
      if (forceButton) {
        return (
          <button
            className={finalClassName}
            ref={ref as React.Ref<HTMLButtonElement>}
            disabled={(props as ButtonAsButton).disabled || loading}
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
          disabled={(props as ButtonAsButton).disabled || loading}
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
