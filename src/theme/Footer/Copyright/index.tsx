import type { Props } from '@theme/Footer/Copyright';
import React, { type ReactNode } from 'react';

export default function FooterCopyright({ copyright }: Props): ReactNode {
  return (
    <div
      className="text-xs text-(--muted-foreground) py-2"
      // Developer provided the HTML, so assume it's safe.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: copyright }}
    />
  );
}
