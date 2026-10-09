import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { priorityServices, priorityGuideDetails } from '../src/priority-service-content.mjs';

const read = route => readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8');
test('five priority services preserve headings, add unique detail and relevant guide links', () => {
  for (const [slug, entry] of Object.entries(priorityServices)) {
    const html = read(`services/${slug}`);
    assert.ok(html.includes(entry.scope.replaceAll('&', '&amp;')));
    assert.ok(html.includes(entry.method.replaceAll('&', '&amp;')));
    assert.ok(html.includes(entry.photos.replaceAll('&', '&amp;')));
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.ok(html.includes('id="service-questions"'));
    for (const [guide] of entry.guides) assert.ok(html.includes(`/news/${guide}/`));
    assert.ok(html.includes('href="/service-areas/"'));
    assert.ok(html.includes(`href="https://www.canberrawoodwork.com.au/services/${slug}/"`));
  }
});
test('general FAQ and homepage design are retained', () => {
  assert.equal((read('faq').match(/<summary>/g) || []).length, 9);
  const home = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.ok(home.includes('hero-orbit orbit-one'));
  assert.ok(home.includes('data-carousel'));
});
test('informational guides retain their service conversion path and add distinct explanations', () => {
  const owners = {
    'fascia-bargeboard-eaves': 'fascia-and-eaves-repairs',
    'loose-timber-stairs': 'timber-stair-and-handrail-repairs',
    'skirting-after-new-flooring': 'skirting-and-architraves',
    'deck-boards-or-frame': 'deck-repairs',
  };
  for (const [slug, copy] of Object.entries(priorityGuideDetails)) {
    const html = read(`news/${slug}`);
    assert.ok(html.includes(copy));
    assert.ok(html.includes(`/services/${owners[slug]}/`));
  }
});
