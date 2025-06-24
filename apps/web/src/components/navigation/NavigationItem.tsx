import { Button } from '@/components/ui/button';

export interface NavigationItemType {
  label: string;
  href?: string;
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
  onClick?: () => void;
  className?: string;
}

export const NavigationItem = ({ item, isMobile, onClick, className }: NavigationItemProps) => {
  const baseClassName = isMobile ? '' : 'text-md p-1';

  // Use tertiary as default variant, tertiary for mobile
  const variant = item.variant || 'tertiary';

  return (
    <Button
      key={item.label}
      href={item.href ?? undefined}
      variant={isMobile ? 'tertiary' : variant}
      icon={item.icon}
      onClick={onClick}
      className={className || baseClassName}
      size="small"
    >
      {item.label}
    </Button>
  );
};
