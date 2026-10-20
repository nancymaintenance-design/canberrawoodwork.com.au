import {parse,type DefaultTreeAdapterMap} from 'parse5';
type Node=DefaultTreeAdapterMap['node'];
export const businessDestinations=new Set([
 'https://share.google/9J93sm3qIx44KCDtj','https://share.google/y50AZRJwjOdVOlj5o',
 'https://share.google/Z4tImXHToPi9H4LmH','https://share.google/tU1c5vEAlELqXCifu',
 'https://maps.app.goo.gl/cvWgzfMPhPrDPZnE7',
 'https://www.instagram.com/elliservices_group/',
 'https://abr.business.gov.au/ABN/View?id=645821745'
]);
export function isThirdPartyDestination(href:string):boolean{
 try{const url=new URL(href,'https://www.canberrawoodwork.com.au');return ['http:','https:'].includes(url.protocol)&&!['www.canberrawoodwork.com.au','canberrawoodwork.com.au'].includes(url.hostname)&&!businessDestinations.has(url.href);}catch{return false;}
}
const text=(n:Node):string=>'value'in n?String(n.value):'childNodes'in n?n.childNodes.map(text).join(''):'';
export function removeThirdPartyLinks(html:string):string{
 const document=parse(html,{sourceCodeLocationInfo:true}),patches:{start:number;end:number;value:string}[]=[];
 const cut=(n:Node,value='')=>{if(n.sourceCodeLocation)patches.push({start:n.sourceCodeLocation.startOffset,end:n.sourceCodeLocation.endOffset,value});};
 function visit(n:Node){
  if('tagName'in n){
   const cls=n.attrs.find(a=>a.name==='class')?.value||'';
   if(cls.split(/\s+/).includes('source-note')){cut(n);return;}
   if(n.tagName==='section'&&n.childNodes.some(c=>'tagName'in c&&c.tagName==='h2'&&/^(Relevant official guidance|相关官方指导)$/.test(text(c).trim()))){cut(n);return;}
   if(n.tagName==='a'&&isThirdPartyDestination(n.attrs.find(a=>a.name==='href')?.value||'')){
    const loc=n.sourceCodeLocation!;cut(n,html.slice(loc.startTag!.endOffset,loc.endTag!.startOffset));return;
   }
  }
  if('childNodes'in n)n.childNodes.forEach(visit);
 }visit(document);
 for(const p of patches.sort((a,b)=>b.start-a.start))html=html.slice(0,p.start)+p.value+html.slice(p.end);
 return html;
}
