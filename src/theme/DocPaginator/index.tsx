import { useDoc, useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
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

  // Use useDocsSidebar instead of useCurrentSidebarSiblings - it's more SSG-friendly
  // It returns null during SSG when sidebar context isn't available
  const sidebar = useDocsSidebar();

  // @ts-expect-error - previous and next are provided by Docusaurus but not in type definition
  const { previous, next, ...restProps } = props;

  // Simple fix: if next/previous point to current page, find the actual next/previous from siblings
  const fixedPagination = useMemo(() => {
    // If sidebar is not available (e.g., during SSG), just return original pagination
    if (!sidebar) {
      return { previous, next };
    }

    const normalizePath = (path: string): string => {
      return path.replace(/\/$/, '').toLowerCase();
    };

    const normalizedCurrentPath = normalizePath(currentPath);
    // @ts-expect-error - id property exists on DocContextValue but not in type definition
    const currentDocId = currentDoc?.id;


    // Flatten sidebar to get all items in order
    const flattenSidebar = (items: any[]): any[] => {
      const result: any[] = [];
      const seenPermalinks = new Set<string>();

      const processItem = (item: any) => {
        if (item.type === 'link') {
          // Skip external links
          return;
        }

        if (item.type === 'doc' || item.type === 'ref') {
          // Doc items should have permalink - add them if not seen
          if (item.permalink && !seenPermalinks.has(item.permalink)) {
            seenPermalinks.add(item.permalink);
            result.push(item);
          }
        } else if (item.type === 'category') {
          // If category has a linked doc, add it first
          if (item.link && item.link.type === 'doc' && item.link.permalink) {
            if (!seenPermalinks.has(item.link.permalink)) {
              seenPermalinks.add(item.link.permalink);
              result.push(item.link);
            }
          }
          // Then process all items in the category
          if (item.items && Array.isArray(item.items)) {
            item.items.forEach((subItem: any) => processItem(subItem));
          }
        }
      };

      items.forEach(processItem);
      return result;
    };

    const flatItems = flattenSidebar(sidebar.items || []);

    // Find current page index
    let currentIndex = -1;
    for (let i = 0; i < flatItems.length; i++) {
      const item = flatItems[i];
      if (item.permalink && normalizePath(item.permalink) === normalizedCurrentPath) {
        currentIndex = i;
        break;
      }
    }

    // Helper to get title
    const getItemTitle = (item: any): string => {
      return item.title || item.label || item.id?.split('/').pop() || 'Untitled';
    };

    let fixedNext = next;
    let fixedPrevious = previous;

    // Check if we need to fix next (missing, undefined, or pointing to current page)
    const needsNextFix =
      !next ||
      (next &&
        (normalizePath(next.permalink) === normalizedCurrentPath ||
          (currentDocId && next.permalink?.includes(currentDocId))));

    // Check if we need to fix previous (missing, undefined, or pointing to current page)
    const needsPreviousFix =
      !previous ||
      (previous &&
        (normalizePath(previous.permalink) === normalizedCurrentPath ||
          (currentDocId && previous.permalink?.includes(currentDocId))));

    // Find actual next/previous from flattened sidebar
    if (currentIndex !== -1) {
      if (needsNextFix && currentIndex + 1 < flatItems.length) {
        const nextItem = flatItems[currentIndex + 1];
        if (nextItem.permalink) {
          fixedNext = {
            title: getItemTitle(nextItem),
            permalink: nextItem.permalink,
          };
        }
      }

      if (needsPreviousFix && currentIndex > 0) {
        const prevItem = flatItems[currentIndex - 1];
        if (prevItem.permalink) {
          fixedPrevious = {
            title: getItemTitle(prevItem),
            permalink: prevItem.permalink,
          };
        }
      }
    }

    return { previous: fixedPrevious, next: fixedNext };
  }, [previous, next, currentPath, sidebar, currentDoc]);

  return (
    <DocPaginator {...restProps} previous={fixedPagination.previous} next={fixedPagination.next} />
  );
}
