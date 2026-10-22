import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {bilingualPages} from '../src/localization.mjs';
const root=new URL('../',import.meta.url);
const node=(...args)=>execFileSync(process.execPath,args,{cwd:root,encoding:'utf8'});
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'});
const hash=value=>createHash('sha256').update(value).digest('hex');
const snapshot=()=>{
 const files=new Map();function walk(dir,prefix=''){for(const f of readdirSync(dir,{withFileTypes:true})){const key=prefix+f.name,path=join(dir,f.name);if(f.isDirectory())walk(path,key+'/');else files.set(key,readFileSync(path));}}walk(fileURLToPath(new URL('../dist/',import.meta.url)));return files;
};
node('build.mjs','--english-only');const before=snapshot();
node('build.mjs');const after=snapshot();
const html=map=>[...map].filter(([p])=>p.endsWith('/index.html')||p==='index.html');
const withoutLanguageAdditions=value=>value
 .replace(/<a class="language-switch"[^>]*>中文服务<\/a>/g,'')
 .replace(/<link rel="alternate" hreflang="(?:en-AU|zh-Hans|x-default)"[^>]*>/g,'')
 .replace('<link rel="stylesheet" href="/assets/bilingual.css">','')
 .replace('<script defer src="/assets/language-switch.js"></script>','');

test('TypeScript migration preserves production HTML bytes and stylesheet text across checkout platforms',()=>{
 const expected=JSON.parse(readFileSync(new URL('./production-baseline.json',import.meta.url),'utf8'));
 for(const[path,digest]of Object.entries(expected)){
  let value=after.get(path);
  if(path.endsWith('.html'))value=Buffer.from(value.toString().replace(/<link rel="alternate" type="application\/rss\+xml" title="(?:Canberra Woodwork knowledge feed|Canberra Woodwork 中文知识内容)" href="https:\/\/www.canberrawoodwork.com.au\/(?:zh\/)?rss.xml">/g,''));
  assert.equal(hash(path.endsWith('.css')?value.toString().replaceAll('\r\n','\n'):value),digest,path);
 }
});
test('every English page preserves every original byte except the explicit language additions',()=>{
 assert.equal(html(before).length,52);
 for(const[path,original]of html(before))assert.equal(withoutLanguageAdditions(after.get(path).toString()),original.toString(),path);
});
test('all original styles, scripts, images, English feed and discovery files are unchanged',()=>{
 for(const[path,original]of before){
  if(path.endsWith('.html')||path==='sitemap.xml')continue;
  assert.equal(hash(after.get(path)),hash(original),path);
 }
 const sitemap=after.get('sitemap.xml').toString().replace(/<url><loc>[^<]*\/zh\/[^<]*<\/loc><\/url>/g,'');
 assert.equal(sitemap,before.get('sitemap.xml').toString());
});
test('all Chinese counterparts preserve page structure and project photographs',()=>{
 for(const[path,original]of html(before)){
  const zh=after.get('zh/'+path)?.toString();assert.ok(zh,path);
  assert.match(zh,/<html lang="zh-Hans">/);
  for(const tag of ['h1','h2','h3','p','section','details','img','form','input','select','textarea']){
   const re=new RegExp('<'+tag+'(?=[\\s>])','g');
   const offset=tag==='input'?(original.toString().match(/<form class="enquiry-form"/g)||[]).length:0;
   assert.equal((zh.match(re)||[]).length,(original.toString().match(re)||[]).length+offset,path+' '+tag);
  }
  const photos=value=>[...value.matchAll(/<img\b[^>]*>/g)].map(m=>[...m[0].matchAll(/(?:src|srcset|data-src|data-srcset|width|height)="[^"]*"/g)].map(a=>a[0]).join(' '));
  assert.deepEqual(photos(zh),photos(original.toString()),path);
 }
});
test('language metadata, navigation and Chinese feed match the corresponding routes',()=>{
 const urls=[...after.get('sitemap.xml').toString().matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);assert.equal(urls.length,102);assert.equal(urls.filter(u=>u.includes('/zh/')).length,51);
 for(const[path]of html(before)){
  const route=path==='index.html'?'/':'/'+path.replace(/index.html$/,'');const en=after.get(path).toString(),zh=after.get('zh/'+path).toString();
  assert.ok(en.includes(`href="/zh${route}" lang="zh-Hans"`),route);
  assert.ok(zh.includes(`href="${route}" lang="en-AU"`),route);
  assert.ok(zh.includes(`rel="canonical" href="https://www.canberrawoodwork.com.au/zh${route}"`),route);
  if(route!=='/404/')for(const lang of ['en-AU','zh-Hans','x-default']){assert.ok(en.includes(`hreflang="${lang}"`));assert.ok(zh.includes(`hreflang="${lang}"`));}
 }
 const feed=JSON.parse(after.get('zh/feeds/llm-knowledge.json'));assert.equal(feed.language,'zh-Hans');assert.equal(feed.items.length,17);
 for(const item of feed.items){assert.ok(item.url.includes('/zh/news/'));assert.match(item.content_text,/[\u4e00-\u9fff]/);}
});
test('missing translations block publication and Chinese runtime remains valid JavaScript',()=>{
 const catalog=JSON.parse(readFileSync(new URL('../src/locales/zh-Hans.json',import.meta.url),'utf8'));
 assert.throws(()=>bilingualPages(new Map([['/','<html lang="en-AU"><head></head><body><p>untranslated source regression probe</p></body></html>']]),catalog,{origin:'https://www.canberrawoodwork.com.au'}),/missing\/stale/);
 assert.doesNotThrow(()=>new Function(after.get('assets/site-zh.js').toString()));
});
