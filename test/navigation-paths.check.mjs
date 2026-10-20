import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const feature=await import('../src/navigation-paths.mts').catch(()=>null);
test('a window repair guide returns to the actual service in both languages',()=>{
 assert.equal(typeof feature?.getTrail,'function','explicit service navigation is not implemented');
 assert.deepEqual(feature.getTrail('/news/rotten-window-sill/').map(x=>x.url),['/','/services/timber-window-repairs/','/news/rotten-window-sill/']);
 assert.deepEqual(feature.getTrail('/zh/news/rotten-window-sill/').map(x=>x.url),['/zh/','/zh/services/timber-window-repairs/','/zh/news/rotten-window-sill/']);
});
test('cross-service guides keep an honest News hierarchy; city business intent stays on Home',()=>{
 assert.ok(feature,'explicit map required');
 assert.deepEqual(feature.getTrail('/news/carpentry-quote-cost-factors/').map(x=>x.url),['/','/news/','/news/carpentry-quote-cost-factors/']);
 assert.equal(feature.navigationMap.find(x=>x.url==='/').commercial_owner_url,'/');
 assert.deepEqual(feature.getTrail('/'),[]);
});
test('every public route has a paired language, known owner, parent and acyclic trail',()=>{
 assert.ok(feature,'explicit map required');assert.equal(feature.navigationMap.length,102);
 assert.deepEqual(feature.validateMap(feature.navigationMap),[]);
 const broken=structuredClone(feature.navigationMap);broken.find(x=>x.url==='/services/timber-window-repairs/').primary_parent_url='/news/rotten-window-sill/';
 assert.ok(feature.validateMap(broken).some(x=>x.includes('cycle')));
 const wrong=structuredClone(feature.navigationMap);wrong.find(x=>x.url==='/zh/news/rotten-window-sill/').primary_parent_url='/services/timber-window-repairs/';
 assert.ok(feature.validateMap(wrong).some(x=>x.includes('locale')));
 const invalidOwner=structuredClone(feature.navigationMap);invalidOwner.find(x=>x.url==='/news/rotten-window-sill/').commercial_owner_url='/about/';
 assert.ok(feature.validateMap(invalidOwner).some(x=>x.includes('owner type')));
});
test('raw HTML contains real ancestor anchors and one consistent schema, retaining business markup',()=>{
 assert.ok(feature,'renderer required');const before=readFileSync('dist/zh/news/rotten-window-sill/index.html','utf8'),after=feature.applyNavigation('/zh/news/rotten-window-sill/',before);
 assert.match(after,/<ol[ >]/);assert.match(after,/href="https:\/\/www.canberrawoodwork.com.au\/zh\/services\/timber-window-repairs\/"/);
 assert.equal((after.match(/"@type":"BreadcrumbList"/g)||[]).length,1);
 assert.match(after,/aria-current="page"/);assert.match(after,/"@type":"Article"/);
 assert.equal(after.match(/<link rel="canonical"[^>]+>/)?.[0],before.match(/<link rel="canonical"[^>]+>/)?.[0]);
 assert.equal(feature.applyNavigation('/zh/news/rotten-window-sill/',after),after);
});
