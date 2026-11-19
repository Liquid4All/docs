import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { unexpectedPages } from './checkPublishedContent.mjs';

test('the previous exclusions expose the validation report', () => {
  assert.deepEqual(unexpectedPages([
    'scripts/validation/lfm3-modernization.md',
  ], 'MODEL-MATRIX.md\nDESIGN.md\nCLAUDE.md\nINTERACTIVE_QUICKSTART_WIDGET.md'), [
    'scripts/validation/lfm3-modernization.md',
  ]);
});

test('current exclusions cover repository maintenance files without excluding model docs', () => {
  const patterns = readFileSync(new URL('../.mintignore', import.meta.url), 'utf8');
  assert.deepEqual(unexpectedPages([
    'scripts/validation/lfm3-modernization.md',
    'scripts/validation/future-report.mdx',
    'util/testing-notes.md',
    'bin/migration-notes.md',
    'MODEL-MATRIX.md',
    'AGENTS.md',
    'README.md',
    'notebooks/README.md',
    'lfm/models/lfm2-1.2b.mdx',
    'deployment/tools/model-bundling/reference.mdx',
    'snippets/quickstart/text-llamacpp.mdx',
  ], patterns), []);
});

test('a new planning directory fails instead of silently publishing', () => {
  assert.deepEqual(unexpectedPages(['planning/next-release.md'], ''), [
    'planning/next-release.md',
  ]);
});

test('negating an exclusion exposes the internal page again', () => {
  assert.deepEqual(unexpectedPages(['notes/review.md'], 'notes/*.md\n!notes/review.md'), [
    'notes/review.md',
  ]);
});
