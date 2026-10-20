import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {parse} from 'parse5';
import {navigationMap,getTrail,canonicalOrigin} from '../src/navigation-paths.mts';
const preview='.local-admin/navigation-preview';
const nodes=html=>{const result=[];function visit(n){if(n.tagName)result.push(n);n.childNodes?.forEach(visit);}visit(parse(html));return result;};
const text=n=>n.value??(n.childNodes||[]).map(text).join('');
test('all 102 raw pages expose exactly the mapped accessible trail and matching schema',()=>{
 for(const row of navigationMap){
  const elements=nodes(readFileSync(join(preview,row.url,'index.html'),'utf8'));
  const nav=elements.find(n=>n.tagName==='nav'&&n.attrs.some(a=>a.name==='data-service-breadcrumb'));
  const trail=getTrail(row.url);if(!trail.length){assert.equal(nav,undefined);continue;}
  const parts=[];function visit(n){if(n.tagName==='a'||n.attrs?.some(a=>a.name==='aria-current'))parts.push(n);n.childNodes?.forEach(visit);}visit(nav);
  assert.deepEqual(parts.map(text),trail.map(r=>r.breadcrumb_label),row.url);
  assert.deepEqual(parts.slice(0,-1).map(n=>n.attrs.find(a=>a.name==='href').value),trail.slice(0,-1).map(r=>canonicalOrigin+r.url),row.url);
  assert.ok(parts.at(-1).attrs.some(a=>a.name==='aria-current'&&a.value==='page'));
  assert.ok(elements.filter(n=>n.attrs?.some(a=>a.name==='class'&&a.value==='breadcrumb-separator')).every(n=>n.attrs.some(a=>a.name==='aria-hidden'&&a.value==='true')));
 }
});
test('all mapped pages respond with their own HTML over the local HTTP server',async()=>{
 const outcomes=[];
 for(let offset=0;offset<navigationMap.length;offset+=4)outcomes.push(...await Promise.all(navigationMap.slice(offset,offset+4).map(async row=>{
  const res=await fetch('http://127.0.0.1:8784'+row.url);assert.equal(res.status,200,row.url);const html=await res.text();
  assert.ok(html.includes(`href="${row.canonical}"`),row.url);assert.ok(html.includes('<h1'),row.url);assert.ok(!/captcha|verify you are human/i.test(html),row.url);return row.url;
 })));assert.equal(outcomes.length,102);
});
