import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

// Owner-confirmed groups: photos 1–4, 5–6 and 7–9. No location/date inferred.
type Photo={id:string;width:number;height:number;en:string;zh:string};
type Group={number:number;route:string;en:string;zh:string;photos:Photo[]};
const groups:Group[]=[
 {number:1,route:'timber-stair-and-handrail-repairs',en:'Case 1 · Outdoor timber stairs and walkway',zh:'案例一 · 户外木楼梯与步道',photos:[
  {id:'case-01-outdoor-timber-stairs',width:1440,height:1079,en:'Outdoor timber stairs and landing viewed from above',zh:'从上方拍摄的户外木楼梯与平台'},
  {id:'case-01-stair-landing',width:1440,height:1079,en:'Timber stair landing and railing beside the garden',zh:'花园旁的木楼梯平台与栏杆'},
  {id:'case-01-garden-walkway',width:1440,height:1079,en:'Timber garden walkway with posts and horizontal wire railing',zh:'带木立柱及横向拉索栏杆的花园木步道'},
  {id:'case-01-stairs-side-view',width:1440,height:1080,en:'Outdoor timber steps and railing viewed from the side',zh:'从侧面拍摄的户外木踏步与栏杆'},
 ]},
 {number:2,route:'timber-stair-and-handrail-repairs',en:'Case 2 · Timber railing and site views',zh:'案例二 · 木栏杆与现场环境',photos:[
  {id:'case-02-timber-wire-railing',width:1440,height:1079,en:'Timber posts and horizontal wire railing along a paved terrace',zh:'铺装平台边缘的木立柱与横向拉索栏杆'},
  {id:'case-02-site-paved-passage',width:1280,height:1707,en:'Site view of the paved passage beside the house',zh:'案例二现场环境：住宅旁的铺砖通道'},
 ]},
 {number:3,route:'deck-repairs',en:'Case 3 · Garden deck, steps and edge details',zh:'案例三 · 花园甲板、踏步与收边',photos:[
  {id:'case-03-garden-deck',width:1280,height:1706,en:'Timber deck and steps beside planted garden beds',zh:'沿花坛铺设的木甲板与踏步'},
  {id:'case-03-deck-walkway',width:1280,height:1706,en:'Timber garden deck walkway and step viewed along its length',zh:'沿步道方向拍摄的花园木甲板与踏步'},
  {id:'case-03-deck-edge-detail',width:1440,height:1080,en:'Timber deck side boards and step beside a garden bed',zh:'花坛旁的木甲板侧板与踏步收边'},
 ]},
];
const esc=(s:string)=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function renderGroup(g:Group,zh:boolean,sizes:string):string {
 const title=zh?g.zh:g.en;
 const grid=g.photos.length===3?' style="grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))"':'';
 return `<div class="real-photo-case" id="real-case-${g.number}"><h3>${title}</h3><div class="case-study-grid"${grid}>${g.photos.map((p,i)=>{
  const base='/assets/projects/'+p.id,caption=zh?p.zh:p.en;
  const label=zh?`案例${['一','二','三'][g.number-1]} · 照片 ${i+1}/${g.photos.length}`:`Case ${g.number} · Photo ${i+1}/${g.photos.length}`;
  const responsive=g.photos.length===3?'(max-width:700px) calc(100vw - 32px), (max-width:950px) 30vw, 400px':sizes;
  return `<figure class="case-study-image case-study-image-${i+1}"><img srcset="${base}-400.webp 400w, ${base}-800.webp 800w, ${base}.webp ${p.width}w" sizes="${responsive}" src="${base}.webp" alt="${esc(caption)}" width="${p.width}" height="${p.height}" loading="lazy" decoding="async"><figcaption><span>${label}</span><p>${esc(caption)}</p></figcaption></figure>`;
 }).join('')}</div></div>`;
}
export function applyRealPhotoRelease(out:string):void {
 for(const prefix of ['', '/zh'])for(const route of new Set(groups.map(g=>g.route))){
  const file=join(out,prefix.slice(1),'services',route,'index.html');
  let html=readFileSync(file,'utf8');
  const section=html.match(/<section class="service-case-study shell"[\s\S]*?<\/section>/g);
  if(section?.length!==1)throw Error('Photo section changed: '+file);
  let block=section[0];
  const grid=block.match(/<div class="case-study-grid">[\s\S]*?<\/div>/g);
  if(grid?.length!==1||(grid[0].match(/<figure /g)??[]).length!==2)throw Error('Original photo grid changed: '+file);
  const sizes=grid[0].match(/sizes="([^"]+)"/)?.[1];
  if(!sizes)throw Error('Missing responsive sizes: '+file);
  block=block.replace(grid[0],groups.filter(g=>g.route===route).map(g=>renderGroup(g,!!prefix,sizes)).join(''));
  const old=route==='deck-repairs'
   ?(prefix?'露台板面与固定细节，包括板材边缘及周边收口。':'Deck surface and fixing details, including board edges and the finished perimeter.')
   :(prefix?'木楼梯与扶手细节：踏板边缘、扶手接头及墙面固定位置。':'Timber stair and handrail details: tread edges, rail joints and wall fixings.');
  const summary=route==='deck-repairs'
   ?(prefix?'案例三的三张现场照片：花园甲板、踏步及侧板收边。':'Three site photographs from case 3: the garden deck, steps and edge boards.')
   :(prefix?'以下两组案例分别展示：案例一的四张木楼梯与步道照片，以及案例二的两张木栏杆与现场环境照片。':'Two separate projects below: four stair and walkway photographs from case 1, and two railing and site photographs from case 2.');
  if(!block.includes('<p>'+old+'</p>'))throw Error('Photo introduction changed: '+file);
  block=block.replace('<p>'+old+'</p>','<p>'+summary+'</p>');
  html=html.replace(section[0],block);
  writeFileSync(file,html,'utf8');
 }
}
