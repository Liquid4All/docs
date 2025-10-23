import { ComponentType } from 'react';

import { Button } from '@/components/ui/button';
import { AnalyticEvent } from '@/lib/analytics';
import { trackClientEvent } from '@/lib/analytics/helpers';
import { cn } from '@/lib/utils';

export interface NavigationItemType {
  label: string;
  // function to generate href based on current location
  hrefFn?: (context: { location: Location }) => string;
  // when hrefFn is not provided, this is the fallback href
  href?: string;
  icon?: ComponentType<{
    size?: string | number;
    stroke?: string | number;
    className?: string;
  }>;
}

interface NavigationItemProps {
  item: NavigationItemType;
  isMobile: boolean;
  onClick?: () => void;
  className?: string;
}

export const NavigationItem = ({ item, isMobile, onClick, className }: NavigationItemProps) => {
  const baseClassName = isMobile ? 'text-md font-normal' : 'text-md font-normal p-1';
  const href: string | undefined =
    item.hrefFn != null && window != null
      ? item.hrefFn({ location: window.location })
      : (item.href ?? undefined);

  const handleClick = () => {
    trackClientEvent(AnalyticEvent.ClickedNavbarItem, {
      linkText: item.label,
    });

    onClick?.();
  };

  return (
    <Button
      key={item.label}
      href={href}
      // Use tertiary as default variant, tertiary for mobile
      variant="link"
      icon={item.icon}
      onClick={handleClick}
      className={cn(baseClassName, className)}
      size="sm"
    >
      {item.label}
    </Button>
  );
};
