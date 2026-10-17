import type {TemplateData,FeedNode,FeedItem,Service,FAQ,Article} from './types.mjs';
import { existsSync } from 'node:fs';
import {join} from 'node:path';
import { editorialMedia } from './editorial-media.mjs';
import { serviceCaseMedia } from './service-case-media.mjs';
import { confirmedServices, verifiedProjects } from './verified-projects.mjs';

const origin='https://www.canberrawoodwork.com.au';
const suffix=' | Ellis Services Group';
const escape=(value: any)=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const decode=(value: string)=>value.replace(/&(?:amp|quot|lt|gt|apos|#\d+|#x[\da-f]+);/gi,(entity: string)=>{
  const named={'&amp;':'&','&quot;':'"','&lt;':'<','&gt;':'>','&apos;':"'"};
  if((named as Record<string,(typeof named)[keyof typeof named]>)[entity.toLowerCase()])return (named as Record<string,(typeof named)[keyof typeof named]>)[entity.toLowerCase()];
  const code=entity[2].toLowerCase()==='x'?parseInt(entity.slice(3,-1),16):Number(entity.slice(2,-1));
  return code>0&&code<=0x10ffff?String.fromCodePoint(code):entity;
});

// Explicit editorial decisions: lengths guide clarity, not an arbitrary cut-off.
const titles={
  '/services/skirting-and-architraves/':'Skirting & Architraves Canberra',
  '/services/cabinet-door-and-drawer-repairs/':'Cupboard & Drawer Repairs Canberra',
  '/services/timber-stair-and-handrail-repairs/':'Stair & Handrail Repairs Canberra',
  '/faq/':'Carpentry Questions & Answers',
  '/news/':'Carpentry Advice & Repair Guides',
  '/news/timber-door-sticks-after-rain/':'Sticking Timber Doors After Rain',
  '/news/deck-boards-or-frame/':'Deck Boards or Frame Repairs',
  '/news/rotten-window-sill/':'Rotten Window Sill Repairs',
  '/news/fascia-bargeboard-eaves/':'Fascia, Bargeboards & Eaves Explained',
  '/news/leaning-paling-fence/':'Leaning Timber Fences',
  '/news/skirting-after-new-flooring/':'Skirting After New Flooring',
  '/news/why-timber-gates-sag/':'Sagging Timber Gates',
  '/news/why-timber-rot-returns/':'Recurring Timber Rot',
  '/news/cabinet-hinges-and-drawer-runners/':'Cupboard Hinge & Drawer Repairs',
  '/news/timber-weatherboard-damage/':'Weatherboard Replacement',
  '/news/loose-timber-stairs/':'Loose Stairs & Handrails',
  '/news/pergola-post-rot/':'Rotten Pergola Post Repairs',
  '/news/repair-or-rebuild-a-deck/':'Repair or Rebuild an Existing Deck?',
  '/news/carpentry-jobs-before-selling/':'Carpentry Before Selling Your Home',
  '/news/carpentry-quote-cost-factors/':'Carpentry Quote Cost Factors',
  '/news/timber-vs-composite-decking-canberra/':'Timber vs Composite Decking',
  '/news/timber-deck-maintenance-canberra/':'Timber Deck Maintenance',
  '/service-areas/':'Canberra Carpentry Service Areas',
  '/services/composite-decking/':'Composite Decking Canberra',
  '/services/built-in-wardrobes/':'Built-in Wardrobes Canberra',
  '/services/under-stair-storage/':'Under-stair Storage Canberra',
  '/projects/mitchell-composite-deck/':'Composite Deck in Mitchell',
  '/projects/melba-deck-care/':'Melba Deck Repairs & Oiling',
  '/projects/pearce-wardrobe-installation/':'Wardrobe Fitting in Pearce',
  '/projects/under-stair-storage-gallery/':'Under-stair Storage Project Gallery',
};
const descriptions={
  '/services/custom-joinery/':'Custom joinery and built-in storage in Canberra. Confirm the measured layout, materials, hardware, manufacture and installation before ordering.',
  '/services/deck-building/':'New timber decks and extensions in Canberra. Plan the footprint, supports, drainage, materials and access, with applicable ACT checks scoped before work.',
  '/faq/':'Answers about local carpentry enquiries, photos, materials, quotes and appointments, with links to detailed repair and installation questions.',
  '/news/timber-vs-composite-decking-canberra/':'Compare timber and composite decking: care, surface heat, product instructions and quote inclusions, with site needs considered.',
};
const fallbackImage={src:'/assets/measuring-timber-work-canberra.webp',width:1440,height:960,alt:'Carpenter measuring an upright timber member'};
const projectImage=(id: string,alt: string)=>({src:`/assets/projects/${id}.webp`,width:1448,height:1086,alt});
function representativeImage(route: string){
  if((editorialMedia as Record<string,(typeof editorialMedia)[keyof typeof editorialMedia]>)[route])return (editorialMedia as Record<string,(typeof editorialMedia)[keyof typeof editorialMedia]>)[route];
  const service=confirmedServices.find(item=>route===`/services/${item.slug}/`);
  if(service)return projectImage(service.image,service.alt);
  const project=verifiedProjects.find(item=>route===`/projects/${item.slug}/`);
  if(project){
    const service=confirmedServices.find(item=>item.project===project.slug);
    if(service)return projectImage(service.image,service.alt);
    return projectImage(project.images[0][0],project.images[0][1]);
  }
  if(route.startsWith('/services/'))return (serviceCaseMedia as Record<string,(typeof serviceCaseMedia)[keyof typeof serviceCaseMedia]>)[route.split('/')[2]]?.images[0]||fallbackImage;
  return fallbackImage;
}

// Run last: earlier content enhancements also rewrite titles/descriptions/schema.
// imageExists is a narrow boundary for safe missing-media handling and tests.
export function normalizeSeoMetadata(html: string,route: string,{imageExists=(src: string)=>existsSync(join(process.cwd(),'public',src))}={}){
  const selected=representativeImage(route);
  const image=imageExists(selected.src)?selected:fallbackImage;
  const title=(titles as Record<string,(typeof titles)[keyof typeof titles]>)[route]?(titles as Record<string,(typeof titles)[keyof typeof titles]>)[route]+suffix:decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1]||'Ellis Services Group');
  const description=(descriptions as Record<string,(typeof descriptions)[keyof typeof descriptions]>)[route]||decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1]||'Canberra carpentry and timber repairs from Ellis Services Group.');
  const headline=decode((html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]||'').replace(/<[^>]*>/g,''));
  const article=/<script type="application\/ld\+json">[^<]*"@type":"Article"/.test(html);
  return html.replace(/<head>([\s\S]*?)<\/head>/,(_: any,head: string)=>{
    let finalHead=head.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(title)}</title>`)
      .replace(/<meta name="description" content="[^"]*"[^>]*>/,`<meta name="description" content="${escape(description)}">`)
      .replace(/<meta\b[^>]*>/g,(tag: string)=>/\b(?:name|property)="(?:og:|twitter:)[^"]*"/i.test(tag)?'':tag)
      .replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_: any,json: string)=>{
        const schema=JSON.parse(json);
        if(['WebPage','AboutPage','ContactPage','CollectionPage'].includes(schema['@type'])){
          schema.name=title;
          schema.description=description;
        }
        if(schema['@type']==='Article'){
          schema.image=origin+image.src;
          if(headline)schema.headline=headline;
        }
        return `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`;
      });
    const social={
      'og:title':title,'og:description':description,'og:url':origin+route,
      'og:type':article?'article':'website','og:site_name':'Ellis Services Group','og:locale':'en_AU',
      'og:image':origin+image.src,'og:image:alt':image.alt,'og:image:width':image.width,'og:image:height':image.height,
      'twitter:card':'summary_large_image','twitter:title':title,'twitter:description':description,
      'twitter:image':origin+image.src,'twitter:image:alt':image.alt,
    };
    finalHead+=Object.entries(social).map(([name,value])=>`<meta ${name.startsWith('og:')?'property':'name'}="${name}" content="${escape(value)}">`).join('');
    return `<head>${finalHead}</head>`;
  });
}
