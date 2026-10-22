import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {parse} from 'parse5';

const origin='https://www.canberrawoodwork.com.au';
type Item={id:string;url:string;title:string;summary?:string;content_text?:string;date_published?:string;_draft?:boolean};
type Feed={title:string;home_page_url:string;language:string;items:Item[]};
type Node={nodeName:string;value?:string;attrs?:{name:string;value:string}[];childNodes?:Node[]};
const attr=(node:Node,name:string)=>node.attrs?.find(a=>a.name===name)?.value;
function all(node:Node,predicate:(n:Node)=>boolean):Node[]{return [...(predicate(node)?[node]:[]),...(node.childNodes??[]).flatMap(n=>all(n,predicate))];}
const normalize=(s:string)=>s.replace(/\s+/g,' ').trim();
function text(n:Node):string {
 if(['script','style','nav','aside','footer'].includes(n.nodeName)||attr(n,'hidden')!==undefined||attr(n,'aria-hidden')==='true'||/display\s*:\s*none|visibility\s*:\s*hidden/i.test(attr(n,'style')??''))return '';
 return n.nodeName==='#text'?n.value??'':(n.childNodes??[]).map(text).join(' ');
}
const xml=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'');
function publicUrl(value:string,prefix:string):URL {
 const url=new URL(value);
 if(url.origin!==origin||url.search||url.hash||!url.pathname.startsWith(prefix+'/'))throw Error('RSS requires a production canonical URL: '+value);
 return url;
}

/** RSS is a one-way view of the final JSON. It never rewrites that source. */
export function renderRss(feed:Feed,prefix='',readPage:(path:string)=>string):string {
 const ids=new Set<string>();
 const items:Item[]=[];
 publicUrl(feed.home_page_url,prefix);
 for(const item of feed.items){
  if(item._draft===true)continue;
  if(!item.id||ids.has(item.id))throw Error('Missing or duplicate RSS GUID: '+item.id);
  ids.add(item.id);
  const url=publicUrl(item.url,prefix);
  if(!new RegExp('^'+prefix+'/news/[^/]+/$').test(url.pathname))throw Error('RSS item is not a published article: '+item.url);
  const doc=parse(readPage(url.pathname)) as unknown as Node;
  if(all(doc,n=>n.nodeName==='meta'&&/^(robots|googlebot)$/i.test(attr(n,'name')??'')&&/\bnoindex\b/i.test(attr(n,'content')??'')).length)continue;
  const canonical=all(doc,n=>n.nodeName==='link'&&attr(n,'rel')==='canonical')[0];
  if(attr(canonical??{nodeName:''},'href')!==item.url)throw Error('RSS canonical differs from final HTML: '+item.url);
  const h1=all(doc,n=>n.nodeName==='h1')[0];
  const prose=all(doc,n=>(attr(n,'class')??'').split(/\s+/).includes('article-prose'))[0];
  if(!h1||normalize(text(h1))!==normalize(item.title)||!prose||normalize(text(prose))!==normalize(item.content_text??''))throw Error('RSS JSON differs from final article title/body: '+item.url);
  items.push(item);
 }
 const self=origin+prefix+'/rss.xml';
 const entries=items.map(item=>{
  // Dates originate in the existing JSON; never substitute the build clock.
  const date=item.date_published&&/^\d{4}-\d{2}-\d{2}T/.test(item.date_published)?new Date(item.date_published):null;
  const pubDate=date&&!Number.isNaN(date.getTime())?`\n      <pubDate>${date.toUTCString()}</pubDate>`:'';
  return `    <item>\n      <title>${xml(item.title)}</title>\n      <link>${xml(item.url)}</link>\n      <guid isPermaLink="false">${xml(item.id)}</guid>\n      <description>${xml(item.summary??item.content_text??'')}</description>\n      <content:encoded>${xml(item.content_text??'')}</content:encoded>${pubDate}\n    </item>`;
 }).join('\n');
 return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n  <channel>\n    <title>${xml(feed.title)}</title>\n    <link>${xml(feed.home_page_url)}</link>\n    <description>${xml(feed.title)}</description>\n    <language>${xml(feed.language)}</language>\n    <atom:link href="${self}" rel="self" type="application/rss+xml"/>\n${entries}\n  </channel>\n</rss>\n`;
}

export function addRssDiscovery(html:string,prefix:string):string {
 const href=origin+prefix+'/rss.xml';
 const head=html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i)?.[0];
 if(!head)throw Error('Missing head for RSS discovery');
 const tags=head.match(/<link\b[^>]*>/gi)??[];
 const existing=tags.filter(tag=>/type=["']application\/rss\+xml["']/i.test(tag));
 if(existing.length){
  if(existing.length!==1||!existing[0].includes(`href="${href}"`))throw Error('Conflicting RSS discovery');
  return html;
 }
 const title=prefix?'Canberra Woodwork 中文知识内容':'Canberra Woodwork knowledge feed';
 return html.replace('</head>',`<link rel="alternate" type="application/rss+xml" title="${title}" href="${href}"></head>`);
}

/** Must run after every release overlay in build.mjs. */
export function applyRssFeeds(out:string):void {
 for(const prefix of ['', '/zh']){
  const json=join(out,prefix.slice(1),'feeds/llm-knowledge.json');
  if(!existsSync(json)){
   if(prefix)continue; // --english-only has no Chinese output.
   throw Error('Missing final JSON feed');
  }
  const feed=JSON.parse(readFileSync(json,'utf8')) as Feed;
  const pageFile=(route:string)=>join(out,route.slice(1),'index.html');
  const rss=renderRss(feed,prefix,route=>readFileSync(pageFile(route),'utf8'));
  writeFileSync(join(out,prefix.slice(1),'rss.xml'),rss,'utf8');
  const routes=new Set([prefix+'/',new URL(feed.home_page_url).pathname,...feed.items.filter(i=>!i._draft).map(i=>new URL(i.url).pathname)]);
  for(const route of routes){
   const file=pageFile(route),html=readFileSync(file,'utf8');
   writeFileSync(file,addRssDiscovery(html,prefix),'utf8');
  }
 }
}
