'use client';

import { UserResource } from '@clerk/types';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef, useState } from 'react';

import { getUserEmails } from '@/lib/user';

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
            const selectedItem = userNavigations[focusedIndex];
            if (selectedItem.href != null) {
              router.push(selectedItem.href);
            }
            setIsOpen(false);
            setFocusedIndex(-1);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, userNavigations, router]);

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
            {userNavigations.map((item, index) => (
              <div
                key={item.label}
                className={`rounded-sm whitespace-nowrap ${focusedIndex === index ? 'bg-gray-100' : ''}`}
                onMouseEnter={() => setFocusedIndex(index)}
                onMouseLeave={() => setFocusedIndex(-1)}
              >
                <NavigationItem item={item} isMobile={false} className="px-4 py-1 " />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
