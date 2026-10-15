import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { articles } from '../src/content.mjs';

const origin = 'https://www.canberrawoodwork.com.au';
const read = route => readFileSync(`dist${route}index.html`, 'utf8');
const blocks = html => [...html.matchAll(/<script id="llm-knowledge-feed" type="application\/json">([\s\S]*?)<\/script>/g)];
const aggregate = () => {
  assert.ok(existsSync('dist/feeds/llm-knowledge.json'), 'build publishes the aggregate JSON Feed');
  return JSON.parse(readFileSync('dist/feeds/llm-knowledge.json', 'utf8'));
};
const moduleUnderTest = async () => {
  assert.ok(existsSync('src/knowledge-feed.mjs'), 'focused feed generator exists');
  return import('../src/knowledge-feed.mjs');
};
const plain = html => html.replace(/<(script|style|nav|aside)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/<[^>]*>/g, ' ').replaceAll('&amp;', '&').replaceAll('&quot;', '"')
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&#39;', "'").replace(/\s+/g, ' ').trim();

// Catch missing articles, unstable IDs and accidentally publishing all articles in every page.
test('aggregate has seventeen canonical items and each article embeds only its identical current item', () => {
  const feed = aggregate();
  assert.equal(feed.version, 'https://jsonfeed.org/version/1.1');
  assert.equal(feed.language, 'en-AU');
  assert.equal(feed.feed_url, `${origin}/feeds/llm-knowledge.json`);
  assert.equal(feed.items.length, 17);
  assert.equal(new Set(feed.items.map(item => item.id)).size, 17);
  for (const article of articles) {
    const route = `/news/${article.slug}/`, html = read(route), matches = blocks(html);
    assert.equal(matches.length, 1, `${route}: one JSON data block`);
    assert.ok(html.indexOf(matches[0][0]) > html.indexOf('</main>'), 'data stays outside the reading content');
    const embedded = JSON.parse(matches[0][1]);
    assert.equal(embedded.items.length, 1);
    const item = feed.items.find(item => item.id === origin + route);
    assert.ok(item, route);
    assert.equal(item.url, item.id);
    assert.deepEqual(embedded.items[0], item);
    assert.deepEqual(embedded._business, feed._business);
  }
});

// Catch stale raw article sections, extra boilerplate or a summary from another page.
test('each item agrees with the final visible title, lead, enhanced prose, image and byline', () => {
  for (const item of aggregate().items) {
    const html = read(new URL(item.url).pathname);
    const prose = html.match(/<div class="article-prose">([\s\S]*?)<\/div><aside/)[1];
    const hero = html.match(/<header class="article-hero shell">([\s\S]*?)<\/header>/)[1];
    assert.equal(item.title, plain(hero.match(/<h1>(.*?)<\/h1>/s)[1]));
    assert.equal(item.summary, plain(hero.match(/<\/h1><p>(.*?)<\/p>/s)[1]));
    assert.equal(item.content_text, plain(prose), item.url);
    assert.equal(item.image, origin + prose.match(/<img\b[^>]*\bsrc="([^"]+)"/)[1]);
    assert.deepEqual(item.authors, [{name: 'Ellis Services Group', url: origin + '/about/'}]);
    assert.equal(item.date_modified, '2026-10-15T00:00:00Z');
    assert.equal(item.date_published.slice(0, 10), articles.find(a => item.url.endsWith(`/news/${a.slug}/`)).published);
    assert.doesNotMatch(item.content_text, /On this page|Arrange your on-site assessment\./);
  }
  const composite = aggregate().items.find(item => item.url.includes('timber-vs-composite'));
  assert.match(composite.content_text, /At Mitchell in August 2025/);
  assert.ok(composite._related.projects.some(link => link.url === origin + '/projects/mitchell-composite-deck/'));
  assert.ok(composite._related.services.some(link => link.url === origin + '/services/composite-decking/'));
});

test('discovery occurs once in article heads while home, FAQ and news index have no embedded item', () => {
  for (const article of articles) {
    const html = read(`/news/${article.slug}/`), head = html.split('</head>')[0];
    assert.equal((head.match(/<link rel="alternate" type="application\/feed\+json" title="Canberra Woodwork knowledge feed" href="\/feeds\/llm-knowledge.json">/g) || []).length, 1);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
    for (const type of ['Article', 'BreadcrumbList', 'WebSite', 'HomeAndConstructionBusiness']) assert.ok(schemas.some(s => s['@type'] === type));
    assert.ok(!schemas.some(s => s['@type'] === 'FAQPage'));
  }
  for (const route of ['/', '/faq/', '/news/']) assert.equal(blocks(read(route)).length, 0);
});

test('public context and related links are drawn from visible pages without template facts', () => {
  const feed = aggregate();
  assert.equal(feed._business.name, 'Ellis Services Group');
  assert.equal(feed._business.about_url, origin + '/about/');
  assert.ok(plain(read('/about/')).includes(feed._business.description));
  assert.doesNotMatch(JSON.stringify(feed), /yourcompany|Adelaide|Perth|7x24|24x7|40%|industry certifications|品牌核心|核心优势/i);
  for (const item of feed.items) for (const kind of ['services', 'projects']) {
    for (const link of item._related[kind]) {
      assert.ok(existsSync(`dist${new URL(link.url).pathname}index.html`), link.url);
      assert.ok(read(new URL(item.url).pathname).includes(`href="${new URL(link.url).pathname}"`));
    }
  }
});

const fixturePages = () => new Map([
  ['/about/', '<html><head><link rel="canonical" href="https://example.com/about/"></head><body><main><h1>About</h1><p>Local timber work &amp; repairs.</p></main></body></html>'],
  ['/services/doors/', '<html></html>'],
  ['/projects/door/', '<html></html>'],
  ['/news/door/', '<html><head><link rel="canonical" href="https://example.com/news/door/"><script type="application/ld+json">{"@type":"Article","headline":"Preserve"}</script></head><body><main><article><header class="article-hero"><h1>Door &amp; frame</h1><p>Visible &lt;/script&gt;&lt;script&gt;bad()&lt;/script&gt; summary.</p><div class="article-byline">By <a href="/about/">Local Team</a><time datetime="2026-10-14">14 October 2026</time></div></header><div class="article-prose"><nav>Navigation poison</nav><p>Final &#x1F6AA; &nbsp; &ldquo;timber&rdquo; &#8217; &copy; &amp;lt; &#0; &#xD800; text.</p><div><p>Nested final paragraph.  </p></div><script>Script poison</script><style>Style poison</style><aside>Aside poison</aside><p hidden>Hidden poison</p><span aria-hidden="true">Decorative poison</span><p><a href="/services/doors/">Door &amp; frame repairs</a> <a href="/projects/door/">Recorded door work</a><a href="https://elsewhere.example/services/unverified/">External</a></p></div><aside>Quote poison</aside></article></main><footer>Footer poison</footer></body></html>'],
]);

// Catch entity corruption, nested-div truncation and executable script-closing injection.
test('final HTML extraction decodes entities once, strips boilerplate and serializes script-safe Unicode JSON', async () => {
  const { buildKnowledgeFeeds } = await moduleUnderTest();
  const { feed, pages } = buildKnowledgeFeeds(fixturePages(), {name: 'Local Team\u2028\u2029'});
  const item = feed.items[0], html = pages.get('/news/door/');
  assert.equal(item.title, 'Door & frame');
  assert.equal(item.summary, 'Visible </script><script>bad()</script> summary.');
  assert.equal(item.content_text, 'Final 🚪 “timber” ’ © &lt; � � text. Nested final paragraph. Door & frame repairs Recorded door work External');
  assert.doesNotMatch(item.content_text, /poison/);
  assert.equal(blocks(html).length, 1);
  assert.deepEqual(JSON.parse(blocks(html)[0][1]).items, feed.items);
  assert.equal(JSON.parse(blocks(html)[0][1])._business.name, 'Local Team\u2028\u2029');
  assert.doesNotMatch(blocks(html)[0][1], /<|\u2028|\u2029/);
  assert.ok(html.includes('<script type="application/ld+json">{"@type":"Article","headline":"Preserve"}</script>'));
  assert.deepEqual(item._related, {services:[{title:'Door & frame repairs',url:'https://example.com/services/doors/'}],projects:[{title:'Recorded door work',url:'https://example.com/projects/door/'}]});
  assert.equal(html.replace(blocks(html)[0][0], '').replace(/<link rel="alternate"[^>]*>/, ''), fixturePages().get('/news/door/'), 'visible page and existing schemas are byte-for-byte preserved');
});

// Catch build-time timestamps, duplicate data blocks and accidental reliance on stale input objects.
test('generation is deterministic, idempotent and uses the supplied final page prose', async () => {
  const { buildKnowledgeFeeds } = await moduleUnderTest();
  const input = fixturePages(), before = new Map(input);
  const first = buildKnowledgeFeeds(input, {name:'Local Team'});
  const second = buildKnowledgeFeeds(input, {name:'Local Team'});
  assert.deepEqual(first, second);
  assert.deepEqual(input, before, 'does not mutate supplied final pages');
  assert.deepEqual(buildKnowledgeFeeds(first.pages, {name:'Local Team'}), first);
  input.set('/news/door/', input.get('/news/door/').replace('Nested final paragraph.', 'New final revision.'));
  assert.match(buildKnowledgeFeeds(input, {name:'Local Team'}).feed.items[0].content_text, /New final revision\./);
  assert.equal(first.feed.items[0].id, second.feed.items[0].id);
});

test('optional absent byline, dates and image do not stop a truthful article feed', async () => {
  const { buildKnowledgeFeeds } = await moduleUnderTest();
  const input = fixturePages();
  input.set('/news/door/', input.get('/news/door/').replace(/<div class="article-byline">[\s\S]*?<\/div>/, ''));
  const item = buildKnowledgeFeeds(input, {name:'Local Team'}).feed.items[0];
  assert.ok(item.content_text.includes('Nested final paragraph.'));
  for (const key of ['authors','date_published','date_modified','image']) assert.ok(!(key in item), key);
});
