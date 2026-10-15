import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=route=>readFileSync(`dist${route}index.html`,'utf8');
const services=['composite-decking','deck-cleaning-and-oiling','built-in-wardrobes','under-stair-storage'];
const projects=['mitchell-composite-deck','melba-deck-care','pearce-wardrobe-installation','under-stair-storage-gallery'];
test('confirmed services and project pages are published in local discovery with enquiry paths',()=>{
  const sitemap=readFileSync('dist/sitemap.xml','utf8'),llms=readFileSync('dist/llms.txt','utf8');
  for(const route of ['/projects/',...services.map(s=>`/services/${s}/`),...projects.map(s=>`/projects/${s}/`)]){
    assert.ok(existsSync(`dist${route}index.html`),`${route}: registered output`);
    assert.ok(sitemap.includes(`https://www.canberrawoodwork.com.au${route}`),route);
    assert.ok(llms.includes(`https://www.canberrawoodwork.com.au${route}`),route);
    assert.ok(read(route).includes('href="/contact/"'),route);
  }
});
test('new services are reachable from service directory and selectable in enquiry form',()=>{
  const hub=read('/services/'),contact=read('/contact/');
  for(const slug of services)assert.ok(hub.includes(`href="/services/${slug}/"`),slug);
  for(const name of ['Composite Decking Installation','Deck Cleaning &amp; Oiling','Built-in Wardrobe Installation','Under-stair Storage Installation'])assert.ok(contact.includes(`<option value="${name}">`),name);
  assert.ok(read('/').includes('href="/projects/"'));
  assert.ok(read('/about/').includes('id="our-team-at-work"'));
});
test('project evidence distinguishes assembly, staged deck work and multiple finished storage projects',()=>{
  assert.match(read('/projects/pearce-wardrobe-installation/'),/IKEA/);
  assert.match(read('/projects/mitchell-composite-deck/'),/Framing stage/);
  assert.match(read('/projects/melba-deck-care/'),/Cabot/);
  const stairs=read('/projects/under-stair-storage-gallery/');
  assert.match(stairs,/different projects/i);
  assert.doesNotMatch(stairs,/>Before work</);
  const about=read('/about/').match(/<section[^>]+id="our-team-at-work"[\s\S]*?<\/section>/)?.[0];
  assert.ok(about);assert.match(about,/outdoor (?:carpentry|timber)/i);assert.doesNotMatch(about,/wardrobe/i);
});
test('earlier advice acknowledges confirmed composite installation and stand-alone deck care',()=>{
  const materials=read('/news/timber-vs-composite-decking-canberra/'),care=read('/news/timber-deck-maintenance-canberra/');
  assert.doesNotMatch(care,/not a promise that Ellis provides a stand-alone/);
  assert.match(care,/Ellis.*provides stand-alone deck cleaning and oiling/);
  assert.match(materials,/Ellis.*carpentry team installs composite decking/);
});
test('project photos have responsive variants, descriptive alt text and local assets',()=>{
  const html=projects.map(s=>read(`/projects/${s}/`)).join('')+read('/about/');
  const images=[...html.matchAll(/<img\b[^>]*src="(\/assets\/projects\/[^\"]+)"[^>]*>/g)];
  assert.equal(images.length,21,'all supplied project and outdoor-team photos are rendered');
  for(const [tag,src] of images){
    assert.ok(existsSync(`dist${src}`),src);assert.match(tag,/width="1448" height="1086"/);
    assert.match(tag,/srcset="[^"]+400w,[^"]+800w,[^"]+1448w"/);
    const alt=tag.match(/alt="([^"]+)"/)?.[1];assert.ok(alt&&alt.length>=10&&alt.length<=125,src);
    for(const m of tag.matchAll(/(\/assets\/projects\/[^\s",]+\.webp)/g))assert.ok(existsSync(`dist${m[1]}`),m[1]);
  }
});
test('projects hub breadcrumb links to its parent without a redundant self-link',()=>{
  const nav=read('/projects/').match(/<nav class="breadcrumbs"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(nav);assert.ok(!nav.includes('href="/projects/"'));
  assert.ok(nav.includes('aria-current="page"'));
});
