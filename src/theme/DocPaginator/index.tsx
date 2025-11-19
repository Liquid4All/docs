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

    // Flatten sidebar to get all items in order
    const flattenSidebar = (items: any[]): any[] => {
      const result: any[] = [];
      const seenIds = new Set<string>();

      const processItem = (item: any) => {
        if (item.type === 'doc') {
          const itemId = typeof item === 'string' ? item : item.id;
          if (itemId && !seenIds.has(itemId)) {
            seenIds.add(itemId);
            result.push(typeof item === 'string' ? { id: item, type: 'doc' } : item);
          }
        } else if (item.type === 'category') {
          const categoryLinkId = item.link?.type === 'doc' ? item.link.id : null;
          if (categoryLinkId && !seenIds.has(categoryLinkId)) {
            seenIds.add(categoryLinkId);
            result.push({ ...item.link, id: categoryLinkId, type: 'doc' });
          }
          if (item.items) {
            item.items.forEach((subItem: any) => {
              const subItemId = typeof subItem === 'string' ? subItem : subItem.id;
              if (subItemId && subItemId !== categoryLinkId && !seenIds.has(subItemId)) {
                seenIds.add(subItemId);
                processItem(subItem);
              }
            });
          }
        }
      };

      items.forEach(processItem);
      return result;
    };

    const flatItems = flattenSidebar(sidebar.items || []);
    const pluginId = (sidebar as { pluginId?: string }).pluginId || 'lfm';
    const basePath = `/${pluginId}`;

    // Helper to get full permalink
    const getFullPermalink = (item: any): string | null => {
      if (item.permalink) return item.permalink;
      if (item.href) return item.href;
      if (item.id) {
        const idPath = item.id.startsWith('/') ? item.id : `/${item.id}`;
        return `${basePath}${idPath}`;
      }
      return null;
    };

    // Find current page index
    let currentIndex = -1;
    for (let i = 0; i < flatItems.length; i++) {
      const itemPath = getFullPermalink(flatItems[i]);
      if (itemPath && normalizePath(itemPath) === normalizedCurrentPath) {
        currentIndex = i;
        break;
      }
      if (currentDocId && flatItems[i].id === currentDocId) {
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
      if (needsNextFix) {
        for (let i = currentIndex + 1; i < flatItems.length; i++) {
          const item = flatItems[i];
          const itemPath = getFullPermalink(item);
          if (itemPath && !isCurrentPage(item)) {
            fixedNext = {
              title: getItemTitle(item),
              permalink: itemPath,
            };
            break;
          }
        }
      }

      if (needsPreviousFix) {
        for (let i = currentIndex - 1; i >= 0; i--) {
          const item = flatItems[i];
          const itemPath = getFullPermalink(item);
          if (itemPath && !isCurrentPage(item)) {
            fixedPrevious = {
              title: getItemTitle(item),
              permalink: itemPath,
            };
            break;
          }
        }
      }
    }

    return { previous: fixedPrevious, next: fixedNext };
  }, [previous, next, currentPath, sidebar, currentDoc]);

  return (
    <DocPaginator {...restProps} previous={fixedPagination.previous} next={fixedPagination.next} />
  );
}
