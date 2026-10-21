import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {parse} from 'parse5';
const snapshot=(dir,prefix='')=>new Map(readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?[...snapshot(join(dir,f.name),prefix+f.name+'/')]:[[prefix+f.name,readFileSync(join(dir,f.name))]]));
execFileSync(process.execPath,['build.mjs'],{stdio:'pipe',env:{...process.env,CMS_SKIP_APPROVED:'0',FAQ_DESIGN_SKIP_RELEASE:'1'}});
const before=snapshot('dist');
execFileSync(process.execPath,['build.mjs'],{stdio:'pipe',env:{...process.env,CMS_SKIP_APPROVED:'0',FAQ_DESIGN_SKIP_RELEASE:'0'}});
const after=snapshot('dist');
const pages=['faq/index.html','zh/faq/index.html'];
const walk=(n,fn)=>[...(fn(n)?[n]:[]),...(n.childNodes||[]).flatMap(c=>walk(c,fn))];
const signature=html=>{const doc=parse(html);return {
 text:walk(doc,n=>n.nodeName==='#text').map(n=>n.value.replace(/\s+/g,' ').trim()).filter(Boolean),
 headings:walk(doc,n=>/^h[1-6]$/.test(n.tagName||'')).map(n=>[n.tagName,walk(n,c=>c.nodeName==='#text').map(c=>c.value).join('')]),
 links:walk(doc,n=>n.tagName==='a').map(n=>n.attrs),
 controls:walk(doc,n=>['details','summary','button','form','input','select','textarea'].includes(n.tagName)).map(n=>[n.tagName,n.attrs]),
 ids:walk(doc,n=>n.attrs?.some(a=>a.name==='id')).map(n=>n.attrs.find(a=>a.name==='id').value)
}};
test('only the two FAQ pages change; privacy, home, other pages, forms and all existing assets retain bytes',()=>{
 assert.equal(after.size,before.size);
 assert.deepEqual([...before].filter(([file,bytes])=>!bytes.equals(after.get(file))).map(([file])=>file).sort(),pages.sort());
});
test('FAQ copy, headings, links, disclosure controls, IDs, metadata and original global chrome are unchanged',()=>{
 for(const file of pages){
  const a=before.get(file).toString(),b=after.get(file).toString();assert.deepEqual(signature(b),signature(a),file);
  const match=(html,re)=>html.match(re)?.[0];
  assert.equal(match(b,/<head>[\s\S]*?<\/head>/).replace('<link rel="stylesheet" href="/assets/faq-design.css">',''),match(a,/<head>[\s\S]*?<\/head>/));
  for(const re of [/<header class="site-header"[\s\S]*?<\/header>/,/<footer class="site-footer"[\s\S]*?<\/footer>/])assert.equal(match(b,re),match(a,re));
  assert.doesNotMatch(b,/carpentry-candidate|candidate-preview|cw-home|cw-contact|localhost|127\.0\.0\.1|noindex/);
 }
});
test('FAQ uses existing image and original interaction runtimes with no additional JavaScript',()=>{
 assert(after.get('assets/measuring-timber-work-canberra.webp')?.length);
 assert(after.get('assets/faq-design.css')?.length);
 for(const file of pages){const a=before.get(file).toString(),b=after.get(file).toString();assert.deepEqual([...b.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(m=>m[1]),[...a.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(m=>m[1]));}
});
