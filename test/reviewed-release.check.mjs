import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {validateSite} from '../admin/validate.mts';
test('production output matches all approved bilingual pages and feeds',()=>{
 const expected=JSON.parse(readFileSync(new URL('./reviewed-release-baseline.json',import.meta.url)));
 assert.equal(Object.keys(expected).length,106);
 for(const[file,hash]of Object.entries(expected))assert.equal(createHash('sha256').update(readFileSync(join('dist',file))).digest('hex'),hash,file);
 const routes=[...readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 assert.equal(routes.length,102);const pages=new Map(routes.map(route=>[route,readFileSync(join('dist',route.slice(1),'index.html'),'utf8')]));
 validateSite('dist',pages);
 for(const prefix of['','zh/']){
  const about=readFileSync(join('dist',prefix,'about/index.html'),'utf8');
  assert.doesNotMatch(about,/<img[^>]*src="\/assets\/projects\/oxley-timber-screen-work/);
  const contact=readFileSync(join('dist',prefix,'contact/index.html'),'utf8');assert.match(contact,/class="contact-team-photo"/);assert.match(contact,/action="\/api\/contact"/);
 }
 assert.match(readFileSync('dist/robots.txt','utf8'),/Allow: \//);
 assert.doesNotMatch(readFileSync('dist/robots.txt','utf8'),/Disallow: \//);
});
