'use client';

import { PageMapItem } from 'nextra';
import { Navbar } from 'nextra-theme-docs';
import { useCallback, useEffect, useState } from 'react';

import { Container } from '@/components/Container';
import CustomSearch from '@/components/CustomSearch';
import { Logo } from '@/components/Logo';
import MainNavigation from '@/components/navigation/MainNavigation';
import MobileNavigationButton from '@/components/navigation/MobileNavigationButton';
import { TITLE } from '@/constants';
import { AnalyticEvent } from '@/lib/analytics';
import { trackClientEvent } from '@/lib/analytics/helpers';
import { cn } from '@/lib/utils';

import { MobileNavigation } from '../MobileNavigation';
import { extractDocNavItems } from '../nextra/extractDocNavItems';

interface NextraNavbarProps {
  pageMap?: PageMapItem[];
}

export default function NextraNavbar({ pageMap = [] }: NextraNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const docNavItems = extractDocNavItems(pageMap, '/');

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
        <CustomSearch />
        <MobileNavigationButton onToggle={handleMobileMenuToggle} />
      </Navbar>

      {isMobile && <CustomSearch className="mt-2" />}

      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => handleMobileMenuToggle(false)}
        docNavItems={docNavItems}
      />
    </Container>
  );
}
