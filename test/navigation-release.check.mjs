import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {navigationMap} from '../src/navigation-paths.mts';
test('production build matches the approved local candidate without preview-only behavior',()=>{
 for(const row of navigationMap){
  const candidate=readFileSync('.local-admin/navigation-preview'+row.url+'index.html','utf8').replace('<html data-navigation-preview ','<html ');
  const release=readFileSync('dist'+row.url+'index.html','utf8');
  assert.ok(release===candidate,'production/candidate mismatch: '+row.url);
 }
 assert.ok(!readFileSync('dist/robots.txt','utf8').includes('Disallow: /\n'));
});
