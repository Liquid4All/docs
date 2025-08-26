import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { NavNode } from '@/components/navigation/nextra/extractDocNavItems';

// Mock data for documentation navigation items
const mockDocNavItems: NavNode[] = [
  {
    title: 'Getting Started',
    href: '/docs/getting-started',
    children: [
      {
        title: 'Installation',
        href: '/docs/getting-started/installation',
      },
      {
        title: 'Quick Start',
        href: '/docs/getting-started/quick-start',
      },
      {
        title: 'Configuration',
        href: '/docs/getting-started/configuration',
      },
    ],
  },
  {
    title: 'API Reference',
    href: '/docs/api',
    children: [
      {
        title: 'Authentication',
        href: '/docs/api/auth',
        children: [
          {
            title: 'Login',
            href: '/docs/api/auth/login',
          },
          {
            title: 'Logout',
            href: '/docs/api/auth/logout',
          },
        ],
      },
      {
        title: 'Users',
        href: '/docs/api/users',
      },
      {
        title: 'Organizations',
        href: '/docs/api/organizations',
      },
    ],
  },
  {
    title: 'Guides',
    href: '/docs/guides',
    children: [
      {
        title: 'Best Practices',
        href: '/docs/guides/best-practices',
      },
      {
        title: 'Troubleshooting',
        href: '/docs/guides/troubleshooting',
      },
    ],
  },
];

const meta: Meta<typeof MobileNavigation> = {
  title: 'Components/Navigation/MobileNavigation',
  component: MobileNavigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Mobile navigation component with drawer/sheet interface for smaller screens.',
      },
    },
  },
  args: {
    isOpen: true,
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof MobileNavigation>;

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: action('onClose'),
    docNavItems: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Mobile navigation when user is not signed in - shows sign in/sign up options.',
      },
    },
  },
};

export const WithDocumentation: Story = {
  args: {
    isOpen: true,
    onClose: action('onClose'),
    docNavItems: mockDocNavItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mobile navigation with documentation items expanded - shows nested navigation structure.',
      },
    },
  },
};
