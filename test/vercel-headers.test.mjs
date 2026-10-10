import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

test('security policy preserves the canonical redirect and contact function settings', () => {
  assert.deepEqual(config.redirects, [{
    source: '/:path*',
    has: [{ type: 'host', value: 'canberrawoodwork.com.au' }],
    destination: 'https://www.canberrawoodwork.com.au/:path*',
    permanent: true,
  }]);
  assert.deepEqual(config.functions, { 'api/contact.js': { maxDuration: 10 } });
});

test('all static paths receive MIME, referrer, permissions and frame protection', () => {
  const rule = config.headers?.find(item => item.source === '/(.*)');
  assert.ok(rule, 'a catch-all security header rule must cover static HTML and assets');
  const headers = new Map(rule.headers.map(({ key, value }) => [key.toLowerCase(), value]));
  assert.equal(headers.get('x-content-type-options'), 'nosniff');
  assert.equal(headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.equal(headers.get('x-frame-options'), 'DENY');
  const permissions = headers.get('permissions-policy');
  assert.ok(permissions, 'browser capabilities must be restricted');
  for (const capability of ['camera', 'microphone', 'geolocation', 'payment', 'usb']) {
    assert.match(permissions, new RegExp(`(?:^|,\\s*)${capability}=\\(\\)(?:,|$)`));
  }
});

test('mutable assets require revalidation and cannot use immutable caching', () => {
  const rule = config.headers?.find(item => item.source === '/assets/:path*');
  assert.ok(rule, 'assets need an explicit cache policy');
  const cache = rule.headers.find(item => item.key.toLowerCase() === 'cache-control')?.value;
  assert.ok(cache, 'assets need Cache-Control');
  assert.doesNotMatch(cache, /immutable/i);
  assert.match(cache, /(?:^|,\s*)max-age=0(?:,|$)/);
  assert.match(cache, /(?:^|,\s*)must-revalidate(?:,|$)/);
  assert.doesNotMatch(cache, /(?:s-maxage|stale-while-revalidate)\s*=\s*[1-9]/i);
});

test('this phase does not enforce a Content-Security-Policy', () => {
  for (const rule of config.headers ?? []) {
    assert.ok(!rule.headers.some(item => item.key.toLowerCase() === 'content-security-policy'));
  }
});
