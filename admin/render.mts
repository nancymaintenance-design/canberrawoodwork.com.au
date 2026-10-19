import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import type {Catalog,State,Field,Edit} from './model.mts';
import {pending} from './store.mts';
import {getCatalog} from './catalog.mts';
import {buildKnowledgeFeeds} from '../src/chinese-feed.mjs';
const escape=(v:string)=>v.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function validateValue(field:Field,value:string):void{
 if(!value.trim()||value.length>20000)throw Error('Content must contain 1–20000 characters');
 if(field.kind==='link'&&!/^(?:\/(?!\/)|#[\w-]+$|https:\/\/|mailto:[^\s]+@|tel:\+?\d)/i.test(value))throw Error('Invalid link: use a site path, https, mailto or tel');
 if(field.kind==='image'&&(!/^\/assets\/[A-Za-z0-9_./ -]+\.(?:webp|png|jpe?g|gif)$/i.test(value)||value.includes('..')))throw Error('Invalid image path');
}
export function renderPages(catalog:Catalog,state:State,mode:'preview'|'release'):Map<string,string>{
 if(mode==='release'&&pending(state).length)throw Error('English synchronization pending');
 const pages=new Map<string,string>();
 const replacements=new Map<string,Array<{start:number;end:number;value:string}>>();
 const schemaChanges=new Map<string,Map<string,string>>();
 for(const[id,edit]of Object.entries(state.edits)){
  const field=catalog.fields[id];if(!field)throw Error('Unknown content field: '+id);
  if(field.zh!==edit.originalZh||field.en!==edit.originalEn)throw Error('Source content changed; review draft before applying: '+id);
  validateValue(field,edit.zh);validateValue(field,edit.en);
  for(const occurrence of field.occurrences){for(const lang of ['en','zh'] as const){
   const route=(lang==='zh'?'/zh':'')+occurrence.route;
   let value=edit[lang];
   if(field.kind==='link'&&value.startsWith('/')&&!value.startsWith('/assets/'))value=lang==='zh'?(value.startsWith('/zh/')?value:'/zh'+value):value.replace(/^\/zh\//,'/');
   const span=occurrence[lang];let rendered=escape(value);
   if(field.kind==='text')rendered=(span.raw.match(/^\s*/)?.[0]||'')+rendered+(span.raw.match(/\s*$/)?.[0]||'');
   const list=replacements.get(route)||[];list.push({...span,value:rendered});replacements.set(route,list);
   if(field.kind==='text'||field.attr==='content'||field.attr==='alt'){
    const changes=schemaChanges.get(route)||new Map<string,string>();changes.set(field[lang],value);schemaChanges.set(route,changes);
   }
  }}
 }
 for(const[route,html]of Object.entries(catalog.html)){for(const lang of ['en','zh'] as const){
  const key=(lang==='zh'?'/zh':'')+route;let result=html[lang];
  const patches=(replacements.get(key)||[]).sort((a,b)=>b.start-a.start);let previous=Infinity;
  for(const patch of patches){if(patch.end>previous)throw Error('Overlapping content fields');result=result.slice(0,patch.start)+patch.value+result.slice(patch.end);previous=patch.start;}
  if(patches.length){
   const changes=schemaChanges.get(key)||new Map();
   const walk=(v:unknown):unknown=>Array.isArray(v)?v.map(walk):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,typeof x==='string'&&['name','headline','description','caption','serviceType'].includes(k)?changes.get(x)||x:walk(x)])):v;
   result=result.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(_,a:string,b:string,c:string)=>a+JSON.stringify(walk(JSON.parse(b))).replaceAll('<','\\u003c')+c);
   result=result.replace(/<img\b[^>]*>/g,tag=>tag.includes('/assets/uploads/')?tag.replace(/(?:srcset|data-srcset)="[^"]*"/g,''):tag);
   result=result.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/g,tag=>{const src=tag.match(/<img[^>]*src="(\/assets\/uploads\/[^"]+)"/)?.[1];return src?tag.replace(/(<source\b[^>]*srcset=")[^"]*(")/g,'$1'+src+'$2'):tag;});
  }pages.set(key,result);
 }}return pages;
}
export function writeManaged(dist:string,catalog:Catalog,state:State,mode:'preview'|'release'):void{
 let pages=renderPages(catalog,state,mode);
 if(Object.keys(state.edits).length){
  const originalLayout=pages;
  const changedRoutes=new Set(Object.keys(state.edits).flatMap(id=>(catalog.fields[id]?.occurrences||[]).flatMap(o=>[o.route,'/zh'+o.route])));
  const english=buildKnowledgeFeeds(pages,{name:'Ellis Services Group'});const chinese=buildKnowledgeFeeds(english.pages,{name:'Ellis Services Group',prefix:'/zh',language:'zh-Hans'});pages=chinese.pages;
  // Keep unrelated pages byte-identical and retain every original head position.
  // Updated article prose only needs its own regenerated embedded feed payload.
  const block=/<script id="llm-knowledge-feed" type="application\/json">[\s\S]*?<\/script>/;
  for(const[route,html]of originalLayout){const updated=changedRoutes.has(route)?pages.get(route)?.match(block)?.[0]:undefined;pages.set(route,updated?html.replace(block,()=>updated):html);}
  for(const[prefix,feed]of [['',english.feed],['zh/',chinese.feed]] as const){mkdirSync(join(dist,prefix,'feeds'),{recursive:true});writeFileSync(join(dist,prefix,'feeds','llm-knowledge.json'),JSON.stringify(feed,null,2)+'\n');}
 }
 for(const[route,html]of pages){const path=join(dist,route.slice(1),'index.html');mkdirSync(dirname(path),{recursive:true});writeFileSync(path,html);}
}
export function applyApproved(dist:string,root:string):void{
 const path=join(root,'content','approved.json');if(!existsSync(path))return;
 const approved=JSON.parse(readFileSync(path,'utf8')) as {edits:Record<string,Edit>};if(!Object.keys(approved.edits).length)return;
 writeManaged(dist,getCatalog(dist),{schemaVersion:1,version:0,edits:approved.edits,history:[]},'release');
}
