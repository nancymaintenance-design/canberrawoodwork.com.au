import {parse,type DefaultTreeAdapterMap} from 'parse5';
type Node=DefaultTreeAdapterMap['node'];
export function pageLinks(html:string){
 const links:{target:string;kind:'navigation'|'breadcrumb'|'body'}[]=[];
 function walk(n:Node,kind:'navigation'|'breadcrumb'|'body'='body'){
  if('tagName'in n){
   const cls=n.attrs.find(a=>a.name==='class')?.value||'';
   if(n.tagName==='nav')kind=/breadcrumbs/.test(cls)?'breadcrumb':'navigation';
   else if((n.tagName==='header'&&/\bsite-header\b/.test(cls))||n.tagName==='footer')kind='navigation';
   if(n.tagName==='a'){
    const href=n.attrs.find(a=>a.name==='href')?.value||'';
    if(href&&!href.startsWith('#'))try{const u=new URL(href,'https://www.canberrawoodwork.com.au');if(u.origin==='https://www.canberrawoodwork.com.au')links.push({target:u.pathname,kind});}catch{}
   }
  }
  if('childNodes'in n)for(const c of n.childNodes)walk(c,kind);
 }walk(parse(html));return links;
}
export function measureGraph(pages:Map<string,string>,owners:string[],home:string){
 const graph=new Map([...pages].map(([url,html])=>[url,pageLinks(html)])),dist=new Map([[home,0]]),queue=[home];
 for(let i=0;i<queue.length;i++)for(const link of graph.get(queue[i]!)||[])if(pages.has(link.target)&&!dist.has(link.target)){dist.set(link.target,dist.get(queue[i]!)!+1);queue.push(link.target);}
 return owners.map(owner=>{
  const categories={navigation:new Set<string>(),breadcrumb:new Set<string>(),body:new Set<string>()},all=new Set<string>();
  for(const[source,links]of graph)if(source!==owner)for(const link of links)if(link.target===owner){categories[link.kind].add(source);all.add(source);}
  return{owner,click_distance:dist.get(owner)??null,source_pages:all.size,sources:Object.fromEntries(Object.entries(categories).map(([kind,set])=>[kind,set.size]))};
 });
}
