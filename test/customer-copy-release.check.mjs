import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {parse} from 'parse5';
import {getCatalog} from '../admin/catalog.mts';
const root=process.cwd(),dist=join(root,'dist');
execFileSync(process.execPath,['build.mjs'],{env:{...process.env,CUSTOMER_COPY_SKIP_RELEASE:'1'},stdio:'pipe'});
const routes=[...readFileSync(join(dist,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const baseline=new Map(routes.map(route=>[route,readFileSync(join(dist,route.slice(1),'index.html'),'utf8')]));
const assets=new Map(readdirSync(join(dist,'assets')).filter(n=>n.endsWith('.css')||['site.js','site-zh.js'].includes(n)).map(n=>[n,readFileSync(join(dist,'assets',n),'utf8')]));
const discovery=new Map(['sitemap.xml','robots.txt'].map(n=>[n,readFileSync(join(dist,n),'utf8')]));
execFileSync(process.execPath,['build.mjs'],{env:{...process.env,CUSTOMER_COPY_SKIP_RELEASE:'0'},stdio:'pipe'});
const signature=html=>{const values=[];const walk=n=>{if(n.tagName){values.push([n.tagName,n.attrs.filter(a=>!['alt','title','placeholder','aria-label'].includes(a.name)&&!(n.tagName==='meta'&&a.name==='content'&&n.attrs.some(a=>['description','og:description','twitter:description','og:title','twitter:title','og:image:alt','twitter:image:alt'].includes(a.value))))]);if(n.tagName==='h1')values.push(n.childNodes.map(c=>c.value||'').join(''));}if(n.childNodes)n.childNodes.forEach(walk);};walk(parse(html));return values;};
test('all 102 released pages retain UI structure, H1, images, links, language mapping and forms',()=>{
 assert.equal(routes.length,102);
 for(const route of routes){const after=readFileSync(join(dist,route.slice(1),'index.html'),'utf8');assert.deepEqual(signature(after),signature(baseline.get(route)),route);for(const m of after.matchAll(/<script\b[^>]*type="application\/(?:ld\+json|json)"[^>]*>([\s\S]*?)<\/script>/g))assert.doesNotThrow(()=>JSON.parse(m[1]),route);}
 for(const[name,original]of assets)if(name.endsWith('.css'))assert.equal(readFileSync(join(dist,'assets',name),'utf8'),original,name);
 for(const[name,original]of discovery)assert.equal(readFileSync(join(dist,name),'utf8'),original,name);
});
test('every approved bilingual copy field is present in the production build',()=>{
 const state=JSON.parse(readFileSync(join(root,'content/customer-first-copy-release.json'),'utf8')),catalog=getCatalog(dist);
 assert.equal(Object.keys(state.edits).length,286);
 for(const[id,e]of Object.entries(state.edits)){assert.equal(catalog.fields[id].en,e.en,id+' en');assert.equal(catalog.fields[id].zh,e.zh,id+' zh');}
 for(const prefix of ['','zh/'])assert.equal(JSON.parse(readFileSync(join(dist,prefix,'feeds/llm-knowledge.json'),'utf8')).items.length,17);
});
test('runtime changes consist only of the approved bilingual success messages',()=>{
 for(const name of ['site.js','site-zh.js']){const messages=name==='site.js'?['Thanks — your enquiry has been sent. We will be in touch soon.','Thanks — your enquiry has been sent. Our team will contact you to discuss the work. An appointment still needs to be confirmed.']:['感谢您的咨询，信息已提交。我们会与您联系。','感谢您的咨询，信息已提交。团队会与您沟通施工需求，预约仍需双方确认。'];assert.equal(readFileSync(join(dist,'assets',name),'utf8'),assets.get(name).replace(messages[0],messages[1]));}
});
