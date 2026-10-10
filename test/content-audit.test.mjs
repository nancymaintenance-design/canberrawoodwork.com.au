import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, symlinkSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles } from '../src/content.mjs';
import { auditHtml, auditSite } from '../scripts/audit-content.mjs';

const routes = [...readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>https?:\/\/[^/]+([^<]+)<\/loc>/g)].map(m=>m[1]);
const pages = new Map(routes.map(route=>[route,readFileSync(`dist${route}index.html`,'utf8')]));
const main = html=>html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
const plain = html=>html.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
test('audit module can be imported from node eval without a script argument',()=>{
  const result=spawnSync(process.execPath,['--input-type=module','-e',"const audit=await import('./scripts/audit-content.mjs'); console.log(typeof audit.auditSite);"],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.equal(result.stdout.trim(),'function','import does not execute the CLI');
});
test('audit records the UTC run date and accepts a deterministic injected clock',()=>{
  const before=new Date().toISOString().slice(0,10);
  const actual=auditSite('dist').analyzedAt;
  const after=new Date().toISOString().slice(0,10);
  assert.ok([before,after].includes(actual),'default date follows the current run');
  const result=auditSite('dist',undefined,{now:new Date('2027-01-02T01:00:00+11:00')});
  assert.equal(result.analyzedAt,'2027-01-01');
  assert.deepEqual(result.pages.find(page=>page.articleDates).articleDates,{published:'2026-09-28',modified:'2026-10-10'},'run date does not rewrite article history');
});
test('rendered article date labels follow alternate article fields across timezone boundaries',()=>{
  const fixtureRoot=mkdtempSync(join(tmpdir(),'ellis-article-dates-'));
  try{
    symlinkSync(fileURLToPath(new URL('../public',import.meta.url)),join(fixtureRoot,'public'),'junction');
    const contentUrl=new URL('../src/content.mjs',import.meta.url).href;
    const buildUrl=new URL('../build.mjs',import.meta.url).href;
    const source=`const {articles}=await import(${JSON.stringify(contentUrl)}); articles[0].published='2024-02-29'; articles[0].updated='2027-01-01'; await import(${JSON.stringify(buildUrl)});`;
    const result=spawnSync(process.execPath,['--input-type=module','-e',source],{cwd:fixtureRoot,encoding:'utf8',env:{...process.env,TZ:'America/Los_Angeles'}});
    assert.equal(result.status,0,result.stderr);
    const html=readFileSync(join(fixtureRoot,'dist','news',articles[0].slug,'index.html'),'utf8');
    const page=auditHtml(`/news/${articles[0].slug}/`,html);
    assert.deepEqual(page.visibleDates,[{date:'2024-02-29',label:'29 February 2024'},{date:'2027-01-01',label:'1 January 2027'}]);
    assert.deepEqual(page.articleDates,{published:'2024-02-29',modified:'2027-01-01'});
  }finally{rmSync(fixtureRoot,{recursive:true,force:true});}
});
test('repeatable audit retains baseline entity and closed-details word-count semantics',()=>{
  const fixture='<main><h1>A &amp; B</h1><details><summary>Why now?</summary><p>Keep it.</p></details></main>';
  assert.equal(auditHtml('/',fixture).words,7);
  const result=auditSite('dist');
  assert.equal(result.baseline,null,'audit does not depend on a local scratch baseline');
  assert.equal(result.metrics.routes,39);
  assert.equal(result.metrics.invalidMainLinks,0);
});
test('all 39 canonical routes have unique metadata and accessible heading order',()=>{
  assert.equal(routes.length,39);
  const titles=new Set(), descriptions=new Set();
  for(const [route,html] of pages){
    const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
    const description=html.match(/<meta name="description" content="([^"]*)"/)?.[1];
    assert.ok(title && description,route);
    assert.ok(!titles.has(title),`${route}: unique title`);titles.add(title);
    assert.ok(!descriptions.has(description),`${route}: unique description`);descriptions.add(description);
    const headings=[...main(html).matchAll(/<h([1-6])\b[^>]*>(.*?)<\/h\1>/gs)].map(m=>({level:Number(m[1]),text:plain(m[2]).toLowerCase()}));
    assert.equal(headings.filter(h=>h.level===1).length,1,route);
    let previous=0;const top=new Set();
    for(const h of headings){assert.ok(h.level<=previous+1,`${route}: h${previous} to h${h.level}`);previous=h.level;if(h.level<=2){assert.ok(!top.has(h.text),`${route}: duplicate ${h.text}`);top.add(h.text);}}
    assert.ok(!html.includes('"@type":"FAQPage"'),route);
  }
});
test('all rendered internal links resolve including fragment anchors',()=>{
  for(const [route,html] of pages)for(const m of html.matchAll(/href="([^"<>]+)"/g)){
    if(!m[1].startsWith('/') && !m[1].startsWith('#'))continue;
    const url=new URL(m[1],`https://www.canberrawoodwork.com.au${route}`);
    if(url.pathname.startsWith('/assets/')){assert.ok(existsSync(`dist${url.pathname}`),m[1]);continue;}
    assert.ok(pages.has(url.pathname),`${route}: destination ${m[1]}`);
    if(url.hash){const id=decodeURIComponent(url.hash.slice(1));assert.ok(pages.get(url.pathname).includes(`id="${id}"`),`${route}: anchor ${m[1]}`);}
  }
});
test('every guide has linked company attribution, visible schema dates and contextual reading',()=>{
  for(const article of articles){
    const html=pages.get(`/news/${article.slug}/`),body=main(html);
    const schema=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1])).find(s=>s['@type']==='Article');
    assert.match(body, /class="article-byline">By <a href="\/about\/">Ellis Services Group<\/a>/);
    for(const key of ['datePublished','dateModified'])assert.ok(body.includes(`datetime="${schema[key]}"`),`${article.slug}: ${key}`);
    for(const {date,label} of auditHtml(`/news/${article.slug}/`,html).visibleDates){
      assert.match(label,/^\d{1,2} [A-Z][a-z]+ \d{4}$/);
      assert.equal(new Date(`${label} UTC`).toISOString().slice(0,10),date,`${article.slug}: human-readable label matches datetime`);
    }
    assert.ok(body.includes(`href="/services/${article.owner}/"`),article.slug);
    assert.ok([...body.matchAll(/href="\/news\/[^"/]+\/"/g)].length>=2,`${article.slug}: related explanations`);
    assert.ok((body.match(/<details class="faq-item">/g)||[]).length>=2,`${article.slug}: useful questions`);
  }
});
