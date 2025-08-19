'use client';

import { useClerk } from '@clerk/nextjs';
import { Navbar } from 'nextra-theme-docs';
import { useCallback, useEffect, useState } from 'react';

import { Logo } from '@/components/Logo';
import MainNavigation from '@/components/navigation/MainNavigation';
import MobileNavigationButton from '@/components/navigation/MobileNavigationButton';
import { TITLE } from '@/constants';
import { AnalyticEvent } from '@/lib/analytics';
import { trackClientEvent } from '@/lib/analytics/helpers';
import { cn } from '@/lib/utils';

import { Container } from '../Container';
import { MobileNavigation } from './MobileNavigation';
import {
  generalNavigations,
  signedInUserNavigations,
  signedOutUserNavigations,
} from './navigationConstants';

export default function NextraNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, loaded, user } = useClerk();

  const userNavigations = isSignedIn ? signedInUserNavigations : signedOutUserNavigations;
  const allMobileNavigations = [...generalNavigations, ...userNavigations];

  const handleMobileMenuToggle = useCallback((isOpen: boolean) => {
    setMobileMenuOpen(isOpen);
    trackClientEvent(AnalyticEvent.ToggledMobileMenu, {
      open: isOpen,
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Container
      className={cn(
        'lg:sticky top-0 z-50 transition-colors duration-200',
        isScrolled ? 'bg-muted/60' : 'bg-transparent'
      )}
    >
      <Navbar
        logo={
          <div className="flex items-center gap-x-4 block flex-shrink-0">
            <span className="sr-only">{TITLE}</span>
            <Logo size={30} />
          </div>
        }
        logoLink="/"
        className="bg-transparent! px-0! pt-[3px]"
      >
        <MainNavigation />
        <MobileNavigationButton onToggle={handleMobileMenuToggle} />
      </Navbar>

      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => handleMobileMenuToggle(false)}
        navigationItems={allMobileNavigations}
      />
    </Container>
  );
}
