'use client';

import { UserResource } from '@clerk/types';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { FC, useEffect, useRef, useState } from 'react';

import { NavigationItem } from './NavigationItem';
import { signedInUserNavigations, signedOutUserNavigations } from './navigationConstants';

interface ProfileDropdownProps {
  isSignedIn: boolean;
  user: UserResource | null | undefined;
  signOut: () => void;
}

const getUserEmails = (user: UserResource | undefined | null): string[] => {
  return user?.emailAddresses?.map((email) => email.emailAddress) ?? [];
};

export const ProfileDropdown: FC<ProfileDropdownProps> = ({ isSignedIn, user, signOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const userNavigations = isSignedIn ? signedInUserNavigations : signedOutUserNavigations;
  const userEmails = getUserEmails(user);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
          setFocusedIndex((prev) => (prev < userNavigations.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : userNavigations.length - 1));
          break;
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0) {
            event.preventDefault();
            // Handle navigation item click
            const item = userNavigations[focusedIndex];
            if (item.action === 'sign-out') {
              signOut();
            }
            setIsOpen(false);
            setFocusedIndex(-1);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, userNavigations, signOut]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="inline-flex items-center gap-x-1.5 px-3 py-2 text-sm text-gray-900 hover:text-purple-800"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <UserCircleIcon className="h-5 w-5 text-black" />
        {isSignedIn && <span>{user?.firstName || userEmails[0] || 'User'}</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-100 w-fit p-1 text-left origin-top-right divide-y divide-gray-100 bg-white rounded-sm shadow-lg focus:outline-none">
          <div className="space-y-2">
            {userNavigations
              .filter((item) => !item.liquidOnly || userEmails.some((e) => e.endsWith('liquid.ai')))
              .map((item, index) => (
                <div
                  key={item.label}
                  className={`rounded-sm whitespace-nowrap ${focusedIndex === index ? 'bg-gray-100' : ''}`}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onMouseLeave={() => setFocusedIndex(-1)}
                >
                  <NavigationItem
                    item={item}
                    isMobile={false}
                    userEmails={userEmails}
                    signOut={signOut}
                    className="px-4 py-1 "
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
