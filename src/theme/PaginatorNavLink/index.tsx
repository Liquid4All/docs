import Link from '@docusaurus/Link';
import type { Props } from '@theme/PaginatorNavLink';
import clsx from 'clsx';
import React, { type ReactNode } from 'react';

export default function PaginatorNavLinkWrapper(props: Props): ReactNode {
  const { permalink, title, subLabel, isNext } = props;

  // title = section name (e.g., "TRL")
  // subLabel = "Next" or "Previous" (we want to hide this)
  // Show only the title with arrow, matching the example format
  const displayText = title || 'Untitled';
  const arrow = isNext ? ' →' : '← ';
  const finalText = isNext ? `${displayText}${arrow}` : `${arrow}${displayText}`;

  return (
    <Link
      className={clsx(
        'pagination-nav__link',
        isNext ? 'pagination-nav__link--next' : 'pagination-nav__link--prev'
      )}
      to={permalink}
    >
      <div className="pagination-nav__sublabel">{finalText}</div>
      {/* Don't render the label div - it would show "Next"/"Previous" */}
    </Link>
  );
}
