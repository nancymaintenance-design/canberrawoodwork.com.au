import type {TemplateData,FeedNode,FeedItem,Service,FAQ,Article} from './types.mjs';
import {createHash} from 'node:crypto';
import {areas,business} from './content.mjs';

export const localePath = (route: string) => `/zh${route}`;
export const sourceKey = (value: string) => createHash('sha256').update(value).digest('hex').slice(0,20);
export const decode = (value: string) => value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp|ndash|mdash|middot|copy);/gi,(all: any,key: string)=>{
  if(key[0]==='#')return String.fromCodePoint(key[1].toLowerCase()==='x'?parseInt(key.slice(2),16):Number(key.slice(1)));
  return (({amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:' ',ndash:'–',mdash:'—',middot:'·',copy:'©'}) as Record<string,any>)[key.toLowerCase()]||all;
});
const escape = (value: any) => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const keepNames = new Set(['Ellis Services Group','ELLIS','SERVICES','GROUP · CARPENTRY','ELLIS SERVICES GROUP · CARPENTRY','ELLIS SERVICES GROUP','ELLIS SERVICES GROUP PTY LTD','Australian Private Company','IKEA','Cabot’s','WPC','ABN / ACN','Google','Google Maps','Instagram','LinkedIn','Facebook','YouTube','English','Canberra','Canberra, ACT','Canberra, ACT 2600','ACT','Australia','AU']);
for(const name of [business.address,business.legalName,...areas.flatMap(([,suburbs])=>suburbs), 'Mitchell','Melba','Pearce','Oxley'])keepNames.add(name);
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
export function automaticText(value: string){
  if(!/[A-Za-z]/.test(value)||keepNames.has(value)||/^(?:https?:|mailto:|tel:|\S+@\S+\.\S+)/.test(value)||/^© \d{4} Ellis Services Group$/.test(value))return value;
  const date=value.match(/^(\d{1,2}) (\w+) (\d{4})$/);
  if(date&&months.includes(date[2]))return `${date[3]}年${months.indexOf(date[2])+1}月${date[1]}日`;
  const count=value.match(/^(\d+) QUESTIONS?$/);if(count)return `${count[1]} 个问题`;
  const result=value.match(/^(\d+) of (\d+) questions$/);if(result)return `共 ${result[2]} 个问题，显示 ${result[1]} 个`;
  return null;
}

// Shared build-time traversal: inventory and rendering see exactly the same text.
// Raw script/style contents never pass through the prose translator.
export function transformPage(html: string,{text,link=(value:string)=>value,schema=(value:any)=>value,zh=false}:{text:(value:string)=>string;link?:(value:string)=>string;schema?:(value:any)=>unknown;zh?:boolean}){
  const localizedAttrs=new Set(['alt','title','placeholder','aria-label','label']);
  const metaText=new Set(['description','og:title','og:description','og:image:alt','twitter:title','twitter:description','twitter:image:alt']);
  const tokens=/<!--[\s\S]*?-->|<(script|style)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>[\s\S]*?<\/\1\s*>|<\/?[a-z!](?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
  const prose=(value: string)=>{
    const trimmed=decode(value).trim();if(!trimmed)return value;
    const translated=text(trimmed);
    if(translated===trimmed)return value;
    return value.match(/^\s*/)![0]+escape(translated)+value.match(/\s*$/)![0];
  };
  let cursor=0,output='';
  for(const match of html.matchAll(tokens)){
    output+=prose(html.slice(cursor,match.index));cursor=match.index+match[0].length;
    const tag=match[0];
    if(/^<script\b/i.test(tag)){
      output+=/type="application\/ld\+json"/.test(tag)?tag.replace(/>([\s\S]*?)<\/script>/,(_: any,raw: string)=>`>${JSON.stringify(schema(JSON.parse(raw))).replaceAll('<','\\u003c')}</script>`):tag;
      continue;
    }
    if(/^<(?:style|!--)/i.test(tag)||/^<\//.test(tag)){output+=tag;continue;}
    const tagName=tag.match(/^<([\w-]+)/)?.[1]?.toLowerCase();
    const metaName=tagName==='meta'?(tag.match(/(?:name|property)="([^"]+)"/)?.[1]):null;
    output+=tag.replace(/([\w:-]+)="([^"]*)"/g,(whole: any,name: string,raw: any)=>{
      const value=decode(raw);
      if(zh&&name==='lang'&&tagName==='html')return 'lang="zh-Hans"';
      if(zh&&name==='content'&&metaName==='og:locale')return 'content="zh_CN"';
      if((localizedAttrs.has(name)&&!(tagName==='link'&&/application\/feed\+json/.test(tag))||name==='content'&&metaText.has(metaName||''))&&value)return `${name}="${escape(text(value))}"`;
      if(zh&&['href','action'].includes(name)&&!(/hreflang=/.test(tag)))return `${name}="${escape(link(value))}"`;
      if(zh&&name==='content'&&metaName==='og:url')return `${name}="${escape(link(value))}"`;
      return whole;
    });
  }
  return output+prose(html.slice(cursor));
}

export function translationSources(pages: Map<string,string>){
  const entries: Record<string,{en:string;zh:string}>={};
  const text=(value: string)=>{if(automaticText(value)===null)entries[sourceKey(value)]={en:value,zh:''};return value;};
  const schema=(item: TemplateData)=>{
    if(!item||typeof item!=='object'||item['@type']==='HomeAndConstructionBusiness')return item;
    for(const[key,value]of Object.entries(item)){
      if(typeof value==='string'&&['name','headline','description','serviceType','caption'].includes(key))text(value);
      else if(value&&typeof value==='object')schema(value);
    }return item;
  };
  for(const html of pages.values())transformPage(html,{text,schema});
  return entries;
}

export function bilingualPages(finalPages: Map<string,string>,catalog: Record<string,{en:string;zh:string}>,{origin}: {origin:string}){
  const routes=new Set(finalPages.keys()),missing=new Set();
  const t=(value: string)=>{
    const automatic=automaticText(value);if(automatic!==null)return automatic;
    const entry=catalog[sourceKey(value)];
    if(!entry||entry.en!==value||!entry.zh?.trim()){missing.add(value);return value;}
    return entry.zh;
  };
  const localLink=(value: string)=>{
    if(!value.startsWith('/')&&!value.startsWith(origin+'/'))return value;
    const absolute=value.startsWith(origin+'/');
    const url=new URL(value,origin);
    if(!routes.has(url.pathname)||['#business','#website'].includes(url.hash))return value;
    return (absolute?origin:'')+localePath(url.pathname)+url.search+url.hash;
  };
  const localSchema=(value: unknown,zh=false)=>{
    const walk=(item: any,key: string=''): any=>{
      if(Array.isArray(item))return item.map(v=>walk(v,key));
      if(item&&typeof item==='object'){
        if(item['@type']==='HomeAndConstructionBusiness')return item;
        if(item['@type']==='WebSite')return {...item,inLanguage:['en-AU','zh-Hans']};
        const result=Object.fromEntries(Object.entries(item).map(([k,v])=>[k,walk(v,k)]));
        if(item['@type']==='WebSite')result.inLanguage=['en-AU','zh-Hans'];
        if(['WebPage','AboutPage','ContactPage','CollectionPage','Article'].includes(item['@type']))result.inLanguage=zh?'zh-Hans':'en-AU';
        return result;
      }
      if(typeof item!=='string')return item;
      if(zh&&['url','@id','item','mainEntityOfPage'].includes(key))return localLink(item);
      if(zh&&['name','headline','description','serviceType','caption'].includes(key))return t(item);
      return item;
    };
    return walk(value);
  };
  const pages: Map<string,string>=new Map();
  for(const[route,source]of finalPages){
    const alternates=route==='/404/'?'':`<link rel="alternate" hreflang="en-AU" href="${origin+route}"><link rel="alternate" hreflang="zh-Hans" href="${origin+localePath(route)}"><link rel="alternate" hreflang="x-default" href="${origin+route}">`;
    const switchLink=`<a class="language-switch" href="${localePath(route)}" lang="zh-Hans" hreflang="zh-Hans" data-language-switch>中文服务</a>`;
    // Stable location immediately after Contact, including the mobile menu.
    const english=source.replace(/(<nav id="main-nav"[\s\S]*?)(<\/nav>)/,`$1${switchLink}$2`).replace('</head>',`${alternates}<link rel="stylesheet" href="/assets/bilingual.css"><script defer src="/assets/language-switch.js"></script></head>`);
    pages.set(route,english);
    let chinese=transformPage(english,{text:t,link:localLink,schema:v=>localSchema(v,true),zh:true});
    chinese=chinese.replace(/<a class="language-switch"[^>]*>[\s\S]*?<\/a>/,`<a class="language-switch" href="${route}" lang="en-AU" hreflang="en-AU" data-language-switch>English</a>`);
    chinese=chinese.replace('<body>','<body class="locale-zh">').replace(/<form class="enquiry-form"([^>]*)>/g,'<form class="enquiry-form"$1><input type="hidden" name="language" value="zh-Hans">');
    chinese=chinese.replace('src="/assets/site.js"','src="/assets/site-zh.js"');
    pages.set(localePath(route),chinese);
  }
  if(missing.size)throw new Error(`Chinese translations missing/stale (${missing.size}). Update src/locales/zh-Hans.json before building:\n${[...missing].slice(0,15).join('\n')}`);
  return pages;
}
