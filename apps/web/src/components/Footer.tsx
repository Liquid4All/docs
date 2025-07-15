import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { Container } from '@/components/Container';
import FeedbackButton from '@/components/FeedbackButton';
import { Logo } from '@/components/Logo';
import {
  ACCEPTABLE_USE_URL,
  DISCORD_INVITE_URL,
  PRIVACY_POLICY_URL,
  TERMS_OF_SERVICE_URL,
  TITLE,
} from '@/constants';

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

  connect: [
    { label: 'Feedback', href: '#', special: 'feedback' },
    { label: 'Discord', href: DISCORD_INVITE_URL, external: true },
  ],

  legal: [
    { label: 'Acceptable Use Policy', href: ACCEPTABLE_USE_URL },
    { label: 'Terms & Conditions', href: TERMS_OF_SERVICE_URL },
    { label: 'Privacy Policy', href: PRIVACY_POLICY_URL, external: true },
  ],
};

interface FooterSectionProps {
  title: string;
  links: LinkType[];
}

const LINK_CLASSNAME =
  'text-sm text-black hover:text-purple-800 transition-colors inline-flex items-center gap-1 py-0';

const FooterSection = ({ title, links }: FooterSectionProps) => (
  <div className="flex-row lg:flex-col md:space-y-4">
    <p className="monospace block uppercase">{title}</p>
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
          <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
            {/* Column 1: Logo section - Always stacked vertically */}
            <div className="flex flex-col gap-2 lg:justify-start">
              <Link href="/" className="block">
                <span className="sr-only">{TITLE}</span>
                <Logo variant="image" color="dark" size={30} />
              </Link>
              <small className="small block">by Liquid AI</small>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:contents">
              {/* Column 2: Desktop center, Tablet/Mobile stacked */}
              <div className="flex flex-wrap md:flex-nowrap md:flex-row gap-8 sm:gap-16 md:flex-1 lg:justify-end">
                <FooterSection title="Explore" links={footerData.explore} />
                <FooterSection title="Company" links={footerData.company} />
                <FooterSection title="Connect" links={footerData.connect} />
                <FooterSection title="Legal" links={footerData.legal} />
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col justify-between text-gray-500 sm:flex-row sm:items-center">
            <small className="small block">314 Main St, Cambridge, MA 02142</small>
            <small className="small block">
              © {new Date().getFullYear()}, Liquid AI, Inc. All rights reserved.
            </small>
          </div>
        </div>
      </Container>
    </footer>
  );
}
