import { ThemeClassNames } from '@docusaurus/theme-common';
import LinkItem from '@theme/Footer/LinkItem';
import type { Props } from '@theme/Footer/Links/MultiColumn';
import clsx from 'clsx';
import React, { type ReactNode } from 'react';

type ColumnType = Props['columns'][number];
type ColumnItemType = ColumnType['items'][number];

function ColumnLinkItem({ item }: { item: ColumnItemType }) {
  return item.html ? (
    <li
      className={clsx('footer__item', item.className)}
      // Developer provided the HTML, so assume it's safe.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: item.html }}
    />
  ) : (
    <li key={item.href ?? item.to} className="footer__item">
      <LinkItem item={item} />
    </li>
  );
}

function Column({ column }: { column: ColumnType }) {
  return (
    <div
      className={clsx(
        ThemeClassNames.layout.footer.column,
        'flex flex-col gap-4',
        column.className
      )}
    >
      <p className="monospace text-(--muted-foreground)">{column.title}</p>
      <ul className="clean-list space-y-1.5">
        {column.items.map((item, i) => (
          <ColumnLinkItem key={i} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default function FooterLinksMultiColumn({ columns }: Props): ReactNode {
  return (
    <div className="flex flex-col sm:flex-row justify-between flex-1 gap-4 sm:gap-12">
      {columns.map((column, i) => (
        <Column key={i} column={column} />
      ))}
    </div>
  );
}
