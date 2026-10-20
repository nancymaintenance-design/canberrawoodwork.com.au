import test from 'node:test';
import assert from 'node:assert/strict';
const module=await import('../src/navigation-metrics.mts').catch(()=>null);
test('click distance follows actual anchors, not URL segments',()=>{
 assert.ok(module,'graph metrics missing');
 const pages=new Map([['/','<main><a href="/deep/a/b/">A</a></main>'],['/deep/a/b/','<main><a href="/service/">B</a></main>'],['/service/','<main></main>']]);
 const result=module.measureGraph(pages,['/service/'],'/');assert.equal(result[0].click_distance,2);
});
test('repeated anchors count only one source per category',()=>{
 assert.ok(module,'graph metrics missing');
 const result=module.measureGraph(new Map([['/','<main><a href="/service/">One</a><a href="/service/">Two</a></main>'],['/service/','<main></main>']]),['/service/'],'/');
 assert.equal(result[0].sources.body,1);assert.equal(result[0].source_pages,1);
});
