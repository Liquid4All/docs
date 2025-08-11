'use client';

import { IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { FC } from 'react';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { TITLE } from '@/constants';

import { NavigationItem, NavigationItemType } from './NavigationItem';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItemType[];
}

export const MobileNavigation: FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  navigationItems,
}) => {
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
        <div className="mt-10 flow-root">
          <div className="-my-6 ">
            <div className="space-y-4 py-2">
              {navigationItems.map((item) => (
                <div key={item.label} className="block">
                  <NavigationItem item={item} isMobile={true} className="pl-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
