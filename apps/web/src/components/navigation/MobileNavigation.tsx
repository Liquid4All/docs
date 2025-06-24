'use client';

import { IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { FC } from 'react';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="fixed inset-y-0 right-0 z-[60] w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right lg:hidden translate-x-0 translate-y-0">
        <DialogTitle className="sr-only">{TITLE}</DialogTitle>
        <div className="flex items-center justify-between">
          <Link href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">{TITLE}</span>
            <Logo size="text-2xl" />
          </Link>
          <Button
            variant="ghost"
            onClick={onClose}
            icon={IconX}
            className="-m-2.5 rounded-md text-gray-700 hover:bg-transparent hover:text-purple-800"
          >
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <div className="mt-10 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-4 py-2">
              {navigationItems.map((item) => (
                <div key={item.label} className="block">
                  <NavigationItem item={item} isMobile={true} className="pl-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
