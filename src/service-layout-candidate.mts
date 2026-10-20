import {parse,type DefaultTreeAdapterMap} from 'parse5';
type Node=DefaultTreeAdapterMap['node'];
type Element=DefaultTreeAdapterMap['element'];
const element=(n:Node):n is Element=>'tagName'in n;
const hasClass=(n:Element,name:string)=>(n.attrs.find(a=>a.name==='class')?.value||'').split(/\s+/).includes(name);

/** Apply after bilingual content edits, so existing CMS field identities stay intact. */
export function alignServiceDetail(route:string,html:string):string{
 if(!/^\/(?:zh\/)?services\/[^/]+\/$/.test(route)||html.includes('class="service-content-grid shell"'))return html;
 const doc=parse(html,{sourceCodeLocationInfo:true});let main:Element|undefined;
 function visit(n:Node){if(element(n)&&n.tagName==='main')main=n;if('childNodes'in n)for(const c of n.childNodes)visit(c);}visit(doc);
 if(!main?.sourceCodeLocation?.startTag||!main.sourceCodeLocation.endTag)throw Error('Missing service main: '+route);
 const nodes=main.childNodes.filter(element);
 const layout=nodes.find(n=>hasClass(n,'detail-content')||hasClass(n,'verified-layout'));
 if(!layout)throw Error('Missing service layout: '+route);
 const content=layout.childNodes.filter(element),aside=content.find(n=>n.tagName==='aside');
 if(!aside)throw Error('Missing service sidebar: '+route);
 const raw=(n:Element)=>{const loc=n.sourceCodeLocation;if(!loc)throw Error('Missing source offsets');return html.slice(loc.startOffset,loc.endOffset);};
 const hero=nodes.filter(n=>hasClass(n,'detail-hero')||hasClass(n,'page-hero'));
 const cta=nodes.filter(n=>hasClass(n,'cta-panel'));
 const body=nodes.filter(n=>!hero.includes(n)&&!cta.includes(n)).map(n=>n===layout?content.filter(n=>n!==aside).map(raw).join(''):raw(n)).join('');
 const grid=`<div class="service-content-grid shell"><div class="service-content-body">${body}</div><div class="service-content-sidebar">${raw(aside)}</div></div>`;
 const {startTag,endTag}=main.sourceCodeLocation;
 const result=html.slice(0,startTag.endOffset)+hero.map(raw).join('')+grid+cta.map(raw).join('')+html.slice(endTag.startOffset);
 return result.replace('</head>','<link rel="stylesheet" href="/assets/service-layout.css"></head>');
}
