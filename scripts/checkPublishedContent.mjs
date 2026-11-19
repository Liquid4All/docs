import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDirectories = new Set([
  'api', 'deployment', 'examples', 'guides', 'leap', 'lfm', 'snippets',
]);
const defaultIgnores = [
  '.git/', '.github/', '.claude/', '.agents/', '.idea/', '.vscode/',
  '.cursor/', '.mintlify/', 'node_modules/',
  'README.md', 'LICENSE.md', 'CHANGELOG.md', 'CONTRIBUTING.md',
];

export function unexpectedPages(paths, mintignore) {
  const markdown = paths.filter((path) => /\.mdx?$/i.test(path));
  if (!markdown.length) return [];

  // Use Git's pattern parser so directory rules and negations match .mintignore.
  const directory = mkdtempSync(resolve(tmpdir(), 'docs-publication-'));
  try {
    execFileSync('git', ['init', '--quiet', directory]);
    writeFileSync(resolve(directory, '.gitignore'),
      `${defaultIgnores.join('\n')}\n${mintignore}\n`);
    const result = spawnSync('git', [
      '-C', directory, 'check-ignore', '--no-index', '-z', '--stdin',
    ], { input: `${markdown.join('\0')}\0`, encoding: 'utf8' });
    if (result.error) throw result.error;
    if (![0, 1].includes(result.status)) {
      throw new Error(result.stderr || 'Unable to evaluate publication exclusions');
    }
    const excluded = new Set(result.stdout.split('\0').filter(Boolean));
    return markdown.filter((path) =>
      !excluded.has(path) && !publicDirectories.has(path.split('/')[0]));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const paths = execFileSync('git', ['ls-files', '-z'], {
    cwd: root, encoding: 'utf8',
  }).split('\0').filter(Boolean);
  const unexpected = unexpectedPages(paths, readFileSync(resolve(root, '.mintignore'), 'utf8'));
  if (unexpected.length) {
    console.error('Markdown outside the public documentation directories would be published:');
    for (const path of unexpected) console.error(`  ${path}`);
    console.error('Exclude internal files in .mintignore, or put model/tool docs in a public directory.');
    process.exitCode = 1;
  } else {
    console.log('Publication check passed: no unexpected Markdown pages.');
  }
}
