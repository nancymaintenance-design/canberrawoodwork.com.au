import assert from 'node:assert/strict';

const origin = new URL(process.argv[2] || 'https://www.canberrawoodwork.com.au');
const expected = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
};
let failures = 0;
for (const path of ['/', '/faq/', '/faq', '/services/deck-repairs/', '/contact/', '/robots.txt', '/assets/site.css']) {
  try {
    const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200, `${path}: HTTP status`);
    for (const [name, value] of Object.entries(expected)) {
      assert.equal(response.headers.get(name), value, `${path}: ${name}`);
    }
    await response.body?.cancel();
    console.log(`PASS ${path}`);
  } catch (error) {
    failures++;
    console.error(`FAIL ${path}: ${error.message}`);
  }
}
process.exitCode = failures ? 1 : 0;
