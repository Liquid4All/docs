import { IconMenu2 } from '@tabler/icons-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { AnalyticEvent } from '@/lib/analytics';
import { trackClientEvent } from '@/lib/analytics/helpers';

interface MobileNavigationButtonProps {
  onToggle: (isOpen: boolean) => void;
}

const MobileNavigationButton = ({ onToggle }: MobileNavigationButtonProps) => {
  const handleMobileMenuToggle = useCallback(() => {
    onToggle(true);
    trackClientEvent(AnalyticEvent.ToggledMobileMenu, {
      open: true,
    });
  }, [onToggle]);

  return (
    <div className="flex lg:hidden">
      <Button variant="link" size="icon" onClick={handleMobileMenuToggle}>
        <span className="sr-only">Open main menu</span>
        <IconMenu2 aria-hidden="true" className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default MobileNavigationButton;
