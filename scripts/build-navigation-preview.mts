import {readFileSync,writeFileSync,mkdirSync,cpSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {parse,type DefaultTreeAdapterMap} from 'parse5';
import {navigationMap,validateMap,applyNavigation,getTrail,canonicalOrigin} from '../src/navigation-paths.mts';
import {measureGraph,pageLinks} from '../src/navigation-metrics.mts';
import {buildKnowledgeFeeds} from '../src/chinese-feed.mts';
import {validateSite} from '../admin/validate.mts';
import {removeThirdPartyLinks,isThirdPartyDestination} from '../src/customer-links.mts';
const root=process.cwd(),out=resolve('.local-admin/navigation-preview'),reports=resolve('../reports/service-navigation-2026-10-20');
execFileSync(process.execPath,['build.mjs'],{stdio:'inherit',env:{...process.env,SERVICE_NAVIGATION_SKIP_RELEASE:'1'}});
const issues=validateMap(navigationMap);if(issues.length)throw Error(issues.join('\n'));
mkdirSync(out,{recursive:true});cpSync('dist',out,{recursive:true});mkdirSync(reports,{recursive:true});
const original=new Map(navigationMap.map(r=>[r.url,readFileSync(join('dist',r.url.slice(1),'index.html'),'utf8')]));
const candidate=new Map([...original].map(([url,html])=>[url,removeThirdPartyLinks(applyNavigation(url,html)).replace('<html ','<html data-navigation-preview ')]));
const en=buildKnowledgeFeeds(candidate,{name:'Ellis Services Group'}),zh=buildKnowledgeFeeds(en.pages,{name:'Ellis Services Group',prefix:'/zh',language:'zh-Hans'});
const block=/<script id="llm-knowledge-feed" type="application\/json">[\s\S]*?<\/script>/;
for(const[url,html]of candidate){const feed=zh.pages.get(url)?.match(block)?.[0];candidate.set(url,feed?html.replace(block,()=>feed):html);}
type Node=DefaultTreeAdapterMap['node'];
const text=(n:Node):string=>'value'in n?String(n.value):'childNodes'in n?n.childNodes.map(text).join(''):'';
const checks:string[]=[];
for(const row of navigationMap){
 const html=candidate.get(row.url)!,before=original.get(row.url)!,doc=parse(html),elements:DefaultTreeAdapterMap['element'][]=[];
 function walk(n:Node){if('tagName'in n)elements.push(n);if('childNodes'in n)for(const c of n.childNodes)walk(c);}walk(doc);
 for(const anchor of elements.filter(n=>n.tagName==='a'))if(isThirdPartyDestination(anchor.attrs.find(a=>a.name==='href')?.value||''))throw Error('Third-party link remains '+row.url);
 const scripts=elements.filter(n=>n.tagName==='script'&&n.attrs.some(a=>a.name==='type'&&a.value==='application/ld+json'));
 const breadcrumbs:Record<string,unknown>[]=[];
 function schemas(v:unknown){if(Array.isArray(v))v.forEach(schemas);else if(v&&typeof v==='object'){if((v as Record<string,unknown>)['@type']==='BreadcrumbList')breadcrumbs.push(v as Record<string,unknown>);Object.values(v).forEach(schemas);}}
 scripts.forEach(s=>schemas(JSON.parse(text(s))));
 const trail=getTrail(row.url),crumb=elements.find(n=>n.tagName==='nav'&&n.attrs.some(a=>a.name==='data-service-breadcrumb'));
 if(breadcrumbs.length!==(trail.length?1:0))throw Error('Schema count '+row.url);
 if(trail.length){
  const items=breadcrumbs[0]!.itemListElement as {position:number;name:string;item:string}[];
  if(JSON.stringify(items.map(i=>[i.position,i.name,i.item]))!==JSON.stringify(trail.map((r,i)=>[i+1,r.breadcrumb_label,canonicalOrigin+r.url])))throw Error('Trail mismatch '+row.url);
  if(!crumb||!text(crumb).includes(row.breadcrumb_label))throw Error('Visible path '+row.url);
  const parentHtml=candidate.get(row.primary_parent_url!)!;
  if(!pageLinks(parentHtml).some(l=>l.target===row.url))throw Error('No parent return link '+row.url);
 }
 for(const link of pageLinks(html))if(!candidate.has(link.target)&&!['/api/contact','/feed.xml','/zh/feed.xml'].includes(link.target)&&!link.target.match(/\.(?:xml|json|pdf|png|jpg|webp)$/))throw Error('Unmapped internal link '+row.url+' '+link.target);
 for(const expression of [/<h1\b[^>]*>[\s\S]*?<\/h1>/g,/<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>/g,/<meta\b[^>]*name="robots"[^>]*>/g])if(JSON.stringify(before.match(expression))!==JSON.stringify(html.match(expression)))throw Error('Protected metadata/H1 changed '+row.url);
 writeFileSync(join(out,row.url.slice(1),'index.html'),html);checks.push(row.url);
}
for(const[prefix,feed]of [['',en.feed],['zh/',zh.feed]]as const)writeFileSync(join(out,prefix,'feeds/llm-knowledge.json'),JSON.stringify(feed,null,2)+'\n');
validateSite(out,candidate);
writeFileSync(join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
const metrics=['en-AU','zh-Hans'].map(locale=>{const owners=navigationMap.filter(r=>r.locale===locale&&r.priority).map(r=>r.url);return{locale,before:measureGraph(original,owners,locale==='zh-Hans'?'/zh/':'/'),after:measureGraph(candidate,owners,locale==='zh-Hans'?'/zh/':'/')};});
writeFileSync(join(reports,'link-metrics.json'),JSON.stringify(metrics,null,2)+'\n');
writeFileSync(join(reports,'mapping.json'),JSON.stringify({origin:canonicalOrigin,rows:navigationMap},null,2)+'\n');
writeFileSync(join(reports,'validation.json'),JSON.stringify({pages:checks.length,breadcrumbs:navigationMap.filter(r=>r.page_type!=='homepage').length,errors:[],protected:['H1','canonical','hreflang','robots'],excluded:['English and Chinese homepage single-node trails','404 pages','local admin'],deployment:'not deployed',checkedRoutes:checks},null,2)+'\n');
console.log(JSON.stringify({preview:out,checked:checks.length,reports,metrics},null,2));
