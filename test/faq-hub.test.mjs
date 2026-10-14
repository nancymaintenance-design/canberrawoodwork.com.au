import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync('dist/faq/index.html', 'utf8');
const map = JSON.parse(readFileSync('src/keyword-map.json', 'utf8'));

test('FAQ hub renders an answer and unique address for every intent and scenario row', () => {
  // Losing a row during editorial merging must fail, even if the hub still looks populated.
  const disclosures = [...html.matchAll(/<details class="faq-item" id="([^"]+)" data-keyword-ids="([^"]*)">([\s\S]*?)<\/details>/g)];
  const covered = disclosures.flatMap(match => match[2].split(' ').filter(Boolean));
  for (const row of [...map.categories.intent, ...map.categories.scenario]) {
    assert.equal(covered.filter(id => id === row.id).length, 1, `${row.id}: exactly one answered disclosure`);
  }
  assert.equal(new Set(disclosures.map(match => match[1])).size, disclosures.length, 'unique deep links');
  assert.ok(disclosures.every(match => /<summary>.+<\/summary>/.test(match[3]) && /<p>.{80,}<\/p>/.test(match[3])), 'real questions and substantive answers');
});

test('FAQ topic anchors point to six headed groups with truthful question counts', () => {
  const nav = html.match(/<nav class="faq-topic-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1] || '';
  const links = [...nav.matchAll(/href="#([^"]+)"[^>]*>.*?<span class="faq-topic-count">(\d+)<\/span>/g)];
  assert.equal(links.length, 6, 'fixed major groups, not owner-page tiles');
  for (const link of links) {
    const group = html.match(new RegExp(`<section id="${link[1]}" class="faq-group"[^>]*>([\\s\\S]*?)</section>`))?.[1];
    assert.ok(/<h2\b/.test(group || ''), `${link[1]}: headed anchor destination`);
    assert.equal((group.match(/<details /g) || []).length, Number(link[2]), `${link[1]}: count matches questions`);
  }
  assert.ok(!html.includes('faq-service-directory'), 'full answers replace service-only hub directory');
  assert.ok(html.includes('/assets/faq-hub.css') && html.includes('/assets/faq-hub.js'), 'route loads navigation enhancement');
  assert.ok(!html.includes('"@type":"FAQPage"'), 'no FAQ rich-result claim');
});

test('latest supplied locksmith comparison wording survives keyword reconciliation', () => {
  assert.equal(map.categories.intent.find(row => row.id === 'CBR-C-165').term, 'Do I need a carpenter or a locksmith for a door that will not latch?');
  assert.equal(map.categories.scenario.find(row => row.id === 'CBR-C-254').term, 'My timber door closes but the latch misses the strike plate. Should I call a carpenter or a locksmith?');
});
