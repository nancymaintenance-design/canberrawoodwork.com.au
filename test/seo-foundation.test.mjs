import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

// scripts/test.mjs owns the build; individual tests only inspect its output.
const dist = new URL('../dist/', import.meta.url);
const canonicalOrigin = 'https://www.canberrawoodwork.com.au';
const businessId = `${canonicalOrigin}/#business`;
const websiteId = `${canonicalOrigin}/#website`;
const routes = ['/', '/services/deck-repairs/', '/news/repair-or-rebuild-a-deck/', '/faq/', '/about/', '/contact/'];
const pages = new Map(routes.map(route => {
  const html = readFileSync(new URL(`.${route}index.html`, dist), 'utf8');
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1]));
  return [route, { html, schemas }];
}));

for (const [route, { schemas }] of pages) {
  test(`${route}: identifies the canonical business once`, () => {
    const businesses = schemas.filter(schema => schema['@type'] === 'ProfessionalService');
    assert.equal(businesses.length, 1);
    assert.equal(businesses[0]['@id'], businessId);
  });
}

test('page schemas identify the website and appropriate page types', () => {
  for (const [route, { schemas }] of pages) {
    const website = schemas.find(schema => schema['@type'] === 'WebSite');
    assert.ok(website, `${route}: WebSite exists`);
    assert.equal(website['@id'], websiteId);
    assert.deepEqual(website.publisher, { '@id': businessId });
    const expectedType = route === '/about/' ? 'AboutPage' : route === '/contact/' ? 'ContactPage' : 'WebPage';
    const page = schemas.find(schema => schema['@type'] === expectedType);
    assert.ok(page, `${route}: ${expectedType} exists`);
    assert.equal(page.url, canonicalOrigin + route);
    assert.equal(page['@id'], `${canonicalOrigin}${route}#webpage`);
    assert.deepEqual(page.isPartOf, { '@id': websiteId });
  }
});

test('service provider and article publisher resolve to the canonical business', () => {
  const serviceSchemas = pages.get('/services/deck-repairs/').schemas;
  const service = serviceSchemas.find(schema => schema['@type'] === 'Service');
  assert.ok(service, 'Service schema is retained');
  assert.deepEqual(service.provider, { '@id': businessId });
  assert.ok(serviceSchemas.some(schema => schema['@type'] === 'BreadcrumbList'), 'service breadcrumbs remain');
  const articleSchemas = pages.get('/news/repair-or-rebuild-a-deck/').schemas;
  const article = articleSchemas.find(schema => schema['@type'] === 'Article');
  assert.ok(article, 'Article schema is retained');
  assert.deepEqual(article.publisher, { '@id': businessId });
  assert.ok(articleSchemas.some(schema => schema['@type'] === 'BreadcrumbList'), 'article breadcrumbs remain');
  for (const image of [article.image].flat().filter(Boolean)) {
    const imageUrl = new URL(typeof image === 'string' ? image : image.url);
    assert.equal(imageUrl.origin, canonicalOrigin);
    assert.ok(existsSync(new URL(`.${imageUrl.pathname}`, dist)), 'article image is an existing published asset');
  }
});

test('FAQ schema is absent while visible FAQ details remain', () => {
  for (const [route, { schemas }] of pages) {
    assert.ok(schemas.every(schema => schema['@type'] !== 'FAQPage'), `${route}: no FAQPage JSON-LD`);
  }
  assert.equal([...pages.get('/faq/').html.matchAll(/<details class="faq-item">/g)].length, 9, 'all consolidated general FAQs remain visible');
  for (const route of ['/services/deck-repairs/', '/news/repair-or-rebuild-a-deck/']) {
    assert.match(pages.get(route).html, /<details class="faq-item"><summary>[^<]+<\/summary><p>[^<]+<\/p>/, `${route}: questions and answers remain visible`);
  }
});

test('AI discovery document provides dated canonical Markdown links', () => {
  const text = readFileSync(new URL('llms.txt', dist), 'utf8');
  assert.doesNotMatch(text, /127\.0\.0\.1/);
  assert.match(text, /^Last updated: \d{4}-\d{2}-\d{2}$/m);
  assert.ok(text.includes('0405 878 406'), 'published business phone is retained');
  assert.ok(text.includes('brian@elliservices.com.au'), 'published business email is retained');
  const links = [...text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)];
  const urls = new Set(links.map(match => match[2]));
  for (const route of ['/', '/services/', '/about/', '/contact/']) {
    assert.ok(urls.has(canonicalOrigin + route), `${route}: canonical Markdown link exists`);
  }
  for (const [, label, url] of links) {
    assert.ok(label.trim(), 'links have meaningful labels');
    assert.equal(new URL(url).origin, canonicalOrigin, 'discovery links use the production origin');
    assert.ok(existsSync(new URL(`.${new URL(url).pathname}index.html`, dist)), 'discovery links resolve to generated routes');
  }
});
