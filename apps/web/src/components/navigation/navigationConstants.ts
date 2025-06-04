import { LogIn, LogOut, UserPlus } from 'lucide-react';

import { NavigationItemType } from '@/components/navigation/NavigationItem';

// Navigation items that are not user-related (always visible)
export const generalNavigations: NavigationItemType[] = [
  { label: 'Models', href: '/models', variant: 'tertiary' },
  { label: 'Documentation', href: '/docs', variant: 'tertiary' },
];

// User-related navigation items for signed-in users
export const signedInUserNavigations: NavigationItemType[] = [
  { label: 'Dashboard', liquidOnly: true, href: '/dashboard', variant: 'tertiary' },
  { label: 'Profile', href: '/profile', variant: 'tertiary' },
  { label: 'Sign Out', href: '#', action: 'sign-out', variant: 'tertiary', icon: LogOut },
];

// User-related navigation items for signed-out users
export const signedOutUserNavigations: NavigationItemType[] = [
  { label: 'Sign In', href: '/sign-in', variant: 'tertiary', icon: LogIn },
  { label: 'Sign Up', href: '/sign-up', variant: 'tertiary', icon: UserPlus },
];
