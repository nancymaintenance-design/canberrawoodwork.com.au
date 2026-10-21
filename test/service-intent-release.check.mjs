import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {navigationMap} from '../src/navigation-paths.mts';
import {applyServiceIntent} from '../src/service-intent-candidate.mts';
test('production release changes only approved service output and matches the local preview when available',()=>{
 execFileSync(process.execPath,['build.mjs'],{stdio:'pipe',env:{...process.env,SERVICE_INTENT_SKIP_RELEASE:'1'}});
 const baseline=new Map(navigationMap.map(row=>[row.url,readFileSync('dist'+row.url+'index.html','utf8')]));
 execFileSync(process.execPath,['build.mjs'],{stdio:'pipe'});
 for(const row of navigationMap){
  const actual=readFileSync('dist'+row.url+'index.html','utf8');
  assert.ok(actual===applyServiceIntent(row.url,baseline.get(row.url)),'Unexpected release output: '+row.url);
  const preview='.local-admin/service-intent-preview'+row.url+'index.html';
  if(existsSync(preview))assert.ok(actual===readFileSync(preview,'utf8').replace('<html data-navigation-preview ','<html '),'Production differs from approved preview: '+row.url);
 }
 assert.equal(readFileSync('dist/assets/service-intent-candidate.css','utf8'),readFileSync('content/service-intent-candidate.css','utf8'));
 assert.ok(!readFileSync('dist/robots.txt','utf8').includes('Disallow: /\n'));
});
