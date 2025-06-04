'use client';

import { UserResource } from '@clerk/types';
import { Dialog, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC } from 'react';

import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { TITLE } from '@/constants';

import { NavigationItem, NavigationItemType } from './NavigationItem';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItemType[];
  user: UserResource | null | undefined;
  signOut: () => void;
}

const getUserEmails = (user: UserResource | undefined | null): string[] => {
  return user?.emailAddresses?.map((email) => email.emailAddress) ?? [];
};

export const MobileNavigation: FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  navigationItems,
  user,
  signOut,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="lg:hidden">
      <div className="fixed inset-0 z-[60]" />
      <DialogPanel className="fixed inset-y-0 right-0 z-[60] w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Link href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">{TITLE}</span>
            <Logo size="text-2xl" />
          </Link>
          <Button
            variant="tertiary"
            onClick={onClose}
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
          </Button>
        </div>
        <div className="mt-10 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-4 py-2">
              {navigationItems.map((item) => (
                <div key={item.label} className="block">
                  <NavigationItem
                    item={item}
                    isMobile={true}
                    userEmails={getUserEmails(user)}
                    signOut={signOut}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
};
