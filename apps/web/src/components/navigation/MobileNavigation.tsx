'use client';

import { useClerk } from '@clerk/nextjs';
import { IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

import { Logo } from '@/components/Logo';
import {
  generalNavigations,
  signedInUserNavigations,
  signedOutUserNavigations,
} from '@/components/navigation/navigationConstants';
import { Sheet, SheetContent, SheetFooter, SheetTitle } from '@/components/ui/sheet';
import { TITLE } from '@/constants';

import AppStoreLink from '../AppStoreLink';
import { Button } from '../ui/button';
import { NavigationItem } from './NavigationItem';
import { DocNavItem } from './nextra/DocNavItem';
import { NavNode } from './nextra/extractDocNavItems';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  docNavItems?: NavNode[];
}

export const MobileNavigation: FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  docNavItems = [],
}) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const { isSignedIn, loaded, user } = useClerk();

  const userNavigations = isSignedIn ? signedInUserNavigations : signedOutUserNavigations;
  const allMobileNavigations = [...generalNavigations, ...userNavigations];

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
      <SheetContent
        side="right"
        className="w-full overflow-y-auto px-6 py-6 pb-0 sm:max-w-sm lg:hidden [&>button:first-of-type]:hidden"
      >
        <SheetTitle className="sr-only">{TITLE}</SheetTitle>
        <div className="flex items-center justify-between">
          <Link href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">{TITLE}</span>
            <Logo size={30} />
          </Link>
          <button onClick={onClose} className="hover:text-accent">
            <IconX />
          </button>
        </div>
        <div className="flow-root pl-1 mt-2">
          {/* Main Navigation Items */}
          <div>
            {generalNavigations.map((item) =>
              item.label === 'Documentation' ? (
                <div key={item.label} className="block space-y-4">
                  <NavigationItem item={item} isMobile={true} className="pl-0 m-0 my-2" />
                  {docNavItems.length > 0 && (
                    <div className="space-y-2">
                      <DocNavItem
                        items={docNavItems}
                        openGroups={openGroups}
                        toggleGroup={toggleGroup}
                        closeMobileMenu={onClose}
                      />
                    </div>
                  )}
                  <div className="border-t border-muted-foreground/20"></div>
                </div>
              ) : (
                <div key={item.label} className="block space-y-4">
                  <NavigationItem item={item} isMobile={true} className="pl-0 m-0 my-2" />
                  <div className="border-t border-muted-foreground/20"></div>
                </div>
              )
            )}
          </div>

          <div className="flex flex-col mt-6">
            <div className="bg-muted rounded rounded-sm px-4 py-3 w-full">
              <p className="text-sm font-bold text-foreground mb-3">
                Try edge AI on your device with Apollo
              </p>
              <AppStoreLink
                display="badge"
                height={35}
                link="https://apps.apple.com/us/app/apollo-powered-by-liquid/id6448019325"
              />
            </div>
          </div>
        </div>

        <SheetFooter className="sticky bottom-0 p-4 w-full bg-white z-10 py-6">
          {userNavigations.map((item, index) => (
            <Button
              key={item.label}
              variant={index === 0 ? 'default' : 'outline'}
              icon={item.icon}
              iconPosition="left"
              href={item.href}
            >
              {item.label}
            </Button>
          ))}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
