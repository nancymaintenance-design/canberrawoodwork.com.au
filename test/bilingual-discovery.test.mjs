import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {applyBilingualDiscovery} from '../src/bilingual-discovery.mts';

const origin='https://www.canberrawoodwork.com.au';
const english=`# Ellis Services Group\n\n> Canberra carpentry and timber repair services.\n\nPhone: 0405 878 406\nEmail: brian@elliservices.com.au\n\nLast updated: 2026-10-22\n\n## Core pages\n- [Home](${origin}/): Existing English description.\n`;
const page=(canonical=origin+'/zh/',lang='zh-Hans')=>`<html lang="${lang}"><head><link rel="canonical" href="${canonical}"><meta name="description" content="木工 &amp; 维修：按实际范围报价。"></head><body><h1>我们提供木工服务</h1></body></html>`;
function fixture(run){const root=mkdtempSync(join(tmpdir(),'cww-discovery-'));try{writeFileSync(join(root,'llms.txt'),english);run(root);}finally{rmSync(root,{recursive:true,force:true});}}
test('Chinese discovery uses final decoded metadata and keeps English entries and contact details',()=>fixture(root=>{
 mkdirSync(join(root,'zh'));writeFileSync(join(root,'zh/index.html'),page());
 applyBilingualDiscovery(root);
 const en=readFileSync(join(root,'llms.txt'),'utf8'),zh=readFileSync(join(root,'zh/llms.txt'),'utf8');
 assert.ok(en.startsWith(english));assert.match(en,/Chinese version: https:\/\/www.canberrawoodwork.com.au\/zh\/llms.txt/);
 assert.match(zh,/\[我们提供木工服务\]\(https:\/\/www.canberrawoodwork.com.au\/zh\/\): 木工 & 维修/);
 assert.match(zh,/电话：0405 878 406/);assert.match(zh,/邮箱：brian@elliservices.com.au/);
 assert.match(zh,/最近更新：2026-10-22/);assert.match(zh,/## 核心页面/);
 applyBilingualDiscovery(root);assert.equal(readFileSync(join(root,'llms.txt'),'utf8'),en);assert.equal(readFileSync(join(root,'zh/llms.txt'),'utf8'),zh);
}));
test('English-only verification does not require or create Chinese pages',()=>fixture(root=>{
 applyBilingualDiscovery(root);assert.ok(readFileSync(join(root,'llms.txt'),'utf8').startsWith(english));
}));
test('wrong-language, wrong-canonical and withdrawn Chinese entries fail the build',()=>{
 for(const html of [page(origin+'/'),page(origin+'/zh/','en-AU'),page().replace('</head>','<meta name="robots" content="noindex"></head>')])fixture(root=>{
  mkdirSync(join(root,'zh'));writeFileSync(join(root,'zh/index.html'),html);assert.throws(()=>applyBilingualDiscovery(root),/language|canonical|Non-public/);
 });
});
