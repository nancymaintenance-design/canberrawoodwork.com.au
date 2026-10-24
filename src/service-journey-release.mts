import {readFileSync,writeFileSync,copyFileSync} from 'node:fs';
import {join} from 'node:path';
import {navigationMap} from './navigation-paths.mts';
import {validateSite} from '../admin/validate.mts';

// Approved inner-page service navigation. Homepage links remain unchanged.
const groups=[
 {id:'doors-windows-timber',en:'Doors, windows & timber repairs',zh:'木门、木窗与木结构维修',slugs:['door-and-frame-repairs','timber-window-repairs','rotten-timber-repairs','fascia-and-eaves-repairs','timber-weatherboard-repairs','structural-timber-repairs']},
 {id:'decks-fences-gates',en:'Decks, fences & gates',zh:'露台、围栏与木门栅',slugs:['deck-repairs','timber-fence-repairs','timber-gate-repairs','timber-stair-and-handrail-repairs','pergola-timber-repairs','deck-building','composite-decking','deck-cleaning-and-oiling']},
 {id:'interior-storage-trim',en:'Interior storage & trim',zh:'室内收纳与木作收边',slugs:['skirting-and-architraves','cabinet-door-and-drawer-repairs','interior-carpentry','custom-joinery','built-in-wardrobes','under-stair-storage']}
];
const esc=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const once=(html:string,before:string,after:string,route:string)=>{
 if(html.split(before).length!==2)throw Error('Expected one candidate anchor: '+route+' '+before);
 return html.replace(before,()=>after);
};
const label=(route:string)=>{
 const row=navigationMap.find(r=>r.url===route);if(!row)throw Error('Missing mapped service '+route);
 return row.breadcrumb_label;
};
const a=(route:string,text:string)=>`<a href="${route}">${esc(text)}</a>`;

export function applyServiceJourneyRelease(route:string,html:string):string{
 const zh=route.startsWith('/zh/'),prefix=zh?'/zh':'',base=zh?route.slice(3):route;
 if(html.includes('data-service-journey-candidate'))return html;
 let output=html;
 if(base==='/services/'){
  const nav=`<nav class="service-route-groups" aria-label="${zh?'按木工需求查找服务':'Find services by carpentry task'}" data-service-journey-candidate="directory">${groups.map(g=>`<div id="${g.id}"><h3>${esc(zh?g.zh:g.en)}</h3><ul>${g.slugs.map(slug=>`<li>${a(prefix+'/services/'+slug+'/',label(prefix+'/services/'+slug+'/'))}</li>`).join('')}</ul></div>`).join('')}<p class="service-route-mixed">${a(prefix+'/services/small-carpentry-jobs/',(zh?'有几项小维修？查看零散木工维修服务':'Several small repairs? Explore our small carpentry jobs service')+' ↗')}</p></nav>`;
  output=once(output,'<div class="index-grid">',nav+'<div class="index-grid">',route);
  output=once(output,'</head>','<link rel="stylesheet" href="/assets/service-journey.css"></head>',route);
 }else if(['/services/custom-joinery/','/services/interior-carpentry/','/services/deck-building/'].includes(base)){
  const old=`<p><a href="${prefix}/projects/">${zh?'查看提供的 Ellis 项目照片':'View supplied Ellis project photographs'}</a></p>`;
  const links=base==='/services/deck-building/'?
   [a(prefix+'/projects/mitchell-composite-deck/',zh?'比较复合材料安装：Mitchell 露台案例':'Compare composite installation: the Mitchell deck project')]:
   [a(prefix+'/projects/pearce-wardrobe-installation/',zh?'Pearce IKEA 衣柜组装与安装案例':'Pearce IKEA wardrobe assembly and fitting project'),a(prefix+'/projects/under-stair-storage-gallery/',zh?'楼梯下储物：不同项目的完工合集':'Under-stair storage: completed work from different projects')];
  output=once(output,old,`<p data-service-journey-candidate="projects">${links.join(' · ')}</p>`,route);
 }else if(['/services/composite-decking/','/services/deck-cleaning-and-oiling/','/services/built-in-wardrobes/','/services/under-stair-storage/'].includes(base)){
  // The measured-installation template has a single hero action; retain it and add the existing phone.
  const hero=output.match(/<header class="page-hero shell">[\s\S]*?<\/header>/)?.[0];
  if(!hero)throw Error('Missing verified service hero '+route);
  if(hero.includes('tel:+61405878406'))return output;
  const action=hero.match(/<a class="btn btn-primary"[\s\S]*?<\/a>/)?.[0];
  if(!action)throw Error('Missing verified service action '+route);
  const next=once(hero,action,`<div class="hero-actions service-journey-actions">${action}<a class="text-link" href="tel:+61405878406" data-service-journey-candidate="phone">${zh?'致电':'Call'} 0405 878 406 ↗</a></div>`,route);
  output=once(output,hero,next,route);
  output=once(output,'</head>','<link rel="stylesheet" href="/assets/service-journey.css"></head>',route);
 }
 return output;
}

export function writeServiceJourneyRelease(out:string):void{
 const changed=new Map<string,string>(),pages=new Map<string,string>();
 for(const row of navigationMap){
  const file=join(out,row.url.slice(1),'index.html'),before=readFileSync(file,'utf8'),after=applyServiceJourneyRelease(row.url,before);
  pages.set(row.url,after);
  if(before!==after)changed.set(row.url,after);
 }
 copyFileSync(new URL('../content/service-journey.css',import.meta.url),join(out,'assets/service-journey.css'));
 validateSite(out,pages);
 for(const[route,html]of changed)writeFileSync(join(out,route.slice(1),'index.html'),html);
 console.log('Approved inner-page service journey: '+changed.size+' bilingual pages. Homepages unchanged.');
}
