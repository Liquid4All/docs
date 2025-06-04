import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { Container } from '@/components/Container';

interface LinkType {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterType {
  explore: LinkType[];
  company: LinkType[];
  appStores: LinkType[];
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

  appStores: [
    {
      label: 'Google Play',
      href: 'https://apps.apple.com/us/app/apollo-ai-private-local-ai/id6448019325',
    },
    {
      label: 'Apple Store',
      href: 'https://apps.apple.com/us/app/apollo-ai-private-local-ai/id6448019325',
    },
  ],

  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
};

interface FooterSectionProps {
  title: string;
  links: LinkType[];
}

// Reusable components
const FooterSection = ({ title, links }: FooterSectionProps) => (
  <div className="lg:col-span-1">
    <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4 font-jetbrains">
      {title}
    </h3>
    <ul className="space-y-1">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="text-sm text-black hover:text-slate-900 transition-colors inline-flex items-center gap-1"
            {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
          >
            {link.label}
            {link.external && <ArrowUpRightIcon className="w-3 h-3" />}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

interface AppStoreButtonProps {
  store: LinkType;
}

const AppStoreButton = ({ store }: AppStoreButtonProps) => (
  <Link
    href={store.href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
  >
    <div className="text-left">
      <div className="text-sm font-semibold flex items-center gap-1">
        {store.label}
        <ArrowUpRightIcon className="w-4 h-4" />
      </div>
    </div>
  </Link>
);

export default function Footer() {
  return (
    <footer className="bg-white mt-38">
      <Container>
        <div className="py-8">
          {/* Main footer content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Logo and brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="text-2xl font-bold text-slate-900">
                Leap
              </Link>
            </div>

            {/* Explore and Company sections */}
            <FooterSection title="EXPLORE" links={footerData.explore} />
            <FooterSection title="COMPANY" links={footerData.company} />

            {/* App download section */}
            <div className="lg:col-span-2">
              <h3 className="text-sm text-slate-600 mb-1 ">Vibe check our models with Apollo:</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                {footerData.appStores.map((store) => (
                  <AppStoreButton key={store.label} store={store} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-6 pt-3 border-t border-slate-200">
            <div className="flex flex-col justify-between text-sm text-slate-500 sm:flex-row sm:items-center">
              <div className="flex gap-x-6">
                {footerData.legal.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="hover:text-slate-900 transition-colors"
                    aria-label={link.label.toLowerCase()}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <p className="mt-4 sm:mt-0">
                © {new Date().getFullYear()}, Liquid AI, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
