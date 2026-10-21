import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const root=process.cwd();
const snapshot=(dir,prefix='')=>new Map(readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?[...snapshot(join(dir,f.name),prefix+f.name+'/')]:[[prefix+f.name,readFileSync(join(dir,f.name))]]));
execFileSync(process.execPath,['build.mjs'],{stdio:'pipe',env:{...process.env,CMS_SKIP_APPROVED:'0',PRIVACY_DESIGN_SKIP_RELEASE:'1'}});
const before=snapshot('dist');
execFileSync(process.execPath,['build.mjs'],{stdio:'pipe',env:{...process.env,CMS_SKIP_APPROVED:'0',PRIVACY_DESIGN_SKIP_RELEASE:'0'}});
const after=snapshot('dist');
const pages=['privacy/index.html','zh/privacy/index.html'];
test('only both privacy pages change; all existing pages, forms, assets and discovery files retain bytes',()=>{
 const changed=[...before].filter(([name,bytes])=>!bytes.equals(after.get(name))).map(([name])=>name);
 assert.deepEqual(changed.sort(),pages.sort());assert.equal(after.size,before.size);
});
test('privacy design retains all policy paragraphs, H1, metadata, original header/footer and same-page language switch',()=>{
 for(const name of pages){
  const a=before.get(name).toString(),b=after.get(name).toString();
  const match=(html,re)=>html.match(re)?.[0];
  for(const re of [/<header\b[\s\S]*?<\/header>/,/<footer\b[\s\S]*?<\/footer>/,/<title>[\s\S]*?<\/title>/,/<link rel="canonical"[^>]*>/])assert.equal(match(b,re),match(a,re),name);
  assert.equal(match(b,/<head>[\s\S]*?<\/head>/).replace('<link rel="stylesheet" href="/assets/privacy-design.css"><script defer src="/assets/privacy-design.js"></script>',''),match(a,/<head>[\s\S]*?<\/head>/));
  assert.equal(b.match(/<h1[^>]*>(.*?)<\/h1>/)[1],a.match(/<h1[^>]*>(.*?)<\/h1>/)[1]);
  const paras=html=>[...html.matchAll(/<p(?:\s[^>]*)?>[\s\S]*?<\/p>/g)].map(m=>m[0].replace(/<p[^>]*>/,'<p>'));
  assert.deepEqual(paras(b),paras(a),name+' paragraphs');
  const headings=html=>[...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map(m=>m[1]);assert.deepEqual(headings(b),headings(a));
  assert.equal((b.match(/class="craft-section"/g)||[]).length,4);
  assert.doesNotMatch(b,/\/site\/|127\.0\.0\.1|noindex|react/i);
  assert.match(b,new RegExp('class="language-switch" href="'+(name.startsWith('zh/')?'/privacy/':'/zh/privacy/')));
 }
});
test('privacy assets and script are available without replacing shared runtime or introducing a write request',()=>{
 for(const name of ['assets/privacy-design.css','assets/privacy-design.js','assets/privacy-design/privacy-hero.webp','assets/privacy-design/workbench-sidebar.webp'])assert.ok(after.get(name)?.length,name);
 const js=after.get('assets/privacy-design.js').toString();assert.doesNotThrow(()=>new Function(js));assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|submit/);
});
