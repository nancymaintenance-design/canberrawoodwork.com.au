import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('static hosting receives a branded, non-indexable root 404 document', () => {
  assert.ok(existsSync('dist/404.html'), 'static hosts require 404.html at the output root');
  const html = readFileSync('dist/404.html', 'utf8');
  assert.match(html, /<h1>Page not found<\/h1>/);
  assert.match(html, /<meta name="robots" content="noindex(?:,\s*follow)?">/);
  for (const href of ['/', '/services/', '/news/']) assert.ok(html.includes(`href="${href}"`));
  assert.doesNotMatch(readFileSync('dist/sitemap.xml', 'utf8'), /\/404(?:\/|\.html)/);
  assert.match(readFileSync('dist/404/index.html', 'utf8'), /name="robots" content="noindex/);
});

test('only the exact root index alias gains a permanent path redirect', () => {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const pathRules = config.redirects.filter(rule => !rule.has);
  assert.deepEqual(pathRules, [{ source: '/index.html', destination: '/', permanent: true }]);
  assert.ok(!config.rewrites?.length, 'unknown routes must not become catch-all 200 responses');
  // Exact source cannot match canonical /, an API route, an asset or a missing path.
  for (const path of ['/', '/api/contact', '/assets/site.css', '/missing-page', '/news/index.html']) {
    assert.ok(!pathRules.some(rule => rule.source === path));
  }
});
