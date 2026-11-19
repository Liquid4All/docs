import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { supplement } from './supplementOpenApi.mjs';

const spec = JSON.parse(fs.readFileSync('api/openapi.json', 'utf8'));
test('schema supplements are idempotent and the checked-in export is current', () => {
  assert.deepEqual(supplement(structuredClone(spec)), spec);
});

test('every local schema reference resolves', () => {
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (value.$ref?.startsWith('#/')) {
      const target = value.$ref.slice(2).split('/').reduce((node, key) => node?.[key.replaceAll('~1', '/').replaceAll('~0', '~')], spec);
      assert.ok(target, value.$ref);
    }
    Object.values(value).forEach(visit);
  }
  visit(spec);
});

test('request and response examples retain complete object and list schemas', () => {
  for (const operations of Object.values(spec.paths)) {
    for (const operation of Object.values(operations)) {
      for (const response of Object.values(operation.responses ?? {})) {
        const json = response.content?.['application/json'];
        if (json?.example && json.schema?.properties?.data) {
          assert.ok(json.schema.properties.data.items.$ref);
        }
      }
    }
  }
  const content = spec.paths['/openai/v1/files/{id}/content'].get.responses;
  assert.ok(content['302'].headers.Location);
  assert.equal(content['200'], undefined);
});
