'use client';

import { useClerk } from '@clerk/nextjs';
import { IconMessage } from '@tabler/icons-react';
import React from 'react';

import FeedbackButton from '@/components/FeedbackButton';
import { NavigationItem } from '@/components/navigation/NavigationItem';
import { ProfileDropdown } from '@/components/navigation/ProfileDropdown';
import { generalNavigations } from '@/components/navigation/navigationConstants';

// Main Navbar Component
const MainNavigation = ({}) => {
  const { isSignedIn, loaded, user } = useClerk();

  return (
    <nav>
      <div className="flex flex-row items-center gap-6">
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-x-6 md:items-center">
          {/* General navigation items */}
          {generalNavigations.map((item) => (
            <NavigationItem key={item.label} item={item} isMobile={false} />
          ))}
        </div>
        <div className="flex flex-row items-center gap-4">
          {/* Feedback button */}
          <FeedbackButton
            size="icon"
            className="hover:text-accent "
            label={<IconMessage stroke={1.5} size={20} />}
          />
          {/* Profile dropdown for user-related items */}
          {loaded && <ProfileDropdown isSignedIn={isSignedIn} user={user} />}
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
