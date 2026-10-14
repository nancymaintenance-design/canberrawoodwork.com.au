import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';

const origin='https://www.canberrawoodwork.com.au';
const read=route=>readFileSync(`dist${route}index.html`,'utf8');
const main=html=>html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]||'';
const text=html=>html.replace(/<[^>]*>/g,' ').replaceAll('&amp;','&').replaceAll('&#39;',"'").replace(/\s+/g,' ').trim();
const schemas=html=>[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
const guideImages={
  'timber-door-sticks-after-rain':'door-hinge-frame-detail-canberra',
  'deck-boards-or-frame':'under-deck-timber-assessment',
  'rotten-window-sill':'deteriorated-timber-frame-before',
  'fascia-bargeboard-eaves':'fascia-eaves-repair-process',
  'leaning-paling-fence':'timber-fence-before-repair',
  'skirting-after-new-flooring':'skirting-architrave-detail-canberra',
  'why-timber-gates-sag':'fence-gate-hardware-detail-canberra',
  'why-timber-rot-returns':'deteriorated-timber-frame-before',
  'cabinet-hinges-and-drawer-runners':'cabinet-hardware-detail-canberra',
  'timber-weatherboard-damage':'weatherboard-window-detail-canberra',
  'loose-timber-stairs':'handrail-stair-detail-canberra',
  'pergola-post-rot':'pergola-post-base-repair',
  'repair-or-rebuild-a-deck':'under-deck-timber-assessment',
  'carpentry-jobs-before-selling':'measuring-timber-work-canberra',
  'carpentry-quote-cost-factors':'measuring-timber-work-canberra',
  'timber-vs-composite-decking-canberra':'projects/mitchell-composite-deck-completed',
  'timber-deck-maintenance-canberra':'projects/melba-deck-oiled',
};

// Catches missing/misplaced figures, mismatched previews and broken responsive assets.
for(const [slug,image] of Object.entries(guideImages))test(`${slug}: one relevant responsive figure in the article body`,()=>{
  const route=`/news/${slug}/`,html=read(route),body=main(html);
  const prose=body.match(/<div class="article-prose">([\s\S]*?)<aside class="article-sidebar">/)?.[1]||'';
  const figures=[...prose.matchAll(/<figure\b[^>]*>([\s\S]*?)<\/figure>/g)];
  assert.equal(figures.length,1,'guide body has exactly one editorial figure');
  const figure=figures[0][1],src=`/assets/${image}.webp`,img=figure.match(/<img\b[^>]*>/)?.[0];
  assert.ok(img?.includes(`src="${src}"`));
  assert.match(img,/loading="lazy"/);assert.match(img,/decoding="async"/);
  assert.match(img,/width="\d+" height="\d+"/);
  assert.ok(img.match(/alt="([^"]+)"/)?.[1].length>20);
  assert.match(img,/srcset="[^"]+400w,[^"]+800w,[^"]+\d+w"/);
  assert.match(img,/sizes="[^"]+"/);
  for(const asset of img.matchAll(/(\/assets\/[^\s",]+\.webp)/g))assert.ok(existsSync(`dist${asset[1]}`),asset[1]);
  const caption=figure.match(/<figcaption>([\s\S]*?)<\/figcaption>/)?.[1]||'';
  assert.ok(text(caption).length>80,'caption explains the image and its evidential limits');
  if(!image.startsWith('projects/')){assert.match(text(caption),/Illustrative detail:/);assert.match(text(caption),/not a documented project record/);}
  assert.ok(html.includes(`<meta property="og:image" content="${origin+src}"`));
  assert.equal(schemas(html).find(s=>s['@type']==='Article').image,origin+src);
});

test('Mitchell and Melba guides explain only the supplied work and link the exact project',()=>{
  const fixtures=[
    ['timber-vs-composite-decking-canberra','mitchell-composite-deck',[/Mitchell/,/August 2025/,/levelling/,/subframe/,/WPC/,/frame already in place/]],
    ['timber-deck-maintenance-canberra','melba-deck-care',[/Melba/,/May 2025/,/raised and distorted/,/cleaning/,/preparation/,/Cabot[’']s oil-based decking oil/]],
  ];
  for(const [slug,project,facts] of fixtures){
    const html=main(read(`/news/${slug}/`));
    const context=html.match(/<section class="guide-project-context">([\s\S]*?)<\/section>/)?.[1]||'';
    assert.ok(context,'visible first-hand project context');
    for(const fact of facts)assert.match(text(context),fact);
    assert.match(context,new RegExp(`href="/projects/${project}/"`));
    assert.doesNotMatch(text(context),/\b\d+\s*(?:mm|m²|coats?|days?|hours?)\b|\$\d|vacant site|before-site/i);
    assert.ok(html.indexOf(context)<html.indexOf('<section id="decision-1">'),'context precedes general advice');
  }
  const material=read('/news/timber-vs-composite-decking-canberra/'),care=read('/news/timber-deck-maintenance-canberra/');
  assert.ok(material.includes('https://www.modwood.com.au/technical-documentation/'));
  assert.ok(material.includes('https://www.trex.com/deck-ideas/composite-decking-myths/'));
  assert.match(text(care),/Do not lift boards, crawl under an unsafe deck/);
  assert.ok(care.includes('https://www.woodsolutions.com.au/'));
});

test('three districts contain meaningful links to their confirmed local case',()=>{
  const html=main(read('/service-areas/'));
  for(const [district,project,suburb,fact] of [
    ['gungahlin','mitchell-composite-deck','Mitchell',/levelling.*subframe.*WPC/],
    ['belconnen','melba-deck-care','Melba',/repairs.*cleaning.*oiling/],
    ['woden-valley','pearce-wardrobe-installation','Pearce',/IKEA.*assembly.*fitting/],
  ]){
    const block=html.match(new RegExp(`<section class="district" id="${district}">([\\s\\S]*?)</section>`))?.[1]||'';
    const anchor=block.match(new RegExp(`<a href="/projects/${project}/">([^<]+)</a>`))?.[1]||'';
    assert.ok(anchor.includes(suburb)&&anchor.length>25,`${district}: meaningful local case link`);
    assert.match(text(block),fact);
  }
  assert.doesNotMatch(html,/href="\/projects\/under-stair-storage-gallery\/"/);
});

test('substantially enhanced guides show the actual revision date without changing publication history',()=>{
  for(const slug of ['timber-vs-composite-decking-canberra','timber-deck-maintenance-canberra']){
    const html=read(`/news/${slug}/`),article=schemas(html).find(s=>s['@type']==='Article');
    assert.equal(article.datePublished,'2026-10-12');
    assert.equal(article.dateModified,'2026-10-14');
    assert.match(html,/Published <time datetime="2026-10-12">12 October 2026<\/time>/);
    assert.match(html,/Updated <time datetime="2026-10-14">14 October 2026<\/time>/);
  }
});

test('four service quote decisions distinguish supply, repair, product fitting and stair access',()=>{
  const checklists=[];
  for(const [slug,facts] of [
    ['composite-decking',[/suppl/i,/board.*fixing/i,/subframe/i]],
    ['deck-cleaning-and-oiling',[/repair/i,/surface/i,/product/i]],
    ['built-in-wardrobes',[/suppl/i,/IKEA/i,/manufactur/i]],
    ['under-stair-storage',[/access/i,/layout/i,/suppl/i]],
  ]){
    const body=main(read(`/services/${slug}/`));
    const checklist=body.match(/<section class="quote-scope-decision">([\s\S]*?)<\/section>/)?.[1]||'';
    assert.ok(checklist,slug);assert.ok((checklist.match(/<li>/g)||[]).length>=3,slug);
    for(const fact of facts)assert.match(text(checklist),fact);
    assert.doesNotMatch(text(checklist),/\b\d+\s*(?:mm|m²|coats?|days?|hours?)\b|\$\d|free visit|guaranteed reply/i);
    checklists.push(text(checklist));
  }
  assert.equal(new Set(checklists).size,4,'each service offers its own decision help');
});

test('contact first-screen jump focuses the actual form and preserves all enquiry controls',()=>{
  const html=read('/contact/'),body=main(html),hero=body.match(/<section class="page-hero shell">([\s\S]*?)<\/section>/)?.[1]||'';
  assert.match(hero,/<a[^>]+href="#enquiry-form"[^>]*>[^<]*enquiry form/i);
  assert.ok(hero.indexOf('href="#enquiry-form"')<hero.indexOf('<p>',hero.indexOf('</h1>')),'jump is before the long introduction for shorter mobile screens');
  assert.equal((body.match(/id="enquiry-form"/g)||[]).length,1);
  const form=body.match(/<form\b[^>]*>[\s\S]*?<\/form>/)?.[0]||'';
  assert.match(form,/<form[^>]+id="enquiry-form"[^>]+tabindex="-1"/);
  assert.match(form,/action="\/api\/contact" method="post"/);
  assert.deepEqual([...form.matchAll(/<(?:input|select|textarea)\b[^>]*name="([^"]+)"/g)].map(m=>m[1]),['name','email','phone','address','district','service','message','consent']);
  for(const field of ['name','email','message','consent'])assert.match(form,new RegExp(`<(?:input|textarea)[^>]*name="${field}"[^>]*required`));
  const labels=[...form.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/g)].map(m=>m[1]);
  for(const [field,label] of [['name','Your name'],['email','Email address'],['phone','Phone number'],['address','Property address'],['district','Canberra district or area'],['service','Service of interest'],['message','Tell us about the work'],['consent','I agree that Ellis Services Group']]){
    const wrapped=labels.find(item=>item.includes(`name="${field}"`));
    assert.ok(wrapped,`${field}: control remains inside its label`);
    assert.ok(text(wrapped).startsWith(label),`${field}: visible label is preserved`);
  }
  assert.match(form,/name="email" type="email" autocomplete="email" required/);
  assert.match(form,/name="phone" type="tel" autocomplete="tel"/);
  assert.match(form,/href="\/privacy\/"/);assert.match(form,/Photos are optional/);
  assert.match(form,/mailto:brian@elliservices.com.au/);
  assert.match(form,/name="consent" type="checkbox" required/);
  assert.match(form,/type="submit">Send enquiry/);
  assert.doesNotMatch(body,/googletagmanager|gtag\(|plausible|data-tracking/i);
});

test('changed page bodies retain one H1, unique headings and resolvable fragment links',()=>{
  const routes=[...Object.keys(guideImages).map(slug=>`/news/${slug}/`),'/service-areas/','/contact/',...['composite-decking','deck-cleaning-and-oiling','built-in-wardrobes','under-stair-storage'].map(slug=>`/services/${slug}/`)];
  for(const route of routes){
    const body=main(read(route));
    assert.equal((body.match(/<h1\b/g)||[]).length,1,route);
    const headings=[...body.matchAll(/<h2\b[^>]*>(.*?)<\/h2>/gs)].map(m=>text(m[1]));
    assert.equal(new Set(headings).size,headings.length,`${route}: duplicate H2`);
    const ids=[...body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(ids).size,ids.length,`${route}: duplicate ID`);
    for(const m of body.matchAll(/href="#([^"]+)"/g))assert.equal(ids.filter(id=>id===m[1]).length,1,`${route}: unresolved fragment ${m[1]}`);
  }
  const about=main(read('/about/'));
  assert.match(about,/96 645 821 745/);
  assert.doesNotMatch(about,/technical reviewer|reviewed by|certified reviewer/i);
});
