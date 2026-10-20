import {readFileSync} from 'node:fs';
import {parse,type DefaultTreeAdapterMap} from 'parse5';
type Node=DefaultTreeAdapterMap['node'];type Element=DefaultTreeAdapterMap['element'];
export interface NavigationRow{page_id:string;url:string;locale:string;page_type:string;service_group:string;commercial_owner_url:string|null;supported_owner_urls:string[];primary_parent_url:string|null;breadcrumb_label:string;alternate_url:string;canonical:string;robots:string;priority:boolean;selection_basis:string}
const config=JSON.parse(readFileSync(new URL('../content/navigation-map.json',import.meta.url),'utf8')) as {origin:string;rows:NavigationRow[]};
export const navigationMap=config.rows;
export const canonicalOrigin=config.origin;
const byUrl=new Map(navigationMap.map(r=>[r.url,r]));
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const json=(v:unknown)=>JSON.stringify(v).replaceAll('<','\\u003c').replaceAll('\u2028','\\u2028').replaceAll('\u2029','\\u2029');
export function validateMap(rows:NavigationRow[]):string[]{
 const errors:string[]=[],map=new Map(rows.map(r=>[r.url,r]));if(map.size!==rows.length)errors.push('duplicate URL');
 for(const r of rows){
  if(!r.breadcrumb_label)errors.push('empty label '+r.url);
  if(r.canonical!==canonicalOrigin+r.url)errors.push('canonical '+r.url);
  if(!map.has(r.alternate_url)||map.get(r.alternate_url)?.alternate_url!==r.url)errors.push('alternate '+r.url);
  for(const owner of [r.commercial_owner_url,...r.supported_owner_urls].filter((x):x is string=>!!x)){
   const target=map.get(owner);if(target&&!['homepage','service-owner'].includes(target.page_type))errors.push('owner type '+r.url);
  }
  if(/noindex/i.test(r.robots))errors.push('non-indexable map entry '+r.url);
  for(const key of[r.primary_parent_url,r.commercial_owner_url,...r.supported_owner_urls].filter((x):x is string=>!!x)){
   const target=map.get(key);if(!target)errors.push('missing target '+key);else if(target.locale!==r.locale)errors.push('locale '+r.url+' -> '+key);
  }
  const seen=new Set<string>();let node:NavigationRow|undefined=r;
  while(node){if(seen.has(node.url)){errors.push('cycle '+r.url);break;}seen.add(node.url);node=node.primary_parent_url?map.get(node.primary_parent_url):undefined;}
 }
 return errors;
}
export function getTrail(url:string):NavigationRow[]{
 const r=byUrl.get(url);if(!r)throw Error('Unmapped route '+url);if(r.page_type==='homepage')return[];
 const trail:NavigationRow[]=[];let node:NavigationRow|undefined=r;const seen=new Set<string>();
 while(node){if(seen.has(node.url))throw Error('Parent cycle');seen.add(node.url);trail.unshift(node);node=node.primary_parent_url?byUrl.get(node.primary_parent_url):undefined;}
 return trail;
}
const link=(r:NavigationRow)=>`<a href="${escape(r.url)}">${escape(r.breadcrumb_label)}</a>`;
export function renderBreadcrumb(url:string):{html:string;schema:unknown|null}{
 const trail=getTrail(url);if(!trail.length)return{html:'',schema:null};const row=trail.at(-1)!;
 const separator='<span class="breadcrumb-separator" aria-hidden="true">›</span>';
 const items=trail.map((r,i)=>`<li>${i?separator:''}${i<trail.length-1?`<a href="${escape(canonicalOrigin+r.url)}" data-breadcrumb-position="${i+1}" data-target-path="${escape(r.url)}">${escape(r.breadcrumb_label)}</a>`:`<span aria-current="page">${escape(r.breadcrumb_label)}</span>`}</li>`).join('');
 const html=`<nav class="breadcrumbs service-breadcrumbs" aria-label="${row.locale==='zh-Hans'?'面包屑导航':'Breadcrumb'}" data-service-breadcrumb data-source-path="${escape(row.url)}" data-locale="${row.locale}" data-owner-id="${escape(row.commercial_owner_url?byUrl.get(row.commercial_owner_url)!.page_id:'')}"><ol>${items}</ol></nav>`;
 const schema={'@context':'https://schema.org','@type':'BreadcrumbList','@id':canonicalOrigin+url+'#breadcrumb',itemListElement:trail.map((r,i)=>({'@type':'ListItem',position:i+1,name:r.breadcrumb_label,item:canonicalOrigin+r.url}))};return{html,schema};
}
function relatedPanel(row:NavigationRow):string{
 const zh=row.locale==='zh-Hans',prefix=zh?'/zh':'',contact=prefix+'/contact/';
 if(row.page_type==='guide'||row.page_type==='case-study'){
  const owners=[...new Set([row.commercial_owner_url,...row.supported_owner_urls].filter((s):s is string=>!!s))].map(s=>byUrl.get(s)!);
  if(!owners.length)return'';
  return`<section class="journey-services" aria-label="${zh?'相关木作服务':'Related carpentry services'}"><p>${zh?'我们提供以下相关服务：':'We can help with:'}</p><ul>${owners.map(r=>`<li>${link(r)}</li>`).join('')}</ul><div class="journey-actions"><a class="text-link" href="${contact}">${zh?'与我们沟通施工需求':'Discuss your job with us'} ↗</a><a href="tel:+61405878406">0405 878 406</a></div></section>`;
 }
 return'';
}
export function applyNavigation(url:string,html:string):string{
 const row=byUrl.get(url);if(!row)throw Error('Unmapped route '+url);if(html.includes('data-navigation-version="1"'))return html;
 const doc=parse(html,{sourceCodeLocationInfo:true}),nodes:Element[]=[];
 function walk(n:Node){if('tagName'in n)nodes.push(n);if('childNodes'in n)for(const c of n.childNodes)walk(c);}walk(doc);
 const has=(n:Element,c:string)=>(n.attrs.find(a=>a.name==='class')?.value||'').split(/\s+/).includes(c);
 const raw=(n:Element)=>html.slice(n.sourceCodeLocation!.startOffset,n.sourceCodeLocation!.endOffset);
 const patches:{start:number;end:number;value:string}[]=[],crumb=renderBreadcrumb(url);
 const old=nodes.filter(n=>n.tagName==='nav'&&has(n,'breadcrumbs'));
 if(old.length>1)throw Error('Conflicting visible paths '+url);
 if(old[0])patches.push({start:old[0].sourceCodeLocation!.startOffset,end:old[0].sourceCodeLocation!.endOffset,value:crumb.html});
 else if(crumb.html)throw Error('Expected visible breadcrumb '+url);
 const clean=(v:unknown):unknown=>{
  if(Array.isArray(v))return v.map(clean).filter(x=>x!==undefined);
  if(v&&typeof v==='object'){
   const obj=v as Record<string,unknown>,types=Array.isArray(obj['@type'])?obj['@type']:[obj['@type']];if(types.includes('BreadcrumbList'))return undefined;
   const result=Object.fromEntries(Object.entries(obj).map(([k,x])=>[k,clean(x)]).filter(([,x])=>x!==undefined));
   if(types.some(t=>['WebPage','ContactPage','AboutPage','CollectionPage'].includes(String(t)))&&crumb.schema)result.breadcrumb={'@id':canonicalOrigin+url+'#breadcrumb'};
   return result;
  }return v;
 };
 for(const script of nodes.filter(n=>n.tagName==='script'&&n.attrs.some(a=>a.name==='type'&&a.value==='application/ld+json'))){
  const value=(script.childNodes as (Node&{value?:string})[]).map(n=>n.value||'').join(''),result=clean(JSON.parse(value));
  patches.push({start:script.sourceCodeLocation!.startOffset,end:script.sourceCodeLocation!.endOffset,value:result===undefined||(Array.isArray(result)&&!result.length)?'':`<script type="application/ld+json">${json(result)}</script>`});
 }
 const panel=relatedPanel(row);
 if(panel){const hero=nodes.find(n=>has(n,'article-hero')||has(n,'page-hero'));if(!hero?.sourceCodeLocation?.endTag)throw Error('Missing hero '+url);patches.push({start:hero.sourceCodeLocation.endTag.startOffset,end:hero.sourceCodeLocation.endTag.startOffset,value:panel});}
 if(row.page_type==='service-owner'){
  const children=navigationMap.filter(r=>r.locale===row.locale&&(r.primary_parent_url===row.url||r.supported_owner_urls.includes(row.url))&&['guide','case-study'].includes(r.page_type));
  if(children.length){const guide=children.filter(r=>r.page_type==='guide'),cases=children.filter(r=>r.page_type==='case-study');const section=`<section class="journey-support"><h2>${row.locale==='zh-Hans'?'相关指南与施工案例':'Guides and project photos'}</h2><div class="journey-support-grid">${[[row.locale==='zh-Hans'?'实用指南':'Practical guides',guide],[row.locale==='zh-Hans'?'施工案例':'Our projects',cases]].filter(([,items])=>(items as NavigationRow[]).length).map(([title,items])=>`<div><h3>${title}</h3><ul>${(items as NavigationRow[]).map(r=>`<li>${link(r)}</li>`).join('')}</ul></div>`).join('')}</div></section>`;
   const body=nodes.find(n=>has(n,'service-content-body'));if(!body?.sourceCodeLocation?.endTag)throw Error('Missing service body '+url);patches.push({start:body.sourceCodeLocation.endTag.startOffset,end:body.sourceCodeLocation.endTag.startOffset,value:section});}
 }
 if(row.page_type==='homepage'||row.page_type==='location'){
  const main=nodes.find(n=>n.tagName==='main')!,existing=new Set(nodes.filter(n=>n.tagName==='a'&&n.sourceCodeLocation!.startOffset>=main.sourceCodeLocation!.startOffset&&n.sourceCodeLocation!.endOffset<=main.sourceCodeLocation!.endOffset).map(n=>{const href=n.attrs.find(a=>a.name==='href')?.value||'';try{return new URL(href,canonicalOrigin).pathname;}catch{return'';}}));
  const targets=navigationMap.filter(r=>r.locale===row.locale&&(r.priority||(row.page_type==='homepage'&&r.page_type==='service-owner'&&r.primary_parent_url===row.url))&&!existing.has(r.url));
  if(targets.length){
   const zh=row.locale==='zh-Hans';
   const actions=row.page_type==='location'?`<div class="journey-actions"><a href="${zh?'/zh':''}/contact/">${zh?'与我们沟通施工需求':'Discuss your job with us'} ↗</a><a href="tel:+61405878406">0405 878 406</a></div>`:'';
   const section=`<section class="journey-directory shell"><h2>${zh?'我们的木作服务':'Our carpentry services'}</h2><ul>${targets.map(r=>`<li>${link(r)}</li>`).join('')}</ul>${actions}</section>`;
   const cta=nodes.find(n=>has(n,'cta-panel')||has(n,'area-form'));const pos=cta?.sourceCodeLocation!.startOffset||main.sourceCodeLocation!.endTag!.startOffset;patches.push({start:pos,end:pos,value:section});
  }
 }
 for(const p of patches.sort((a,b)=>b.start-a.start))html=html.slice(0,p.start)+p.value+html.slice(p.end);
 const schema=crumb.schema?`<script type="application/ld+json" data-breadcrumb-schema>${json(crumb.schema)}</script>`:'';
 return html.replace('</head>',`${schema}<link rel="stylesheet" href="/assets/navigation-paths.css"><script defer data-navigation-version="1" src="/assets/navigation-paths.js"></script></head>`);
}
