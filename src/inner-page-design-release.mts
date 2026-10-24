import {readFileSync, writeFileSync, copyFileSync, readdirSync} from 'node:fs';
import {join, relative, sep} from 'node:path';
import {parse, type DefaultTreeAdapterMap} from 'parse5';

// Approved bilingual inner-page layout; deliberately excludes both homepages.
type Node = DefaultTreeAdapterMap['node'];
type Element = DefaultTreeAdapterMap['element'];
const isElement = (n: Node): n is Element => 'tagName' in n;
const classes = (n: Node) => isElement(n) ? (n.attrs.find(a=>a.name==='class')?.value ?? '').split(/\s+/) : [];
function find(n: Node, match: (n: Node)=>boolean): Node|undefined {
  if(match(n)) return n;
  if('childNodes' in n) for(const child of n.childNodes){const found=find(child,match);if(found)return found;}
}
function source(html: string, node: Node): string {
  const l=node.sourceCodeLocation;if(!l)throw Error('Missing HTML source location');
  return html.slice(l.startOffset,l.endOffset);
}
export function applyInnerPageDesignRelease(route: string, html: string): string {
  if(route==='/' || route==='/zh/' || html.includes('data-inner-page-design')) return html;
  const doc=parse(html,{sourceCodeLocationInfo:true}),edits:{start:number,end:number,value:string}[]=[];
  const hero=find(doc,n=>classes(n).some(c=>['page-hero','detail-hero','article-hero'].includes(c)));
  const about=route==='/about/' || route==='/zh/about/';
  // FAQ and privacy retain their existing photo-led templates; CSS only refines spacing.
  if(hero && isElement(hero) && !classes(hero).includes('cw-hero')) {
    const container=classes(hero).includes('detail-hero') ? hero.childNodes.find(n=>classes(n).includes('shell')) : hero;
    if(!container || !isElement(container))throw Error('Missing hero container '+route);
    const children=container.childNodes.filter(isElement);
    const heading=children.filter(n=>n.tagName==='h1'||classes(n).includes('eyebrow'));
    const breadcrumb=children.filter(n=>classes(n).includes('breadcrumbs'));
    const footer=children.filter(n=>classes(n).includes('journey-services'));
    const intro=children.filter(n=>!heading.includes(n)&&!breadcrumb.includes(n)&&!footer.includes(n));
    if(!heading.some(n=>n.tagName==='h1'))throw Error('Missing heading '+route);
    const markup=(nodes:Node[])=>nodes.map(n=>source(html,n)).join('');
    let content=`<div class="ip-hero-heading">${markup(heading)}</div><div class="ip-hero-intro">${markup(intro)}</div>`;
    if(about){
      const visual=find(doc,n=>classes(n).includes('about-visual'));
      if(!visual?.sourceCodeLocation)throw Error('Missing about image');
      content=`<div class="ip-about-intro">${content}</div>${source(html,visual)}`;
      edits.push({start:visual.sourceCodeLocation.startOffset,end:visual.sourceCodeLocation.endOffset,value:''});
      const copy=find(doc,n=>classes(n).includes('about-copy'));
      if(!copy || !isElement(copy))throw Error('Missing about copy');
      const copyChildren=copy.childNodes.filter(isElement);
      const sectionHead=copyChildren.filter(n=>classes(n).includes('eyebrow')||n.tagName==='h2');
      const prose=copyChildren.filter(n=>!sectionHead.includes(n));
      const l=copy.sourceCodeLocation!;
      edits.push({start:l.startOffset,end:l.endOffset,value:`<div class="about-copy"><div class="ip-section-heading">${markup(sectionHead)}</div><div class="ip-section-prose">${markup(prose)}</div></div>`});
    }
    const loc=container.sourceCodeLocation!;
    edits.push({start:loc.startTag!.endOffset,end:loc.endTag!.startOffset,value:markup(breadcrumb)+`<div class="ip-hero-content${about?' ip-about-hero':''}">${content}</div>`+markup(footer)});
  }
  if(route==='/service-areas/' || route==='/zh/service-areas/'){
    const area=find(doc,n=>classes(n).includes('area-form'));
    const shell=area && isElement(area) ? area.childNodes.find(n=>classes(n).includes('shell')) : undefined;
    const intro=shell && isElement(shell) ? shell.childNodes.find(n=>isElement(n)&&n.tagName==='div') : undefined;
    if(!intro || !isElement(intro) || !intro.sourceCodeLocation?.endTag)throw Error('Missing area enquiry introduction '+route);
    const zh=route.startsWith('/zh/');
    const photo=`<figure class="area-team-photo" id="area-team-photo"><img src="/assets/projects/oxley-outdoor-deck-work-800.webp" srcset="/assets/projects/oxley-outdoor-deck-work-400.webp 400w, /assets/projects/oxley-outdoor-deck-work-800.webp 800w" sizes="(max-width:700px) calc(100vw - 32px), (max-width:950px) 42vw, 500px" width="800" height="600" loading="lazy" decoding="async" alt="${zh?'Ellis 团队进行户外木作施工':'Ellis carpenter fitting boards on an outdoor timber deck'}"><figcaption>${zh?'Ellis 团队 · 户外木作施工':'Ellis team · Outdoor carpentry at work'}</figcaption></figure>`;
    const at=intro.sourceCodeLocation.endTag.startOffset;
    edits.push({start:at,end:at,value:photo});
  }
  for(const e of edits.sort((a,b)=>b.start-a.start))html=html.slice(0,e.start)+e.value+html.slice(e.end);
  html=html.replace(/<body\b/,`<body data-inner-page-design="v1"`);
  return html.replace('</head>','<link rel="stylesheet" href="/assets/inner-page-design.css"></head>');
}
export function writeInnerPageDesignRelease(out:string): void {
  let count=0;
  function walk(dir:string){for(const item of readdirSync(dir,{withFileTypes:true})){
    const file=join(dir,item.name);
    if(item.isDirectory())walk(file);
    else if(item.name==='index.html'){
      const route='/'+relative(out,dir).split(sep).filter(Boolean).join('/')+(dir===out?'':'/');
      const before=readFileSync(file,'utf8'),after=applyInnerPageDesignRelease(route,before);
      if(after!==before){writeFileSync(file,after);count++;}
    }
  }}
  walk(out);
  copyFileSync(new URL('../content/inner-page-design.css',import.meta.url),join(out,'assets/inner-page-design.css'));
  console.log(`Approved inner-page design: ${count} pages. Homepages untouched. `);
}
