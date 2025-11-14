import { translate } from '@docusaurus/Translate';
import {
  IconExternalLink as ExternalLinkIcon,
  IconArrowUpRight,
  IconProps,
} from '@tabler/icons-react';
import React, { type ReactNode } from 'react';

// References symbol in docusaurus-theme-classic/src/inlineSvgSprites.ts
// See why: https://github.com/facebook/docusaurus/issues/5865
const svgSprite = '#theme-svg-external-link';

export default function IconExternalLink({
  width = 18,
  height = 18,
  ...props
}: IconProps): ReactNode {
  return (
    <IconArrowUpRight
      width={width}
      height={height}
      aria-label={translate({
        id: 'theme.IconExternalLink.ariaLabel',
        message: '(opens in new tab)',
        description: 'The ARIA label for the external link icon',
      })}
      {...props}
    />
  );
}
