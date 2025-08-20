export type NavNode = {
  title: string;
  href: string;
  children?: NavNode[];
};

// Converts a page map structure into a hierarchical navigation tree,
// extracting titles from frontmatter for nav item labels
function walk(nodes: any[], baseRoute: string): NavNode[] {
  const result: NavNode[] = [];

  for (const n of nodes) {
    if ('route' in n && n.route && (n.route === baseRoute || n.route.startsWith(baseRoute + '/'))) {
      const title = n.title;

      const node: NavNode = { title, href: n.route };

      if ('children' in n && n.children) {
        const children = walk(n.children, baseRoute);
        if (children.length) {
          node.children = children;
        }
      }

      result.push(node);
    } else if ('children' in n && n.children) {
      // folder without its own route
      const children = walk(n.children, baseRoute);
      result.push(...children);
    }
  }

  return result;
}

export function extractDocNavItems(pageMap: any[], baseRoute = '/docs'): NavNode[] {
  return walk(pageMap, baseRoute);
}
