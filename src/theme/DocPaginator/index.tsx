import { useCurrentSidebarSiblings, useDoc } from '@docusaurus/plugin-content-docs/client';
import { useLocation } from '@docusaurus/router';
import type { WrapperProps } from '@docusaurus/types';
import DocPaginator from '@theme-original/DocPaginator';
import type DocPaginatorType from '@theme/DocPaginator';
import React, { type ReactNode, useMemo } from 'react';

type Props = WrapperProps<typeof DocPaginatorType>;

export default function DocPaginatorWrapper(props: Props): ReactNode {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentDoc = useDoc();
  const sidebarSiblings = useCurrentSidebarSiblings();

  const { previous, next, ...restProps } = props;

  // Simple fix: if next/previous point to current page, find the actual next/previous from siblings
  const fixedPagination = useMemo(() => {
    const normalizePath = (path: string): string => {
      return path.replace(/\/$/, '').toLowerCase();
    };

    const normalizedCurrentPath = normalizePath(currentPath);
    const currentDocId = currentDoc?.id;

    // Helper to get permalink from sidebar item
    const getItemPermalink = (item: any): string | null => {
      return item.permalink || item.href || null;
    };

    // Helper to check if item matches current page
    const isCurrentPage = (item: any): boolean => {
      const itemPath = getItemPermalink(item);
      if (itemPath && normalizePath(itemPath) === normalizedCurrentPath) {
        return true;
      }
      if (currentDocId && item.id === currentDocId) {
        return true;
      }
      return false;
    };

    let fixedNext = next;
    let fixedPrevious = previous;

    // If next points to current page, find the actual next from siblings
    if (
      next &&
      (normalizePath(next.permalink) === normalizedCurrentPath ||
        (currentDocId && next.permalink?.includes(currentDocId)))
    ) {
      const currentIndex = sidebarSiblings.findIndex(isCurrentPage);
      if (currentIndex !== -1) {
        // Find next sibling that's not the current page
        for (let i = currentIndex + 1; i < sidebarSiblings.length; i++) {
          const sibling = sidebarSiblings[i];
          if (!isCurrentPage(sibling)) {
            const siblingPath = getItemPermalink(sibling);
            if (siblingPath) {
              fixedNext = {
                title: sibling.label || sibling.title || 'Next',
                permalink: siblingPath,
              };
              break;
            }
          }
        }
        // If still pointing to current page, remove it
        if (fixedNext && isCurrentPage({ permalink: fixedNext.permalink, id: currentDocId })) {
          fixedNext = undefined;
        }
      }
    }

    // If previous points to current page, find the actual previous from siblings
    if (
      previous &&
      (normalizePath(previous.permalink) === normalizedCurrentPath ||
        (currentDocId && previous.permalink?.includes(currentDocId)))
    ) {
      const currentIndex = sidebarSiblings.findIndex(isCurrentPage);
      if (currentIndex !== -1) {
        // Find previous sibling that's not the current page
        for (let i = currentIndex - 1; i >= 0; i--) {
          const sibling = sidebarSiblings[i];
          if (!isCurrentPage(sibling)) {
            const siblingPath = getItemPermalink(sibling);
            if (siblingPath) {
              fixedPrevious = {
                title: sibling.label || sibling.title || 'Previous',
                permalink: siblingPath,
              };
              break;
            }
          }
        }
        // If still pointing to current page, remove it
        if (
          fixedPrevious &&
          isCurrentPage({ permalink: fixedPrevious.permalink, id: currentDocId })
        ) {
          fixedPrevious = undefined;
        }
      }
    }

    return { previous: fixedPrevious, next: fixedNext };
  }, [previous, next, currentPath, sidebarSiblings, currentDoc]);

  return (
    <DocPaginator {...restProps} previous={fixedPagination.previous} next={fixedPagination.next} />
  );
}
