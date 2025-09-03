'use client';

import { useClerk } from '@clerk/nextjs';
import { IconBrandDiscord, IconBrandGithub } from '@tabler/icons-react';
import { useCallback } from 'react';

import { NavigationItem } from '@/components/navigation/NavigationItem';
import { ProfileDropdown } from '@/components/navigation/ProfileDropdown';
import { generalNavigations } from '@/components/navigation/navigationConstants';
import { DISCORD_INVITE_URL, GITHUB_URL } from '@/constants';
import { AnalyticEvent } from '@/lib/analytics';
import { trackClientEvent } from '@/lib/analytics/helpers';

import { Button } from '../ui/button';

// Main Navbar Component
const MainNavigation = ({}) => {
  const { isSignedIn, loaded, user } = useClerk();

  const handleDiscordClicked = useCallback((): void => {
    trackClientEvent(AnalyticEvent.ClickedNavbarItem, {
      link: DISCORD_INVITE_URL,
    });
  }, []);

  const handleGitHubClicked = useCallback((): void => {
    trackClientEvent(AnalyticEvent.ClickedNavbarItem, {
      link: GITHUB_URL,
    });
  }, []);

  return (
    <nav>
      <div className="flex flex-row items-center gap-8">
        <div className="hidden lg:flex lg:gap-x-6 lg:items-center">
          {generalNavigations.map((item) => (
            <NavigationItem key={item.label} item={item} isMobile={false} />
          ))}
        </div>

        <div className="hidden lg:block h-5 w-2 border-r border-foreground/20"></div>

        <div className="flex flex-row justify-right gap-3">
          <Button
            variant="link"
            size="icon"
            onClick={handleDiscordClicked}
            className="text-foreground"
            href={DISCORD_INVITE_URL}
            targetBlank
          >
            <span className="sr-only">Open LEAP Discord</span>
            <IconBrandDiscord aria-hidden="true" className="h-5.5 w-5.5" stroke={1.7} />
          </Button>
          <Button
            variant="link"
            size="icon"
            onClick={handleGitHubClicked}
            className="text-foreground"
            href={GITHUB_URL}
            targetBlank
          >
            <span className="sr-only">Open LiquidAI GitHub</span>
            <IconBrandGithub aria-hidden="true" className="h-5.5 w-5.5" stroke={1.7} />
          </Button>
          {loaded && <ProfileDropdown isSignedIn={isSignedIn} user={user} />}
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
