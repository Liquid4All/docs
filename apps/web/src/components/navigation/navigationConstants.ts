import { IconLogin, IconLogout, IconUserPlus } from '@tabler/icons-react';

import { NavigationItemType } from '@/components/navigation/NavigationItem';

// Navigation items that are userprofile independent
export const generalNavigations: NavigationItemType[] = [
  { label: 'Models', href: '/models' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Documentation', href: '/docs' },
];

// Navigation items for signed-in users
export const signedInUserNavigations: NavigationItemType[] = [
  { label: 'Profile', href: '/profile' },
  { label: 'Log out', href: '/sign-out', icon: IconLogout },
];

// Navigation items for signed-out users
export const signedOutUserNavigations: NavigationItemType[] = [
  {
    label: 'Log in',
    hrefFn: (context: { location: Location }) => {
      if (location == null || location.pathname === '/') {
        return '/sign-in';
      }
      const redirectUrl = context.location.pathname + context.location.search;
      return '/sign-in' + `?redirect_url=${encodeURIComponent(redirectUrl)}`;
    },
    href: '/sign-in',
    icon: IconLogin,
  },
  {
    label: 'Sign up',
    hrefFn: (context: { location: Location }) => {
      if (location == null || location.pathname === '/') {
        return '/sign-up';
      }
      const redirectUrl = context.location.pathname + context.location.search;
      return '/sign-up' + `?redirect_url=${encodeURIComponent(redirectUrl)}`;
    },
    href: '/sign-up',
  },
];
