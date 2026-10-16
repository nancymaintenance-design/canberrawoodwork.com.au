import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {articles} from '../src/content.mjs';

const read=slug=>readFileSync(`dist/news/${slug}/index.html`,'utf8');
const strip=html=>html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const prose=html=>html.match(/<div class="article-prose">([\s\S]*?)<\/div><aside/)?.[1]||'';
test('all seventeen complete guides offer navigable sections with connected paragraphs',()=>{
  assert.equal(articles.length,17);
  for(const a of articles){
    const html=read(a.slug),body=prose(html);
    assert.equal((body.match(/aria-label="On this page"/g)||[]).length,1,`${a.slug}: one contents list`);
    const toc=body.match(/<nav[^>]+aria-label="On this page"[\s\S]*?<\/nav>/)?.[0]||'';
    const targets=[...toc.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]);
    assert.ok(targets.length>=5,`${a.slug}: substantive navigable decisions`);
    for(const id of targets){
      const section=body.match(new RegExp(`<section[^>]*id="${id}"[^>]*>([\\s\\S]*?)</section>`))?.[1]||'';
      assert.match(section,/<h2>/,`${a.slug}: heading target ${id}`);
      assert.ok((section.match(/<p(?:\s|>)/g)||[]).length>=2,`${a.slug}: connected paragraphs at ${id}`);
    }
    assert.ok(body.includes('class="guide-editorial-figure"'),`${a.slug}: evidence retained`);
    assert.ok((body.match(/<details class="faq-item">/g)||[]).length>=2,`${a.slug}: relevant questions`);
    const schema=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1])).find(s=>s['@type']==='Article');
    assert.equal(schema.dateModified,'2026-10-14',`${a.slug}: actual revision`);
    assert.ok(html.includes('Updated <time datetime="2026-10-14">14 October 2026</time>'));
    assert.equal(schema.datePublished,a.published,`${a.slug}: original publication`);
  }
});
test('guide prose and quote preparation are distinct and all deep links resolve',()=>{
  const seen=new Map();
  for(const a of articles){
    const body=prose(read(a.slug));
    const headings=[...body.matchAll(/<h2\b[^>]*>(.*?)<\/h2>/g)].map(m=>strip(m[1]));
    assert.equal(new Set(headings).size,headings.length,`${a.slug}: unique H2`);
    const questions=[...body.matchAll(/<summary>(.*?)<\/summary>/g)].map(m=>strip(m[1]));
    assert.equal(new Set(questions).size,questions.length,`${a.slug}: no duplicate FAQ questions`);
    const ids=[...body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(ids).size,ids.length,`${a.slug}: unique IDs`);
    for(const m of body.matchAll(/<a[^>]+href="(\/[^"#]*)(?:#([^"]+))?"/g)){
      const file=`dist${m[1]}index.html`;
      assert.ok(existsSync(file),`${a.slug}: ${m[1]}`);
      if(m[2])assert.ok(readFileSync(file,'utf8').includes(`id="${m[2]}"`),`${a.slug}: ${m[0]}`);
    }
    const sections=[...body.matchAll(/<section[^>]*id="[^\"]+"[^>]*>([\s\S]*?)<\/section>/g)];
    assert.ok(sections.some(m=>/<a href="\/services\//.test(m[1])),`${a.slug}: contextual service link in prose`);
    for(const section of sections)for(const m of section[1].matchAll(/<p>([\s\S]*?)<\/p>/g)){
      const p=strip(m[1]);if(p.split(' ').length<35)continue;
      assert.ok(!seen.has(p),`${a.slug}: repeated paragraph from ${seen.get(p)}`);seen.set(p,a.slug);
    }
  }
});
test('existing decision deep links remain usable after the body rewrite',()=>{
  for(const slug of ['carpentry-quote-cost-factors','timber-vs-composite-decking-canberra','timber-deck-maintenance-canberra']){
    const body=prose(read(slug));
    for(let i=1;i<=6;i++)assert.equal((body.match(new RegExp(`id="decision-${i}"`,'g'))||[]).length,1,`${slug}: old decision-${i} anchor`);
  }
});
