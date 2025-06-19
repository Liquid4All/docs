import { FC } from 'react';

import { Button } from '@/components/ui/button';

export interface NavigationItemType {
  label: string;
  href: string;
  liquidOnly?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  icon?: React.ComponentType<{
    size?: string | number;
    stroke?: string | number;
    className?: string;
  }>;
}

interface NavigationItemProps {
  item: NavigationItemType;
  isMobile: boolean;
  userEmails: string[];
  className?: string;
}

export const NavigationItem: FC<NavigationItemProps> = ({
  item,
  isMobile,
  userEmails,
  className,
}) => {
  if (item.liquidOnly && !userEmails.some((e) => e.endsWith('liquid.ai'))) {
    return null;
  }

  const baseClassName = isMobile ? '' : 'text-md p-1';

  // Use tertiary as default variant, tertiary for mobile
  const variant = item.variant || 'tertiary';

  return (
    <Button
      key={item.label}
      href={item.href}
      variant={isMobile ? 'tertiary' : variant}
      icon={item.icon}
      className={className || baseClassName}
      size="small"
    >
      {item.label}
    </Button>
  );
};
