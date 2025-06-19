import { IconLogin, IconLogout, IconUserPlus } from '@tabler/icons-react';

import { NavigationItemType } from '@/components/navigation/NavigationItem';

// Navigation items that are userprofile independent
export const generalNavigations: NavigationItemType[] = [
  { label: 'Models', href: '/models', variant: 'tertiary' },
  { label: 'Documentation', href: '/docs', variant: 'tertiary' },
];

// Navigation items for signed-in users
export const signedInUserNavigations: NavigationItemType[] = [
  { label: 'Profile', href: '/profile', variant: 'tertiary' },
  { label: 'Sign Out', href: '/sign-out', variant: 'tertiary', icon: IconLogout },
];

// Navigation items for signed-out users
export const signedOutUserNavigations: NavigationItemType[] = [
  { label: 'Sign In', href: '/sign-in', variant: 'tertiary', icon: IconLogin },
  { label: 'Sign Up', href: '/sign-up', variant: 'tertiary', icon: IconUserPlus },
];
