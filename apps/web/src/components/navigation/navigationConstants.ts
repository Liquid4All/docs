import { IconLogin, IconLogout, IconUserPlus } from '@tabler/icons-react';

import { NavigationItemType } from '@/components/navigation/NavigationItem';

// Navigation items that are userprofile independent
export const generalNavigations: NavigationItemType[] = [
  { label: 'Models', href: '/models' },
  { label: 'Documentation', href: '/docs' },
];

// Navigation items for signed-in users
export const signedInUserNavigations: NavigationItemType[] = [
  { label: 'Profile', href: '/profile' },
  { label: 'Sign Out', href: '/sign-out', icon: IconLogout },
];

// Navigation items for signed-out users
export const signedOutUserNavigations: NavigationItemType[] = [
  { label: 'Sign In', href: '/sign-in', icon: IconLogin },
  { label: 'Sign Up', href: '/sign-up', icon: IconUserPlus },
];
