import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);

test('built site provides a root favicon while retaining its existing page icon', () => {
  const favicon = new URL('favicon.ico', dist);
  assert.ok(existsSync(favicon), 'dist/favicon.ico exists');
  assert.ok(statSync(favicon).size > 0, 'dist/favicon.ico is not empty');
  assert.ok(existsSync(new URL('assets/ellis-services-logo.png', dist)), 'existing logo asset exists');
  assert.match(readFileSync(new URL('index.html', dist), 'utf8'), /<link rel="icon" href="\/assets\/ellis-services-logo\.png">/);
});
