'use client';

import { IconChevronDown } from '@tabler/icons-react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { NavNode } from './extractDocNavItems';

interface DocNavItemProps {
  items: NavNode[];
  openGroups: Record<string, boolean>;
  toggleGroup: (key: string) => void;
  closeMobileMenu: () => void;
  isTopLevel?: boolean;
}

export const DocNavItem: FC<DocNavItemProps> = ({
  items,
  openGroups,
  toggleGroup,
  closeMobileMenu,
  isTopLevel = true,
}) => {
  return (
    <>
      {items.map((item, index) => {
        const hasChildren = !!item.children?.length;
        const open = !!openGroups[item.href];

        // Create a unique key using href and index as fallback
        const uniqueKey = `item-${index}`;

        // If this is the top level, skip the root item and only show its children
        if (isTopLevel && hasChildren) {
          return (
            <div key={uniqueKey}>
              <DocNavItem
                items={item.children!}
                openGroups={openGroups}
                toggleGroup={toggleGroup}
                closeMobileMenu={closeMobileMenu}
                isTopLevel={false}
              />
            </div>
          );
        }

        // For non-top-level items, show normal behavior
        return (
          <div key={uniqueKey}>
            {hasChildren ? (
              // PARENT: toggle only (no link)
              <Button
                variant="link"
                key={item.href}
                className="flex w-full items-center justify-between px-2 py-2 h-auto text-left text-sm font-normal"
                onClick={() => toggleGroup(item.href)}
                aria-expanded={open}
              >
                <span>{item.title}</span>
                <IconChevronDown
                  className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
                />
              </Button>
            ) : (
              // LEAF: regular link
              <Button
                key={item.href}
                href={item.href}
                variant="link"
                className="w-full text-left justify-start px-0 py-2 h-auto text-sm font-normal"
                size="sm"
                onClick={closeMobileMenu}
              >
                {item.title}
              </Button>
            )}

            {/* Children */}
            {hasChildren && open && (
              <div className="ml-4 border-l border-gray-200 dark:border-gray-600 pl-2">
                <DocNavItem
                  items={item.children!}
                  openGroups={openGroups}
                  toggleGroup={toggleGroup}
                  closeMobileMenu={closeMobileMenu}
                  isTopLevel={false}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
