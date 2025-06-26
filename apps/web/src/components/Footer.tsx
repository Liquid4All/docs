import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import AppStoreLink from '@/components/AppStoreLink';
import { Container } from '@/components/Container';
import FeedbackButton from '@/components/FeedbackButton';
import { Logo } from '@/components/Logo';
import { Text } from '@/components/Text';
import { TITLE } from '@/constants';

interface LinkType {
  label: string;
  href: string;
  external?: boolean;
  special?: 'feedback';
}

interface FooterType {
  explore: LinkType[];
  company: LinkType[];
  leap: LinkType[];
  legal: LinkType[];
}

const footerData: FooterType = {
  explore: [
    { label: 'Models', href: '/models' },
    { label: 'Documentation', href: '/docs' },
  ],

  company: [
    { label: 'About', href: 'https://www.liquid.ai/company/about', external: true },
    { label: 'Careers', href: 'https://jobs.lever.co/liquid.ai', external: true },
  ],

  leap: [{ label: 'Feedback', href: '#', special: 'feedback' }],

  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
};

interface FooterSectionProps {
  title: string;
  links: LinkType[];
}

const LINK_CLASSNAME =
  'text-sm text-black hover:text-purple-800 transition-colors inline-flex items-center gap-1';

const FooterSection = ({ title, links }: FooterSectionProps) => (
  <div className="flex-row lg:flex-col space-y-4">
    <Text variant="jetbrains" className="block">
      {title}
    </Text>
    <ul className="space-y-1">
      {links.map((link) => {
        if (link.special === 'feedback') {
          return (
            <li key={link.label}>
              <FeedbackButton label={link.label} className={LINK_CLASSNAME} />
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
              {link.external && <ArrowUpRightIcon className="w-3 h-3" />}
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-white">
      <Container>
        <div className="py-8">
          {/* Main footer content */}
          <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
            {/* Column 1: Logo section - Always stacked vertically */}
            <div className="flex flex-col gap-2 lg:justify-start">
              <Link href="/" className="block">
                <span className="sr-only">{TITLE}</span>
                <Logo />
              </Link>
              <Text variant="small" className="block">
                By Liquid AI
              </Text>
            </div>

            {/* Tablet: Wrapper to keep col2 and col3 in same row */}
            <div className="flex flex-col md:flex-row gap-8 lg:contents">
              {/* Column 2: Middle sections - Desktop center, Tablet/Mobile stacked */}
              <div className="flex md:flex-row gap-8 sm:gap-16 lg:justify-center md:flex-1 md:flex-col">
                <FooterSection title="EXPLORE" links={footerData.explore} />
                <FooterSection title="COMPANY" links={footerData.company} />
                <FooterSection title="LEAP" links={footerData.leap} />
              </div>

              {/* Column 3: App download - Desktop right */}
              <div className="bg-gray-200 rounded-sm p-4 pt-2 w-full items-center sm:w-fit md:justify-end">
                <Text variant="small" className="block text-black">
                  Vibe check our models with Apollo:
                </Text>
                <div className="flex flex-row gap-4 mt-2">
                  <AppStoreLink
                    platform="android"
                    link="https://play.google.com/store/apps/details?id=com.yourapp.name"
                    theme="dark"
                  />
                  <AppStoreLink
                    platform="ios"
                    link="https://apps.apple.com/us/app/apollo-ai-private-local-ai/id6448019325"
                    theme="dark"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col justify-between text-gray-500 sm:flex-row sm:items-center">
            <div className="flex gap-x-6 space-y-4 sm:space-y-0">
              {footerData.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-purple-800 transition-colors"
                  aria-label={link.label.toLowerCase()}
                >
                  <Text variant="small" className="block text-xs">
                    {link.label}
                  </Text>
                </Link>
              ))}
            </div>
            <Text variant="small" className="block text-xs">
              © {new Date().getFullYear()}, Liquid AI, Inc. All rights reserved.
            </Text>
          </div>
        </div>
      </Container>
    </footer>
  );
}
