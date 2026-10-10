import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const strip = value=>value.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const readable = value=>strip(value).replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'");
// Deliberately identical to baseline.json: entities are not decoded or removed,
// breadcrumb and closed details text remain included. Do not use words as targets.
export function auditHtml(route, html){
  const main=html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1]||'';
  const text=main.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  const headings=[...main.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map(m=>({level:Number(m[1]),text:readable(m[2])}));
  const schemas=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
  const article=schemas.find(item=>item['@type']==='Article');
  const top=headings.filter(h=>h.level<=2).map(h=>h.text.toLowerCase());
  const jumps=headings.filter((h,i)=>h.level>(headings[i-1]?.level||0)+1);
  const links=[...main.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gs)].map(m=>({href:m[1],anchor:readable(m[2])}));
  return {route,title:html.match(/<title>(.*?)<\/title>/s)?.[1]||'',description:html.match(/<meta name="description" content="([^"]*)"/)?.[1]||'',h1:headings.filter(h=>h.level===1).map(h=>h.text),headings,words:text.split(' ').length,duplicateH1H2:top.filter((h,i)=>top.indexOf(h)!==i),headingJumps:jumps,mainLinks:links.map(l=>l.href),contextualLinks:links,faqCount:(main.match(/<details class="faq-item">/g)||[]).length,faqs:[...main.matchAll(/<details class="faq-item"><summary>(.*?)<\/summary><p>(.*?)<\/p>/gs)].map(m=>({question:readable(m[1]),answer:readable(m[2])})),visibleDates:[...main.matchAll(/<time datetime="([^"]+)"[^>]*>(.*?)<\/time>/gs)].map(m=>({date:m[1],label:readable(m[2])})),articleDates:article?{published:article.datePublished,modified:article.dateModified}:null,schemaTypes:schemas.map(s=>s['@type']),linkedCompanyByline:main.includes('class="article-byline">By <a href="/about/">Ellis Services Group</a>')};
}

export function auditSite(dist='dist',baselineFile,{now=new Date()}={}){
  const sitemap=readFileSync(resolve(dist,'sitemap.xml'),'utf8');
  const routes=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
  const pages=routes.map(route=>auditHtml(route,readFileSync(resolve(dist,`.${route}`,'index.html'),'utf8')));
  const baseline=baselineFile?JSON.parse(readFileSync(baselineFile,'utf8')):null;
  const invalidLinks=[];
  for(const page of pages)for(const href of page.mainLinks){
    if(!href.startsWith('/')&&!href.startsWith('#'))continue;
    const url=new URL(href,`https://www.canberrawoodwork.com.au${page.route}`), target=pages.find(p=>p.route===url.pathname);
    if(!target){invalidLinks.push({from:page.route,href,reason:'missing route'});continue;}
    if(url.hash){const html=readFileSync(resolve(dist,`.${url.pathname}`,'index.html'),'utf8');if(!html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`))invalidLinks.push({from:page.route,href,reason:'missing anchor'});}
  }
  const duplicatePages=pages.filter(p=>p.duplicateH1H2.length);
  const metrics={routes:pages.length,words:pages.reduce((sum,p)=>sum+p.words,0),pagesWithDuplicateH1H2:duplicatePages.length,pagesWithHeadingJumps:pages.filter(p=>p.headingJumps.length).length,invalidMainLinks:invalidLinks.length,uniqueTitles:new Set(pages.map(p=>p.title)).size,uniqueDescriptions:new Set(pages.map(p=>p.description)).size,guidesWithVisibleDates:pages.filter(p=>p.articleDates&&p.visibleDates.length===2).length,guidesWithLinkedCompanyByline:pages.filter(p=>p.articleDates&&p.linkedCompanyByline).length,faqPageSchemas:pages.filter(p=>p.schemaTypes.includes('FAQPage')).length};
  return {analyzedAt:now.toISOString().slice(0,10),source:'local rendered dist; no live ranking or business verification',wordCountMethod:'main tag, strip tags, collapse whitespace, split spaces; retain entities/breadcrumb/closed details',metrics,baseline:baseline?{commit:baseline.commit,routes:baseline.pages.length,words:baseline.pages.reduce((sum,p)=>sum+p.words,0)}:null,invalidLinks,pages:pages.map(p=>({...p,...(baseline?{baselineWords:baseline.pages.find(b=>b.route===p.route)?.words??null}:{} )}))};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const args=process.argv.slice(2),value=flag=>args.includes(flag)?args[args.indexOf(flag)+1]:undefined;
  const result=auditSite(value('--dist')||'dist',value('--baseline'));
  const output=JSON.stringify(result,null,2)+'\n',destination=value('--output');
  if(destination){mkdirSync(dirname(resolve(destination)),{recursive:true});writeFileSync(destination,output);console.log(JSON.stringify(result.metrics));}else process.stdout.write(output);
}
