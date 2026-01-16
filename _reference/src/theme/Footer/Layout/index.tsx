import { ThemeClassNames } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  IconBrandCrunchbase,
  IconBrandDiscordFilled,
  IconBrandLinkedin,
  IconBrandLinkedinFilled,
  IconBrandX,
  IconBrandYoutube,
  IconBrandYoutubeFilled,
  TablerIcon,
} from '@tabler/icons-react';
import type { Props } from '@theme/Footer/Layout';
import clsx from 'clsx';
import React, { type ReactNode } from 'react';

const LOGOS: { icon: TablerIcon; href: string }[] = [
  {
    icon: IconBrandDiscordFilled,
    href: 'https://discord.gg/liquid-ai',
  },
  {
    icon: IconBrandX,
    href: 'https://twitter.com/liquidai_',
  },
  {
    icon: IconBrandCrunchbase,
    href: 'https://crunchbase.com/organization/liquid-ai',
  },
  {
    icon: IconBrandLinkedinFilled,
    href: 'https://www.linkedin.com/company/liquid-ai-inc',
  },
  {
    icon: IconBrandYoutubeFilled,
    href: 'https://www.youtube.com/@liquid-ai-inc',
  },
];

export default function FooterLayout({ style, links, logo, copyright }: Props): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const { customFields, themeConfig } = siteConfig;

  return (
    <footer
      className={clsx(
        ThemeClassNames.layout.footer.container,
        'px-6 sm:px-10 lg:px-16 pt-8 sm:pt-16 pb-8 sm:pb-8',
        {
          'footer--dark': style === 'dark',
        }
      )}
    >
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 border-y pt-6 sm:pt-12 pb-4 sm:pb-8 border-(--border)">
        <div>{logo}</div>
        {links}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row justify-between items-center pt-4 sm:pt-12">
        <p className="text-(--muted-foreground) text-xs py-2">
          {/*@ts-ignore*/}
          {themeConfig.footer.copyright as string}
        </p>
        <div className="flex flex-row gap-3 items-center">
          {LOGOS.map(({ icon: Icon, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="border border-(--border) rounded-full p-2 flex"
              key={href}
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
        <p className="text-(--muted-foreground) text-xs py-2">{customFields.address as string}</p>
      </div>
    </footer>
  );
}
