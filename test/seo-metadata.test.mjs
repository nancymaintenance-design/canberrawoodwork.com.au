import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const origin='https://www.canberrawoodwork.com.au';
// Existing English editorial contract; bilingual.test.mjs covers every Chinese equivalent.
const routes=[...readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>https?:\/\/[^/]+([^<]+)<\/loc>/g)].map(m=>m[1]).filter(route=>!route.startsWith('/zh/'));
const read=route=>readFileSync(`dist${route}index.html`,'utf8');
const decode=value=>value.replace(/&(?:amp|quot|lt|gt|#39);/g,entity=>({'&amp;':'&','&quot;':'"','&lt;':'<','&gt;':'>','&#39;':"'"}[entity]));
const schemas=html=>[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
const metas=html=>[...html.matchAll(/<meta\s+(?:property|name)="([^"]+)"\s+content="([^"]*)"[^>]*>/g)].map(m=>[m[1],decode(m[2])]);
const meta=(html,key)=>metas(html).find(([name])=>name===key)?.[1];
function dimensions(path){
  const data=readFileSync(path);
  assert.equal(data.toString('ascii',0,4),'RIFF',`${path}: valid WebP container`);
  assert.equal(data.toString('ascii',8,12),'WEBP');
  for(let offset=12;offset+8<data.length;){
    const type=data.toString('ascii',offset,offset+4), size=data.readUInt32LE(offset+4), start=offset+8;
    if(type==='VP8X')return [1+data.readUIntLE(start+4,3),1+data.readUIntLE(start+7,3)];
    if(type==='VP8 ')return [data.readUInt16LE(start+6)&0x3fff,data.readUInt16LE(start+8)&0x3fff];
    if(type==='VP8L'){const bits=data.readUInt32LE(start+1);return [(bits&0x3fff)+1,((bits>>>14)&0x3fff)+1];}
    offset=start+size+(size%2);
  }
  assert.fail(`Missing image dimensions: ${path}`);
}

// Catches lost identity, invented business facts, or unresolved provider references.
test('all 51 public pages retain one construction business and canonical relationships',()=>{
  assert.equal(routes.length,51);
  for(const route of routes){
    const entries=schemas(read(route));
    assert.ok(entries.every(s=>!['ProfessionalService','FAQPage','HowTo'].includes(s['@type'])),route);
    const business=entries.filter(s=>s['@id']===`${origin}/#business`);
    assert.equal(business.length,1,route);
    assert.equal(business[0]['@type'],'HomeAndConstructionBusiness');
    assert.equal(business[0].legalName,'ELLIS SERVICES GROUP PTY LTD');
    assert.equal(business[0].taxID,'96 645 821 745');
    assert.equal(business[0].telephone,'+61405878406');
    assert.deepEqual(business[0].address,{'@type':'PostalAddress',streetAddress:'121 Marcus Clarke St',addressLocality:'Canberra',addressRegion:'ACT',postalCode:'2600',addressCountry:'AU'});
    assert.equal(business[0].logo['@type'],'ImageObject');
    assert.equal(business[0].logo.url,`${origin}/assets/ellis-services-logo-small.webp`);
    assert.deepEqual(dimensions(`dist${new URL(business[0].logo.url).pathname}`),[business[0].logo.width,business[0].logo.height]);
    assert.ok(existsSync(`dist${new URL(business[0].image).pathname}`));
    for(const field of ['sameAs','openingHours','geo','priceRange','aggregateRating'])assert.equal(business[0][field],undefined);
    for(const entry of entries){
      if(entry.provider)assert.deepEqual(entry.provider,{'@id':`${origin}/#business`});
      if(entry.publisher)assert.deepEqual(entry.publisher,{'@id':`${origin}/#business`});
    }
  }
});

// Catches duplicated, stale or missing final social tags and false image dimensions.
test('every route has exactly one coherent social preview matching its final head',()=>{
  const titles=new Set();
  for(const route of [...routes,'/404/']){
    const html=read(route),title=decode(html.match(/<title>(.*?)<\/title>/s)[1]),description=meta(html,'description');
    const values=new Map(metas(html));
    const expected={'og:title':title,'og:description':description,'og:url':origin+route,'og:type':route.startsWith('/news/')&&route!='/news/'?'article':'website','og:site_name':'Ellis Services Group','og:locale':'en_AU','twitter:card':'summary_large_image','twitter:title':title,'twitter:description':description};
    for(const [key,value] of Object.entries(expected)){
      assert.equal(metas(html).filter(([name])=>name===key).length,1,`${route}: ${key}`);
      assert.equal(values.get(key),value,`${route}: ${key}`);
    }
    for(const key of ['og:image','og:image:alt','twitter:image','twitter:image:alt']){
      assert.equal(metas(html).filter(([name])=>name===key).length,1,`${route}: ${key}`);
      assert.ok(values.get(key));
    }
    assert.equal(values.get('twitter:image'),values.get('og:image'));
    assert.equal(values.get('twitter:image:alt'),values.get('og:image:alt'));
    const image=new URL(values.get('og:image'));
    assert.equal(image.origin,origin);
    assert.deepEqual(dimensions(`dist${image.pathname}`),[Number(values.get('og:image:width')),Number(values.get('og:image:height'))]);
    assert.equal(html.match(/<link rel="canonical" href="([^"]+)"/)[1],origin+route);
    const page=schemas(html).find(s=>s['@id']===`${origin}${route}#webpage`);
    assert.equal(page.name,title);
    assert.equal(page.description,description);
    assert.ok(!titles.has(title),route);titles.add(title);
    assert.ok(title.endsWith(' | Ellis Services Group'));
  }
});

test('door, Mitchell and Melba previews use independently identified subject photos',()=>{
  const fixtures=[
    ['/news/timber-door-sticks-after-rain/','/assets/door-hinge-frame-detail-canberra.webp',960,720],
    ['/news/timber-vs-composite-decking-canberra/','/assets/projects/mitchell-composite-deck-completed.webp',1448,1086],
    ['/news/timber-deck-maintenance-canberra/','/assets/projects/melba-deck-oiled.webp',1448,1086],
    ['/services/composite-decking/','/assets/projects/mitchell-composite-deck-completed.webp',1448,1086],
    ['/projects/melba-deck-care/','/assets/projects/melba-deck-oiled.webp',1448,1086],
  ];
  for(const [route,path,width,height] of fixtures){
    assert.equal(meta(read(route),'og:image'),origin+path);
    assert.deepEqual(dimensions(`dist${path}`),[width,height]);
  }
});

test('all 17 articles use the shared editorial image while preserving headline, author and dates',async()=>{
  assert.ok(existsSync('src/editorial-media.mjs'),'editorial manifest exists');
  const {editorialMedia}=await import('../src/editorial-media.mjs');
  assert.equal(Object.keys(editorialMedia).length,17);
  const articleRoutes=routes.filter(route=>route.startsWith('/news/')&&route!='/news/');
  for(const route of articleRoutes){
    const html=read(route),article=schemas(html).find(s=>s['@type']==='Article'),media=editorialMedia[route];
    assert.ok(media?.src.startsWith('/assets/'));
    assert.ok(media.alt && media.caption);
    assert.ok(!media.src.includes('logo'));
    assert.deepEqual(dimensions(`dist${media.src}`),[media.width,media.height]);
    assert.equal(article.image,origin+media.src);
    assert.equal(meta(html,'og:image'),article.image);
    assert.equal(article.headline,decode(html.match(/<h1>(.*?)<\/h1>/s)[1]));
    assert.deepEqual(article.author,{'@type':'Organization',name:'Ellis Services Group',url:origin+'/about/'});
    const fresh=['carpentry-quote-cost-factors','timber-vs-composite-decking-canberra','timber-deck-maintenance-canberra'].some(slug=>route===`/news/${slug}/`);
    assert.equal(article.datePublished,fresh?'2026-10-12':'2026-09-28');
    assert.equal(article.dateModified,'2026-10-15');
    if(media.projectHref)assert.ok(existsSync(`dist${media.projectHref}index.html`));
    else assert.match(media.caption,/illustrat/i,'legacy media is labelled illustration');
  }
});

test('verbose question titles are shortened without rewriting the visible question',()=>{
  const html=read('/news/timber-door-sticks-after-rain/');
  assert.equal(decode(html.match(/<title>(.*?)<\/title>/s)[1]),'Sticking Timber Doors After Rain | Ellis Services Group');
  assert.equal(decode(html.match(/<h1>(.*?)<\/h1>/s)[1]),'Why does a timber door stick after rain?');
});

// Catches raw HTML injection, double escaping, repeated normalization and missing-route crashes.
test('normalization escapes final values and safely falls back for unknown routes and missing images',async()=>{
  assert.ok(existsSync('src/seo-metadata.mjs'),'final metadata normalizer exists');
  const {normalizeSeoMetadata}=await import('../src/seo-metadata.mjs');
  const input='<html><head><title>Timber &amp; &quot;quotes&quot; &lt;care&gt; | Ellis Services Group</title><meta name="description" content="A &amp; B &quot;detail&quot; &lt;safe&gt;"><link rel="canonical" href="https://www.canberrawoodwork.com.au/unknown/"><meta property="og:title" content="Stale"><meta property="og:title" content="Stale again"></head><body><h1>Original</h1></body></html>';
  const output=normalizeSeoMetadata(input,'/unknown/');
  assert.equal(meta(output,'og:title'),'Timber & "quotes" <care> | Ellis Services Group');
  assert.equal(meta(output,'twitter:description'),'A & B "detail" <safe>');
  assert.match(output,/content="Timber &amp; &quot;quotes&quot; &lt;care&gt; \| Ellis Services Group"/);
  assert.equal(metas(output).filter(([name])=>name==='og:title').length,1);
  assert.equal(normalizeSeoMetadata(output,'/unknown/'),output,'normalization is idempotent');
  assert.match(output,/<body><h1>Original<\/h1><\/body>/);
  assert.match(output,/rel="canonical" href="https:\/\/www.canberrawoodwork.com.au\/unknown\/"/);
  const missing=normalizeSeoMetadata(read('/news/timber-door-sticks-after-rain/'),'/news/timber-door-sticks-after-rain/',{imageExists:path=>!path.includes('door-hinge')});
  assert.equal(meta(missing,'og:image'),origin+'/assets/measuring-timber-work-canberra.webp');
  assert.equal(schemas(missing).find(schema=>schema['@type']==='Article').image,meta(missing,'og:image'));
  const notFound=normalizeSeoMetadata(read('/404/'),'/404/');
  assert.equal(notFound.match(/<body>[\s\S]*<\/body>/)[0],read('/404/').match(/<body>[\s\S]*<\/body>/)[0]);
  assert.equal(meta(notFound,'og:type'),'website');
});
