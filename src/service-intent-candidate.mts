import {readFileSync} from 'node:fs';
import {parse,type DefaultTreeAdapterMap} from 'parse5';
type Node=DefaultTreeAdapterMap['node'];
type Copy={heading:string;lead:string;items:[string,string][];related:string;cta:string};
const data=JSON.parse(readFileSync(new URL('../content/service-intent-candidate.json',import.meta.url),'utf8')) as Record<string,{en:Copy;zh:Copy;relatedSlug:string}>;
export const intentRoutes=Object.keys(data).flatMap(slug=>['/services/'+slug+'/','/zh/services/'+slug+'/']);
const esc=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function applyServiceIntent(route:string,html:string):string{
 if(!intentRoutes.includes(route)||html.includes('data-service-intent="1"'))return html;
 const zh=route.startsWith('/zh/'),prefix=zh?'/zh':'',slug=route.split('/').filter(Boolean).at(-1)!,copy=data[slug]![zh?'zh':'en'];
 const elements:DefaultTreeAdapterMap['element'][]=[];
 function visit(n:Node){if('tagName'in n)elements.push(n);if('childNodes'in n)n.childNodes.forEach(visit);}visit(parse(html,{sourceCodeLocationInfo:true}));
 const has=(n:DefaultTreeAdapterMap['element'],cls:string)=>(n.attrs.find(a=>a.name==='class')?.value||'').split(/\s+/).includes(cls);
 const body=elements.find(n=>has(n,'service-content-body'))!;
 if(!body?.sourceCodeLocation?.startTag)throw Error('Service body missing '+route);
 const labels=zh?['常见维修','维修说明','照片','常见问题','咨询报价']:['Repair needs','Repair details','Photos','Questions','Enquire'];
 const targets=['repair-needs','repair-details','repair-photos','service-questions','repair-enquiry'];
 const nav=`<nav class="service-page-jump" aria-label="${zh?'本页内容':'On this page'}">${labels.map((label,i)=>`<a href="#${targets[i]}">${label}</a>`).join('')}</nav>`;
 const overview=`<section class="service-intent-overview" id="repair-needs" data-service-intent="1"><h2>${esc(copy.heading)}</h2><p>${esc(copy.lead)}</p><dl>${copy.items.map(([term,description])=>`<div><dt>${esc(term)}</dt><dd>${esc(description)}</dd></div>`).join('')}</dl><div class="service-intent-actions"><a class="text-link" href="${prefix}/contact/">${esc(copy.cta)} ↗</a><a href="${prefix}/services/${data[slug]!.relatedSlug}/">${esc(copy.related)} ↗</a></div></section>`;
 const pos=body.sourceCodeLocation.startTag.endOffset,patches=[{start:pos,end:pos,value:nav+overview}];
 for(const[cls,id]of [['service-narrative','repair-details'],['service-case-study','repair-photos'],['cta-panel','repair-enquiry']]){
  const target=elements.find(n=>has(n,cls!));if(!target?.sourceCodeLocation?.startTag)throw Error('Missing navigation target '+cls+' '+route);
  if(target.attrs.some(a=>a.name==='id'))throw Error('Unexpected existing target ID '+route+' '+cls);
  const at=target.sourceCodeLocation.startTag.endOffset-1;patches.push({start:at,end:at,value:` id="${id}"`});
 }
 for(const patch of patches.sort((a,b)=>b.start-a.start))html=html.slice(0,patch.start)+patch.value+html.slice(patch.end);
 return html.replace('</head>','<link rel="stylesheet" href="/assets/service-intent-candidate.css"></head>');
}
