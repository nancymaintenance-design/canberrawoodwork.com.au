import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';

const read=route=>readFileSync(`dist${route}index.html`,'utf8');
const newRoutes=['/news/carpentry-quote-cost-factors/','/news/timber-vs-composite-decking-canberra/','/news/timber-deck-maintenance-canberra/'];
const schemas=html=>[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));

// Missing registration must fail at the published output boundary, not via source greps.
test('three decision guides are discoverable canonical pages with independent article history',()=>{
  const sitemap=readFileSync('dist/sitemap.xml','utf8'),news=read('/news/'),discovery=readFileSync('dist/llms.txt','utf8');
  for(const route of newRoutes){
    assert.ok(sitemap.includes(`https://www.canberrawoodwork.com.au${route}`),`${route}: sitemap registration`);
    assert.ok(existsSync(`dist${route}index.html`),`${route}: rendered page`);
    assert.ok(news.includes(`href="${route}"`),`${route}: article directory`);
    assert.ok(discovery.includes(`https://www.canberrawoodwork.com.au${route}`),`${route}: AI discovery document`);
    const html=read(route),article=schemas(html).find(s=>s['@type']==='Article');
    assert.equal(article.datePublished,'2026-10-12');assert.equal(article.dateModified,route==='/news/carpentry-quote-cost-factors/'?'2026-10-12':'2026-10-13');
    assert.ok(html.includes('datetime="2026-10-12">12 October 2026</time>'));
    assert.ok(html.includes('class="article-byline">By <a href="/about/">Ellis Services Group</a>'));
    assert.ok(html.includes(`<link rel="canonical" href="https://www.canberrawoodwork.com.au${route}">`));
  }
  const old=schemas(read('/news/timber-door-sticks-after-rain/')).find(s=>s['@type']==='Article');
  assert.equal(old.datePublished,'2026-09-28','new guide date does not backdate or rewrite older publications');
});

test('decision guides have bidirectional contextual entry points instead of isolated new routes',()=>{
  for(const [route,origins] of [
    [newRoutes[0],['/faq/','/contact/','/services/small-carpentry-jobs/']],
    [newRoutes[1],['/services/deck-building/','/news/repair-or-rebuild-a-deck/',newRoutes[2]]],
    [newRoutes[2],['/services/deck-repairs/','/news/deck-boards-or-frame/',newRoutes[1]]]
  ])for(const from of origins){assert.ok(read(from).includes(`href="${route}"`),`${from} links to ${route}`);}
  for(const route of newRoutes){const html=read(route);assert.ok(html.includes('href="/services/"'));assert.ok((html.match(/href="\/news\/[^"/]+\/"/g)||[]).length>=2);assert.ok(html.includes('href="/contact/"'));}
});

test('material comparison renders an accessible comparison and attributed guidance',()=>{
  const html=read(newRoutes[1]);
  assert.match(html,/<table[\s>]/);assert.match(html,/<caption>/);assert.match(html,/<th scope="col">/);assert.match(html,/<th scope="row">/);
  assert.ok(html.includes('https://www.modwood.com.au/technical-documentation/'));
  assert.ok(html.includes('https://www.trex.com/deck-ideas/composite-decking-myths/'));
});

test('quote and material guides offer scope-appropriate enquiry next steps',()=>{
  for(const route of newRoutes.slice(0,2)){
    const html=read(route);
    assert.ok(!html.includes('Arrange your timber repair assessment'),route);
    assert.ok(!html.includes('We identify the cause and confirm your repair plan and quote.'),route);
    assert.ok(html.includes('Discuss your requirements and quote'),route);
  }
});

test('new guides retain local table-of-contents anchors and avoid duplicate legacy service routes',()=>{
  for(const route of newRoutes){const html=read(route);assert.ok(html.includes('aria-label="On this page"'));for(const m of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes(`id="${m[1]}"`),`${route}: ${m[1]}`);}
  const sitemap=readFileSync('dist/sitemap.xml','utf8');
  assert.ok(sitemap.includes('/services/composite-decking/'),'business owner has now confirmed this service');assert.ok(!sitemap.includes('/services/deck-restoration/'),'care service has one canonical route');assert.ok(sitemap.includes('/services/built-in-wardrobes/'),'business owner has now confirmed this service');
});
