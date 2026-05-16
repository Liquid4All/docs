import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';

const REPO_ROOT = path.resolve(__dirname, '..');
const DOCS_JSON = path.join(REPO_ROOT, 'docs.json');
const SNAPSHOT_FILE = path.join(REPO_ROOT, 'link-snapshot.yaml');

const SNAPSHOT_HEADER = `# Auto-managed by scripts/generateLinkSnapshot.ts.
# \`active\` is append-only — pre-commit adds new URLs but never removes them.
# To intentionally retire a URL without a redirect, move it from \`active\` to
# \`deleted\`. The CI check skips entries listed under \`deleted\`.
#
# Examples of \`deleted\` entries (uncomment and adapt):
#
# deleted:
#   # Minimal form — git history is the canonical record of why this was retired:
#   - /lfm/old/experimental-thing
#   # Or, if you want the reason inline:
#   - url: /lfm/another-old-thing
#     reason: "Page retired in DOC-12; no substitute exists."
`;

const DELETED_EXAMPLE = `  deleted:
    # Minimal form — git history is the canonical record of why this URL was retired:
    - /lfm/old/experimental-thing
    # Or, if you want the reason inline:
    - url: /lfm/another-old-thing
      reason: "Page retired in DOC-12; no substitute exists."`;

// Directories whose .mdx/.md files map to docs URLs. snippets/ is excluded
// because it holds reusable fragments, not pages.
const PAGE_DIRS = ['lfm', 'leap', 'examples', 'deployment'];

interface DocsJson {
  navigation?: { tabs?: NavNode[] };
  redirects?: { source: string; destination: string }[];
}

type NavNode =
  | string
  | {
      tab?: string;
      group?: string;
      root?: string;
      pages?: NavNode[];
      groups?: NavNode[];
      tabs?: NavNode[];
    };

// A deleted entry is either a bare URL string (minimal form — commit history
// is the record of why) or an object with `url` plus optional `reason` /
// `retired_at` fields if the contributor wants the rationale inline.
type DeletedEntry = string | { url: string; reason?: string; retired_at?: string };

function deletedUrl(entry: DeletedEntry): string {
  return typeof entry === 'string' ? entry : entry.url;
}

interface Snapshot {
  active: string[];
  deleted: DeletedEntry[];
}

function loadDocsJson(): DocsJson {
  return JSON.parse(fs.readFileSync(DOCS_JSON, 'utf8'));
}

function* walkPages(node: NavNode): Generator<string> {
  if (typeof node === 'string') {
    yield '/' + node;
    return;
  }
  if (!node || typeof node !== 'object') return;
  if (typeof node.root === 'string') yield '/' + node.root;
  for (const list of [node.pages, node.groups, node.tabs] as (NavNode[] | undefined)[]) {
    if (Array.isArray(list)) {
      for (const child of list) yield* walkPages(child);
    }
  }
}

function navUrls(docs: DocsJson): Set<string> {
  const urls = new Set<string>();
  for (const tab of docs.navigation?.tabs ?? []) {
    for (const url of walkPages(tab)) urls.add(url);
  }
  return urls;
}

function redirectSources(docs: DocsJson): string[] {
  // Skip wildcard sources (e.g. "/docs/models/:slug*") — they're patterns, not
  // URLs that anyone visits directly. They stay in docs.json and still match
  // incoming requests via matchesRedirectSource at check time.
  return (docs.redirects ?? [])
    .map((r) => normalizeUrl(r.source))
    .filter((src) => !src.includes(':'));
}

function normalizeUrl(url: string): string {
  if (!url.startsWith('/')) return '/' + url;
  return url;
}

function diskPageUrls(): Set<string> {
  const urls = new Set<string>();
  for (const dir of PAGE_DIRS) {
    const abs = path.join(REPO_ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    walkDir(abs, (file) => {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        const rel = path.relative(REPO_ROOT, file).replace(/\\/g, '/');
        const noExt = rel.replace(/\.(mdx|md)$/, '');
        urls.add('/' + noExt);
      }
    });
  }
  return urls;
}

function walkDir(dir: string, visit: (file: string) => void): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, visit);
    else visit(full);
  }
}

function loadSnapshot(): Snapshot {
  if (!fs.existsSync(SNAPSHOT_FILE)) return { active: [], deleted: [] };
  const raw = fs.readFileSync(SNAPSHOT_FILE, 'utf8');
  const parsed = YAML.parse(raw) ?? {};
  return {
    active: Array.isArray(parsed.active) ? parsed.active.map(String) : [],
    deleted: Array.isArray(parsed.deleted) ? (parsed.deleted as DeletedEntry[]) : [],
  };
}

function serializeSnapshot(snap: Snapshot): string {
  const body = YAML.stringify(
    {
      active: [...snap.active].sort(),
      deleted: snap.deleted,
    },
    { lineWidth: 0 },
  );
  return SNAPSHOT_HEADER + body;
}

function computeUpdatedSnapshot(docs: DocsJson, prev: Snapshot): Snapshot {
  const fromNav = navUrls(docs);
  const fromRedirects = redirectSources(docs);
  const fromDisk = diskPageUrls();
  const deletedUrls = new Set(prev.deleted.map(deletedUrl));
  // Start from prior active, minus anything the user has since moved to `deleted`.
  const merged = new Set([...prev.active].filter((url) => !deletedUrls.has(url)));
  for (const url of fromNav) if (!deletedUrls.has(url)) merged.add(url);
  for (const url of fromRedirects) if (!deletedUrls.has(url)) merged.add(url);
  for (const url of fromDisk) if (!deletedUrls.has(url)) merged.add(url);
  return {
    active: [...merged].sort(),
    deleted: prev.deleted,
  };
}

// Match a `:slug*`-style wildcard source against a candidate URL.
function matchesRedirectSource(source: string, candidate: string): boolean {
  if (source === candidate) return true;
  const wildcardIdx = source.indexOf(':');
  if (wildcardIdx === -1) return false;
  const prefix = source.slice(0, wildcardIdx);
  return candidate.startsWith(prefix);
}

function resolveDestination(source: string, destination: string, candidate: string): string {
  const wildcardIdx = source.indexOf(':');
  if (wildcardIdx === -1) return destination;
  const prefix = source.slice(0, wildcardIdx);
  const tail = candidate.slice(prefix.length);
  // destination typically ends in `/:slug*`; strip that and append the tail.
  const destWildcardIdx = destination.indexOf(':');
  const destPrefix = destWildcardIdx === -1 ? destination : destination.slice(0, destWildcardIdx);
  return destPrefix + tail;
}

interface ResolveContext {
  navSet: Set<string>;
  diskSet: Set<string>;
  redirects: { source: string; destination: string }[];
}

function urlResolves(url: string, ctx: ResolveContext, visited = new Set<string>(), depth = 0): boolean {
  if (depth > 5) return false;
  if (visited.has(url)) return false;
  visited.add(url);
  if (ctx.navSet.has(url)) return true;
  if (ctx.diskSet.has(url)) return true;
  for (const r of ctx.redirects) {
    const normSource = normalizeUrl(r.source);
    if (matchesRedirectSource(normSource, url)) {
      const dest = normalizeUrl(resolveDestination(normSource, normalizeUrl(r.destination), url));
      if (urlResolves(dest, ctx, visited, depth + 1)) return true;
    }
  }
  return false;
}

function checkContract(docs: DocsJson, snap: Snapshot): { ok: boolean; failures: string[] } {
  const ctx: ResolveContext = {
    navSet: navUrls(docs),
    diskSet: diskPageUrls(),
    redirects: (docs.redirects ?? []).map((r) => ({
      source: normalizeUrl(r.source),
      destination: normalizeUrl(r.destination),
    })),
  };
  const deleted = new Set(snap.deleted.map(deletedUrl));
  const failures: string[] = [];
  for (const url of snap.active) {
    if (deleted.has(url)) continue;
    if (!urlResolves(url, ctx)) failures.push(url);
  }
  return { ok: failures.length === 0, failures };
}

function main(): void {
  const program = new Command();
  program
    .option('--update', 'Append new URLs to link-snapshot.yaml')
    .option('--check', 'Verify snapshot contract; non-zero on failure')
    .parse(process.argv);
  const opts = program.opts<{ update?: boolean; check?: boolean }>();

  if (!opts.update && !opts.check) {
    console.error('Pass --update or --check.');
    process.exit(2);
  }

  const docs = loadDocsJson();
  const prev = loadSnapshot();
  const next = computeUpdatedSnapshot(docs, prev);
  const serialized = serializeSnapshot(next);
  const onDisk = fs.existsSync(SNAPSHOT_FILE) ? fs.readFileSync(SNAPSHOT_FILE, 'utf8') : '';

  if (opts.update) {
    if (serialized !== onDisk) {
      fs.writeFileSync(SNAPSHOT_FILE, serialized);
      console.log(`Updated ${path.relative(REPO_ROOT, SNAPSHOT_FILE)} (${next.active.length} active, ${next.deleted.length} deleted).`);
    } else {
      console.log('Snapshot already up to date.');
    }
    return;
  }

  // --check mode
  const stale = serialized !== onDisk;
  const { ok, failures } = checkContract(docs, prev);

  if (!ok) {
    console.error('Link snapshot contract violation. The following URLs no longer resolve:');
    for (const url of failures) console.error(`  - ${url}`);
    console.error('');
    console.error('Remediation options for each URL:');
    console.error('  1. Add a redirect entry under `redirects` in docs.json pointing to a current page.');
    console.error('  2. Keep the underlying .mdx file on disk but remove it from docs.json navigation');
    console.error('     (the URL stays served but undiscoverable — mark the page as deprecated).');
    console.error('  3. Move the URL from `active` to `deleted` in link-snapshot.yaml. The');
    console.error('     minimal form is just the URL string; add an inline `reason` if you want');
    console.error('     it embedded next to the entry (otherwise the commit history is the');
    console.error('     record). Example:');
    console.error('');
    console.error(DELETED_EXAMPLE);
    process.exit(1);
  }
  if (stale) {
    console.error('link-snapshot.yaml is out of date relative to docs.json + on-disk pages.');
    console.error('Run `npm run snapshot:update` and commit the result.');
    process.exit(1);
  }
  console.log(`Snapshot OK: ${prev.active.length} active URLs verified.`);
}

main();
