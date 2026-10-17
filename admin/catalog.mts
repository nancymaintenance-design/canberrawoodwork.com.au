import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {parse,type DefaultTreeAdapterMap} from 'parse5';
import type {Catalog,Field,Span,FieldKind} from './model.mts';
type Node=DefaultTreeAdapterMap['node'];
interface Found {path:string;tag:string;attr?:string;kind:FieldKind;value:string;span:Span;shared:boolean;section:string}
const labels:Record<string,string>={h1:'页面大标题',h2:'章节标题',h3:'小标题',p:'正文段落',summary:'FAQ 问题',a:'链接文字',li:'列表内容',title:'SEO 标题',label:'表单标签',button:'按钮',alt:'图片说明',description:'SEO 描述',href:'链接地址',src:'图片文件'};
export function scan(html:string):Found[]{
 const found:Found[]=[];const doc=parse(html,{sourceCodeLocationInfo:true});let section='页面文字';
 function walk(node:Node,path:string,shared=false,inactive=false){
  if('tagName'in node){
   const tag=node.tagName;const attrs=Object.fromEntries(node.attrs.map(a=>[a.name,a.value]));
   if(tag==='meta')section='SEO · '+(attrs.name||attrs.property||'元信息');
   if(['script','style','iframe','noscript','svg'].includes(tag)||attrs['data-language-switch']!==undefined||attrs.name==='language')return;
   shared=shared||['header','footer'].includes(tag)&&['site-header','site-footer'].includes(attrs.class||'');
   inactive=inactive||attrs['aria-hidden']==='true';
   if(/^h[1-3]$/.test(tag))section=node.childNodes.filter(n=>n.nodeName==='#text').map(n=>'value'in n?n.value:'').join('').trim()||section;
   for(const attr of node.attrs){
    let kind:FieldKind='attribute';let include=['alt','title','placeholder','aria-label'].includes(attr.name);
    if(tag==='meta'&&attr.name==='content'&&['description','og:description','twitter:description','og:title','twitter:title','og:image:alt','twitter:image:alt'].includes(attrs.name||attrs.property||''))include=true;
    if(tag==='a'&&attr.name==='href'&&!attrs.hreflang){include=true;kind='link';}
    if(tag==='img'&&attr.name==='src'){include=true;kind='image';}
    const location=node.sourceCodeLocation?.attrs?.[attr.name];
    if(include&&attr.value.trim()&&location){const raw=html.slice(location.startOffset,location.endOffset);const match=raw.match(/^[^=]+=(['"])([\s\S]*)\1$/);if(!match)continue;const start=location.startOffset+raw.indexOf('=')+2;
     found.push({path:path+'@'+attr.name,tag,attr:attr.name,kind,value:attr.value,span:{start,end:location.endOffset-1,raw:html.slice(start,location.endOffset-1)},shared,section});}
   }
  }
  if(node.nodeName==='#text'&&'value'in node&&node.value.trim()&&node.sourceCodeLocation&&!inactive){const loc=node.sourceCodeLocation;found.push({path,tag:path.split('/').at(-2)?.split(':')[0]||'text',kind:'text',value:node.value.trim(),span:{start:loc.startOffset,end:loc.endOffset,raw:html.slice(loc.startOffset,loc.endOffset)},shared,section});}
  if('childNodes'in node){const counts:Record<string,number>={};for(const child of node.childNodes){if('tagName'in child&&(child.attrs.some(a=>a.name==='data-language-switch')||child.attrs.some(a=>a.name==='name'&&a.value==='language')))continue;const n=child.nodeName;const i=counts[n]??0;counts[n]=i+1;walk(child,path+'/'+n+':'+i,shared,inactive);}}
 }walk(doc,'');return found;
}
export function getCatalog(dist:string):Catalog {
 const urls=[...readFileSync(join(dist,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]!).pathname).filter(p=>!p.startsWith('/zh/'));
 const catalog:Catalog={schemaVersion:1,pages:[{route:'shared',title:'全站公共文字',category:'公共',fieldIds:[]}],fields:{},html:{}};
 for(const route of urls){
  const en=readFileSync(join(dist,route.slice(1),'index.html'),'utf8'),zh=readFileSync(join(dist,'zh',route.slice(1),'index.html'),'utf8');catalog.html[route]={en,zh};
  const english=new Map(scan(en).map(f=>[f.path,f]));const fields=scan(zh);const title=fields.find(f=>f.tag==='h1'&&f.kind==='text')?.value||route;
  const category=route==='/'?'首页':({'about':'关于','services':'服务','faq':'FAQ','news':'文章','projects':'案例','service-areas':'地区','contact':'联系','privacy':'隐私'}[route.split('/')[1]!]||'其他');
  const page={route,title,category,fieldIds:[] as string[]};
  for(const z of fields){const e=english.get(z.path);if(!e||e.kind!==z.kind)continue;
   if(z.tag==='meta'&&['og:','twitter:'].some(prefix=>z.path.includes(prefix)))continue;
   const id=(z.shared?'shared':route)+':'+createHash('sha256').update(z.path).digest('hex').slice(0,16);
   let field=catalog.fields[id];
   if(!field){field={id,label:z.tag==='meta'?z.section:labels[z.attr||z.tag]||`${z.tag} 文字`,section:z.section,kind:z.kind,tag:z.tag,attr:z.attr,en:e.value,zh:z.value,shared:z.shared,occurrences:[]};catalog.fields[id]=field;}
   field.occurrences.push({route,en:e.span,zh:z.span});
   const list=z.shared?catalog.pages[0]!.fieldIds:page.fieldIds;if(!list.includes(id))list.push(id);
  }catalog.pages.push(page);
 }return catalog;
}
