import { UserResource } from '@clerk/types';
import { IconUserCircle } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { AnalyticEvent } from '@/lib/analytics';
import { trackClientEvent } from '@/lib/analytics/helpers';
import { getUserPrimaryEmail } from '@/lib/user';

import { NavigationItem } from './NavigationItem';
import { signedInUserNavigations, signedOutUserNavigations } from './navigationConstants';

interface ProfileDropdownProps {
  isSignedIn: boolean;
  user: UserResource | null | undefined;
}

export const ProfileDropdown: FC<ProfileDropdownProps> = ({ isSignedIn, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const userNavigations = isSignedIn ? signedInUserNavigations : signedOutUserNavigations;
  const userPrimaryEmail = getUserPrimaryEmail(user);

  const getUserInitials = useCallback((): string => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (userPrimaryEmail != null) {
      return userPrimaryEmail.charAt(0).toUpperCase();
    }
    return 'U';
  }, [user?.firstName, user?.lastName, userPrimaryEmail]);

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent): void => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return (): void => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      if (!isOpen) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((prev: number) => (prev < userNavigations.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev: number) => (prev > 0 ? prev - 1 : userNavigations.length - 1));
          break;
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0) {
            event.preventDefault();
            const { hrefFn, href } = userNavigations[focusedIndex];
            if (hrefFn != null && window != null) {
              return router.push(hrefFn({ location: window.location }));
            } else if (href != null) {
              return router.push(href);
            }
            setIsOpen(false);
            setFocusedIndex(-1);
          }
          break;
      }
    },
    [isOpen, focusedIndex, userNavigations, router]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return (): void => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleDropdown = useCallback((): void => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    setFocusedIndex(-1);
    if (newIsOpen) {
      trackClientEvent(AnalyticEvent.OpenedProfileDropdown);
    }
  }, [isOpen]);

  const handleMouseEnter = useCallback((index: number): void => {
    setFocusedIndex(index);
  }, []);

  const handleMouseLeave = useCallback((): void => {
    setFocusedIndex(-1);
  }, []);

  return (
    <div className="relative flex">
      <Button
        variant="link"
        size={isSignedIn ? 'sm' : 'icon'}
        ref={buttonRef}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="font-normal px-0"
      >
        <IconUserCircle stroke={1.5} className="h-5 w-5" />
        {isSignedIn && <span className="uppercase">{getUserInitials()}</span>}
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-8 z-100 w-fit p-1 text-left origin-top-right divide-y divide-muted bg-background rounded-sm shadow-lg focus:outline-none"
        >
          <div className="space-y-1">
            {userNavigations.map((item, index) => (
              <div
                key={item.label}
                className={`rounded-sm whitespace-nowrap ${focusedIndex === index ? 'bg-muted' : ''}`}
                onMouseEnter={(): void => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <NavigationItem item={item} isMobile={false} className="px-4! py-2!" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
