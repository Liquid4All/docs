import { LucideIcon } from 'lucide-react';
import { Search } from 'nextra/components';
import { FC } from 'react';

import { Button } from '@/components/Button';

export interface NavigationItemType {
  label: string;
  href: string;
  liquidOnly?: boolean;
  action?: 'search' | 'sign-out';
  variant?: 'primary' | 'secondary' | 'tertiary';
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
}

interface NavigationItemProps {
  item: NavigationItemType;
  isMobile: boolean;
  userEmails: string[];
  signOut: () => void;
  className?: string;
}

export const NavigationItem: FC<NavigationItemProps> = ({
  item,
  isMobile,
  userEmails,
  signOut,
  className,
}) => {
  if (item.liquidOnly && !userEmails.some((e) => e.endsWith('liquid.ai'))) {
    return null;
  }

  if (item.action === 'search') {
    return <Search />;
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
      onClick={() => {
        if (item.action === 'sign-out') {
          signOut();
        }
      }}
      className={className || baseClassName}
      size="small"
    >
      {item.label}
    </Button>
  );
};
