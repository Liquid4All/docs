'use client';

import { IconExternalLink } from '@tabler/icons-react';
import Link from 'next/link';

import { Container } from '@/components/Container';
import FeedbackButton from '@/components/FeedbackButton';
import { Logo } from '@/components/Logo';
import {
  ACCEPTABLE_USE_URL,
  DISCORD_INVITE_URL,
  GITHUB_URL,
  LQ_ABOUT_URL,
  LQ_JOB_PAGE_URL,
  PLAYGROUND_URL,
  PRIVACY_POLICY_URL,
  TERMS_OF_SERVICE_URL,
  TITLE,
} from '@/constants';
import { cn } from '@/lib/utils';

import AppStoreLink from './AppStoreLink';

interface LinkType {
  label: string;
  href: string;
  external?: boolean;
  special?: 'feedback';
}

interface FooterType {
  explore: LinkType[];
  company: LinkType[];
  connect: LinkType[];
}

const footerData: FooterType = {
  explore: [
    { label: 'LFM', href: '/lfm' },
    { label: 'LEAP', href: '/leap' },
    { label: 'Examples', href: '/examples' },
    { label: 'Playground', href: PLAYGROUND_URL, external: true },
  ],

  company: [
    { label: 'About', href: LQ_ABOUT_URL, external: true },
    { label: 'Careers', href: LQ_JOB_PAGE_URL, external: true },
    { label: 'Acceptable Use Policy', href: ACCEPTABLE_USE_URL },
    { label: 'Terms & Conditions', href: TERMS_OF_SERVICE_URL },
    { label: 'Privacy Policy', href: PRIVACY_POLICY_URL, external: true },
  ],

  connect: [
    { label: 'Discord', href: DISCORD_INVITE_URL, external: true },
    { label: 'Github', href: GITHUB_URL, external: true },
    { label: 'Feedback', href: '#', special: 'feedback' },
  ],
};

interface FooterSectionProps {
  title: string;
  links: LinkType[];
}

const LINK_CLASSNAME =
  'text-sm text-foreground hover:text-accent transition-colors inline-flex items-center gap-1 py-0';

const FooterSection = ({ title, links }: FooterSectionProps) => (
  <div className="flex-row lg:flex-col space-y-3 md:space-y-4">
    <p className="monospace block uppercase text-sm">{title}</p>
    <ul className="space-y-1">
      {links.map((link) => {
        if (link.special === 'feedback') {
          return (
            <li key={link.label}>
              <FeedbackButton label={link.label} className={cn(LINK_CLASSNAME, 'font-normal')} />
            </li>
          );
        }

        return (
          <li key={link.label}>
            <Link
              href={link.href}
              className={LINK_CLASSNAME}
              {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
            >
              {link.label}
              {link.external && <IconExternalLink className="w-4 h-4" />}
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-background">
      <Container>
        <div className="px-2 md:px-10 lg:px-6 pt-8 md:pt-14 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Logo section - left column */}
            <div className="flex flex-col space-y-2 lg:justify-start border-b lg:border-none pb-8 lg:pb-0">
              <Link href="/" className="block">
                <span className="sr-only">{TITLE}</span>
                <Logo size={40} />
              </Link>
              <p className="text-muted-foreground text-sm ml-2">by Liquid AI</p>
            </div>

            {/* Navigation sections - middle column that stretches */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-18 md:gap-24 lg:gap-16 lg:gap-24 lg:justify-center w-full lg:flex-1">
              <FooterSection title="Explore" links={footerData.explore} />
              <FooterSection title="Connect" links={footerData.connect} />
              <FooterSection title="Company" links={footerData.company} />
            </div>

            {/* App wrapper - right column */}
            <div className="flex flex-col bg-muted rounded rounded-md px-4 py-3 w-[100%] lg:w-fit lg:h-fit lg:flex-shrink-0">
              <p className="text-sm font-bold text-foreground mb-2">
                Try edge AI on your device with Apollo
              </p>
              <AppStoreLink
                display="badge-qr"
                height={55}
                link="https://apps.apple.com/us/app/apollo-powered-by-liquid/id6448019325"
              />
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-8 pt-12 lg:pt-8 border-t border-muted-foreground/20 flex flex-col justify-between text-muted-foreground/50 sm:flex-row sm:items-center">
            <p className="text-xs sm:text-sm muted-foreground/50">
              © {new Date().getFullYear()}, Liquid AI, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
