import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface NavigationItemType {
  label: string;
  href?: string;
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
  const baseClassName = isMobile ? '' : 'text-md font-normal p-1';

  return (
    <Button
      key={item.label}
      href={item.href ?? undefined}
      // Use tertiary as default variant, tertiary for mobile
      variant="link"
      icon={item.icon}
      onClick={onClick}
      className={cn(baseClassName, className)}
      size="sm"
    >
      {item.label}
    </Button>
  );
};
