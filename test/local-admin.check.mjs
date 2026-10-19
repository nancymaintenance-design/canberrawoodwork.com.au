import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync,cpSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createRequire} from 'node:module';
const store=await import('../admin/store.mts').catch(()=>null);
const renderer=await import('../admin/render.mts').catch(()=>null);
test('local edits persist, reject stale saves and invalidate English after a Chinese change',()=>{
 assert.equal(typeof store?.saveDraft,'function','local draft store is not implemented');
 const root=mkdtempSync(join(tmpdir(),'ellis-admin-test-'));
 try{
  let state=store.saveDraft(root,'page:title','新标题',0,'旧标题','Old title');
  assert.equal(state.version,1);assert.equal(state.edits['page:title'].zh,'新标题');
  assert.equal(store.readState(root).edits['page:title'].zh,'新标题');
  assert.throws(()=>store.saveDraft(root,'page:title','冲突',0,'旧标题','Old title'),/conflict/);
  assert.equal(store.pending(state).length,1);
  state=store.syncEnglish(root,'page:title','New title',1);
  assert.equal(store.pending(state).length,0);
  state=store.saveDraft(root,'page:title','再次修改',2,'旧标题','Old title');
  assert.equal(store.pending(state).length,1);
  state=store.restore(root,1,3);assert.equal(state.edits['page:title'].zh,'新标题');
 }finally{rmSync(root,{recursive:true,force:true});}
});

test('release validation rejects missing links, anchors and changed source fields',async()=>{
 const {validateSite}=await import('../admin/validate.mts');const{getCatalog}=await import('../admin/catalog.mts');const catalog=getCatalog('dist');
 assert.doesNotThrow(()=>validateSite('dist',renderer.renderPages(catalog,{schemaVersion:1,version:0,edits:{},history:[]},'release')));
 assert.throws(()=>validateSite('dist',new Map([['/','<a href="/missing-page/">Missing</a>']])),/Missing local/);
 assert.throws(()=>validateSite('dist',new Map([['/','<a href="#missing">Missing</a>']])),/Broken anchor/);
 const field=Object.values(catalog.fields).find(f=>!f.shared&&f.tag==='h1'&&f.kind==='text');
 const edit={zh:'中文',en:'English',zhRevision:1,enRevision:1,originalZh:'outdated source',originalEn:field.en};
 assert.throws(()=>renderer.renderPages(catalog,{schemaVersion:1,version:1,edits:{[field.id]:edit},history:[]},'release'),/Source content changed/);
});

test('contact TypeScript endpoint retains validation and sends only to the original recipient (mocked)',async()=>{
 const contact=createRequire(import.meta.url)('../api/contact.ts');const previous=globalThis.fetch;
 const oldKey=process.env.RESEND_API_KEY,oldFrom=process.env.RESEND_FROM_EMAIL;let sent;
 const call=async request=>{let code,data;await contact(request,{setHeader(){},status(value){code=value;return{json(value){data=value;}};}});return{code,data};};
 try{
  assert.equal((await call({method:'GET'})).code,405);assert.equal((await call({method:'POST',body:{}})).code,400);
  process.env.RESEND_API_KEY='test-only-not-a-secret';process.env.RESEND_FROM_EMAIL='test@example.invalid';
  globalThis.fetch=async(url,options)=>{sent={url,body:JSON.parse(options.body)};return{ok:true,json:async()=>({id:'mock-only'})};};
  const result=await call({method:'POST',body:{name:'Test <only>',email:'test@example.invalid',message:'Local mock, never sent'}});
  assert.equal(result.code,200);assert.equal(result.data.id,'mock-only');assert.deepEqual(sent.body.to,['brian@elliservices.com.au']);assert.match(sent.body.html,/Test &lt;only&gt;/);
 }finally{globalThis.fetch=previous;if(oldKey===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=oldKey;if(oldFrom===undefined)delete process.env.RESEND_FROM_EMAIL;else process.env.RESEND_FROM_EMAIL=oldFrom;}
});

test('edited article headings agree with both feeds and structured data',async()=>{
 const{getCatalog}=await import('../admin/catalog.mts');const catalog=getCatalog('dist');const field=Object.values(catalog.fields).find(f=>f.tag==='h1'&&f.kind==='text'&&/^\/news\/[^/]+\/$/.test(f.occurrences[0].route));
 const root=mkdtempSync(join(tmpdir(),'ellis-feed-edit-'));try{let state=store.saveDraft(root,field.id,'本地案例测试标题',0,field.zh,field.en);state=store.syncEnglish(root,field.id,'Local article test heading',state.version);renderer.writeManaged(root,catalog,state,'release');
  const route=field.occurrences[0].route;for(const[prefix,title]of [['','Local article test heading'],['zh/','本地案例测试标题']]){const feed=JSON.parse(readFileSync(join(root,prefix,'feeds/llm-knowledge.json'),'utf8'));const item=feed.items.find(i=>new URL(i.url).pathname===(prefix?'/zh':'')+route);assert.equal(item.title,title);const html=readFileSync(join(root,prefix,route.slice(1),'index.html'),'utf8');assert.ok(html.includes('"headline":"'+title+'"'));}
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('rendering changes only the selected occurrence and blocks release with stale English',async()=>{
 assert.equal(typeof renderer?.renderPages,'function','content renderer is not implemented');
 const {getCatalog}=await import('../admin/catalog.mts');
 const catalog=getCatalog('dist');const field=Object.values(catalog.fields).find(f=>!f.shared&&f.tag==='h1'&&f.kind==='text');assert.ok(field);
 const root=mkdtempSync(join(tmpdir(),'ellis-render-test-'));
 try{
  let state=store.saveDraft(root,field.id,'测试标题',0,field.zh,field.en);
  const pages=renderer.renderPages(catalog,state,'preview');const route=field.occurrences[0].route;
  assert.ok(pages.get('/zh'+route).includes('测试标题'));
  const other=Object.keys(catalog.html).find(r=>r!==route);assert.equal(pages.get('/zh'+other),catalog.html[other].zh);
  assert.throws(()=>renderer.renderPages(catalog,state,'release'),/pending/);
  state=store.syncEnglish(root,field.id,'Test heading',1);
  assert.ok(renderer.renderPages(catalog,state,'release').get(route).includes('Test heading'));
  assert.throws(()=>renderer.validateValue({...field,kind:'link'},'javascript:alert(1)'),/link/);
  assert.throws(()=>renderer.validateValue({...field,kind:'image'},'/../../secret'),/image/);
 }finally{rmSync(root,{recursive:true,force:true});}
});

test('approved six-page content release matches reviewed bilingual output without rewriting other pages',async()=>{
 const {getCatalog}=await import('../admin/catalog.mts');const {createHash}=await import('node:crypto');
 const expected=JSON.parse(readFileSync(new URL('./seo-release-baseline.json',import.meta.url),'utf8'));
 const approved=JSON.parse(readFileSync(new URL('../content/approved.json',import.meta.url),'utf8'));
 assert.equal(Object.keys(approved.edits).length,34);
 const catalog=getCatalog('dist'),root=mkdtempSync(join(tmpdir(),'ellis-seo-release-'));
 try{cpSync('dist/404',join(root,'404'),{recursive:true});cpSync('dist/zh/404',join(root,'zh/404'),{recursive:true});renderer.writeManaged(root,catalog,{schemaVersion:1,version:1,edits:approved.edits,history:[]},'release');
  for(const[path,digest]of Object.entries(expected))assert.equal(createHash('sha256').update(readFileSync(join(root,path))).digest('hex'),digest,path);
 }finally{rmSync(root,{recursive:true,force:true});}
});
