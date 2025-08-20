'use client';

import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

import { Logo } from '@/components/Logo';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { TITLE } from '@/constants';

import { NavigationItem, NavigationItemType } from './NavigationItem';
import { DocNavItem } from './nextra/DocNavItem';
import { NavNode } from './nextra/extractDocNavItems';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItemType[];
  docNavItems?: NavNode[];
}

export const MobileNavigation: FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  navigationItems,
  docNavItems = [],
}) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Close sheet when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        // 1024px is lg breakpoint
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);

    // Also check on mount in case component is rendered at desktop size
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onClose]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto px-6 py-6 sm:max-w-sm lg:hidden">
        <SheetTitle className="sr-only">{TITLE}</SheetTitle>
        <div className="flex items-center justify-between">
          <Link href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">{TITLE}</span>
            <Logo size={30} />
          </Link>
        </div>
        <div className="flow-root pl-1">
          {/* Main Navigation Items */}
          <div className=" py-2">
            {navigationItems.map((item) => (
              <div key={item.label} className="block">
                <NavigationItem item={item} isMobile={true} className="pl-0" />
              </div>
            ))}
          </div>

          {/* Documentation Navigation */}
          {docNavItems.length > 0 && (
            <>
              <div className="border-t border-gray-200 my-6" />
              <div className="space-y-2">
                <DocNavItem
                  items={docNavItems}
                  openGroups={openGroups}
                  toggleGroup={toggleGroup}
                  closeMobileMenu={onClose}
                />
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
