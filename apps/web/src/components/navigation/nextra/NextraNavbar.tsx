'use client';

import { useClerk } from '@clerk/nextjs';
import { PageMapItem } from 'nextra';
import { Navbar } from 'nextra-theme-docs';
import { Search } from 'nextra/components/search';
import { useCallback, useEffect, useState } from 'react';

import { Container } from '@/components/Container';
import { Logo } from '@/components/Logo';
import MainNavigation from '@/components/navigation/MainNavigation';
import MobileNavigationButton from '@/components/navigation/MobileNavigationButton';
import { TITLE } from '@/constants';
import { AnalyticEvent } from '@/lib/analytics';
import { trackClientEvent } from '@/lib/analytics/helpers';
import { cn } from '@/lib/utils';

import { MobileNavigation } from '../MobileNavigation';
import {
  generalNavigations,
  signedInUserNavigations,
  signedOutUserNavigations,
} from '../navigationConstants';
import { extractDocNavItems } from '../nextra/extractDocNavItems';

interface NextraNavbarProps {
  pageMap?: PageMapItem[];
}

export default function NextraNavbar({ pageMap = [] }: NextraNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isSignedIn, loaded, user } = useClerk();

  const userNavigations = isSignedIn ? signedInUserNavigations : signedOutUserNavigations;
  const allMobileNavigations = [...generalNavigations, ...userNavigations];

  const docNavItems = extractDocNavItems(pageMap, '/docs');

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Container
      className={cn(
        'md:sticky top-0 z-50 transition-colors duration-200',
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

      {isMobile && <Search className="mt-2" />}

      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => handleMobileMenuToggle(false)}
        navigationItems={allMobileNavigations}
        docNavItems={docNavItems}
      />
    </Container>
  );
}
