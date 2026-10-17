import {existsSync,statSync} from 'node:fs';
import {join,resolve,sep} from 'node:path';
import {parse,type DefaultTreeAdapterMap} from 'parse5';
type Node=DefaultTreeAdapterMap['node'];
export function validateSite(dist:string,pages:Map<string,string>):void{
 const ids=new Map<string,Set<string>>(),links:{route:string;url:string;image:boolean}[]=[];
 for(const[route,html]of pages){const anchors=new Set<string>();function walk(node:Node){if('tagName'in node){const attrs=Object.fromEntries(node.attrs.map(a=>[a.name,a.value]));if(attrs.id)anchors.add(attrs.id);if(node.tagName==='a'&&attrs.href)links.push({route,url:attrs.href,image:false});if(node.tagName==='img'&&attrs.src)links.push({route,url:attrs.src,image:true});}if('childNodes'in node)node.childNodes.forEach(walk);}walk(parse(html));ids.set(route,anchors);}
 const root=resolve(dist);
 for(const link of links){const url=new URL(link.url,'https://www.canberrawoodwork.com.au'+link.route);if(url.origin!=='https://www.canberrawoodwork.com.au')continue;const path=decodeURIComponent(url.pathname);if(url.pathname.startsWith('/api/'))continue;
  if(pages.has(path)){if(url.hash&&!ids.get(path)!.has(decodeURIComponent(url.hash.slice(1))))throw Error(`Broken anchor: ${link.route} → ${link.url}`);continue;}
  const file=resolve(join(dist,path));if(!file.startsWith(root+sep)||!existsSync(file)||statSync(file).isDirectory())throw Error(`Missing local ${link.image?'image':'link'}: ${link.route} → ${link.url}`);
 }
}
