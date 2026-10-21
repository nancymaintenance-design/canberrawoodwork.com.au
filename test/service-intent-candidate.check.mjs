import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from 'parse5';
import {execFileSync} from 'node:child_process';
// Legacy tests rebuild intermediate dist; always test against the actual release build.
execFileSync(process.execPath,['build.mjs'],{stdio:'pipe',env:{...process.env,SERVICE_INTENT_SKIP_RELEASE:'1'}});
const feature=await import('../src/service-intent-candidate.mts').catch(()=>null);
const all=html=>{const list=[];function visit(n){if(n.tagName)list.push(n);n.childNodes?.forEach(visit);}visit(parse(html));return list;};
const attr=(n,k)=>n.attrs.find(a=>a.name===k)?.value;
test('six existing bilingual service routes get working on-page targets, not new service URLs',()=>{
 assert.ok(feature,'service intent candidate is missing');assert.equal(feature.intentRoutes.length,6);
 for(const route of feature.intentRoutes){
  const input=readFileSync('dist'+route+'index.html','utf8'),html=feature.applyServiceIntent(route,input),nodes=all(html);
  const nav=nodes.find(n=>attr(n,'class')==='service-page-jump');assert.ok(nav,route);
  const links=all('<body>'+html.slice(html.indexOf('<nav class="service-page-jump"'),html.indexOf('</nav>',html.indexOf('<nav class="service-page-jump"'))+6)+'</body>').filter(n=>n.tagName==='a');
  assert.deepEqual(links.map(n=>attr(n,'href')),['#repair-needs','#repair-details','#repair-photos','#service-questions','#repair-enquiry']);
  for(const link of links)assert.equal(nodes.filter(n=>attr(n,'id')===attr(link,'href').slice(1)).length,1,route);
  assert.ok(html.includes(`href="${route.startsWith('/zh/')?'/zh':''}/contact/"`));
 }
});
test('existing metadata, images, H1 and all non-target routes stay unchanged',()=>{
 assert.ok(feature);
 for(const route of feature.intentRoutes){const before=readFileSync('dist'+route+'index.html','utf8'),after=feature.applyServiceIntent(route,before);
  for(const tag of[/<h1\b[^>]*>[\s\S]*?<\/h1>/g,/<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>/g,/<img\b[^>]*>/g])assert.deepEqual(after.match(tag),before.match(tag));
  assert.equal(feature.applyServiceIntent(route,after),after);
 }
 assert.equal(feature.applyServiceIntent('/services/deck-repairs/','unchanged'),'unchanged');
});
