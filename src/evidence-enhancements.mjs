import {editorialMedia} from './editorial-media.mjs';
import {enhanceImageDelivery} from './image-delivery.mjs';

const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const guideSizes='(max-width:700px) calc(100vw - 32px), (max-width:950px) calc(100vw - 345px), (max-width:1194px) calc(100vw - 434px), 760px';
const projectContext={
  '/news/timber-vs-composite-decking-canberra/':{
    heading:'Mitchell: subframe construction and composite board fitting',
    answer:'At Mitchell in August 2025, the Ellis carpentry team carried out site levelling, subframe construction and WPC board installation. The photographs show the frame, board fitting and completed edges. This example helps identify the construction items to compare alongside the chosen board product.',
    detail:'The first supplied photograph shows the frame already in place, followed by board fitting and completed details. Confirm the exact board system, supply responsibilities and site requirements for your own proposal.',
    label:'See the Mitchell composite deck stages and recorded scope',
  },
  '/news/timber-deck-maintenance-canberra/':{
    heading:'Melba: board repairs before cleaning and oiling',
    answer:'Resolve board defects before treating the enquiry as surface care alone. At Melba in May 2025, our carpentry team repaired raised and distorted boards, then carried out cleaning and surface preparation before applying Cabot’s oil-based decking oil. The project connects the repair decision with the later coating work.',
    detail:'The photographs show the weathered surface, cleaning, oil application and finished appearance. For another deck, the existing coating and timber condition determine the preparation and compatible product; the surface photographs cannot show concealed supports.',
    label:'See the Melba deck repairs, cleaning and oiling record',
  },
};

function guideFigure(route,media){
  let img=`<img src="${esc(media.src)}" alt="${esc(media.alt)}" width="${media.width}" height="${media.height}" loading="lazy" decoding="async">`;
  // Reuse Task 1's legacy asset delivery; project assets already have variants.
  img=enhanceImageDelivery(img,route);
  if(!img.includes(' srcset='))img=img.replace('<img ',`<img srcset="${[400,800].filter(width=>width<media.width).map(width=>`${esc(media.src.replace('.webp',`-${width}.webp`))} ${width}w`).concat(`${esc(media.src)} ${media.width}w`).join(', ')}" `);
  img=img.replace(/ sizes="[^"]*"/,'').replace('<img ',`<img sizes="${guideSizes}" `);
  const projectLink=media.projectHref?` <a href="${esc(media.projectHref)}">${esc(projectContext[route].label)}</a>.`:'';
  return `<figure class="guide-editorial-figure">${img}<figcaption>${esc(media.caption)}${projectLink}</figcaption></figure>`;
}

const districtCases={
  gungahlin:['/projects/mitchell-composite-deck/','Mitchell composite deck: site and installation stages','The August 2025 Mitchell record covers site levelling, subframe construction and WPC board installation.'],
  belconnen:['/projects/melba-deck-care/','Melba timber deck repairs, cleaning and oiling','The May 2025 Melba record combines board repairs, cleaning and oiling with Cabot’s oil-based decking oil.'],
  'woden-valley':['/projects/pearce-wardrobe-installation/','Pearce IKEA wardrobe assembly and fitted details','The March 2026 Pearce record covers IKEA product assembly and fitting, with measurement and edge finishing.'],
};

// Replace one existing narrative section per service with practical quote prompts;
// keep its scope and factual boundaries rather than repeating them in another block.
const quoteDecisions={
  '/services/composite-decking/':{
    heading:'Site measure and composite deck quote',
    lead:'At the on-site measure, we check the footprint, levels, access and proposed board system. The quote brings these items together:',
    items:[
      'Supply: confirm who orders the selected boards, fixings and edge components, and which product instructions apply.',
      'Construction: identify site preparation, subframe work, board fitting, perimeter finish and any steps or railings.',
      'Site work: include access, removal, disposal and the relevant structural and ACT approval responsibilities.',
    ],
  },
  '/services/deck-cleaning-and-oiling/':{
    heading:'Deck assessment and surface-care quote',
    lead:'The on-site assessment checks the existing surface and any reported defects. The quote separates timber repair from cleaning and oiling:',
    items:[
      'Board repairs: identify the defects to address before cleaning or oiling; surface work does not repair deteriorated supports.',
      'Surface care: confirm the treated area, preparation, selected product and who supplies it. Keep the product’s care information with the agreed scope.',
      'Access and use: agree protection of nearby surfaces, furniture handling and debris removal. Use the selected product’s weather and drying instructions to agree when the area can be used.',
    ],
  },
  '/services/built-in-wardrobes/':{
    heading:'Wardrobe measure, product supply and fitting quote',
    lead:'An on-site measure establishes the fitted layout. The Pearce project uses IKEA products assembled and installed by Ellis; the quote needs to identify:',
    items:[
      'Product supply: record the selected units and hardware, who orders them and who supplies them after the measured fit is agreed.',
      'Installation: identify assembly, fitting and the specified edge and finishing details in the carpentry quote.',
      'Manufacture: IKEA supplies the wardrobe products shown at Pearce. Any separately manufactured components for a different layout need an identified supplier and specification.',
    ],
  },
  '/services/under-stair-storage/':{
    heading:'Under-stair measure and installation quote',
    lead:'The on-site measure checks the slope, fixing surfaces and door clearances. Agree these details before purchasing cabinetry:',
    items:[
      'Layout and access: confirm the measured slope, cupboard or drawer opening, door travel and the access that must remain available beside and below the stair.',
      'Components: agree materials, hardware, product suitability and who supplies the cabinetry; confirm any fabrication requirements before ordering.',
      'Fitted boundary: include fitting, edge treatment and making-good, plus any agreed removal and decoration. Compare the finish with the adjoining stair and skirting.',
    ],
  },
};

export function enhanceEvidence(route,html){
  let output=html;
  const media=editorialMedia[route];
  if(media&&!output.includes('class="guide-editorial-figure"')){
    const context=projectContext[route];
    const introduction=context?`<section class="guide-project-context"><h2>${esc(context.heading)}</h2><p>${esc(context.answer)}</p><p>${esc(context.detail)} <a href="${esc(media.projectHref)}">${esc(context.label)}</a>.</p></section>`:'';
    output=output.replace('<div class="article-prose">',`<div class="article-prose">${introduction}${guideFigure(route,media)}`);
  }
  if(route==='/service-areas/'){
    for(const [district,[href,label,copy]] of Object.entries(districtCases)){
      const pattern=new RegExp(`(<section class="district" id="${district}">[\\s\\S]*?)(</section>)`);
      output=output.replace(pattern,(_,block,end)=>block.includes(`href="${href}"`)?block+end:block.replace('<div class="district-context">',`<div class="district-context"><p class="district-project"><a href="${href}">${esc(label)}</a>. ${esc(copy)}</p>`)+end);
    }
  }
  if(route==='/service-areas/')output=output.replaceAll('<div class="district-context"></div>','');
  const decision=quoteDecisions[route];
  if(decision){
    const existing=new RegExp(`<section><h2>${esc(decision.heading)}</h2><p>[\\s\\S]*?</p></section>`);
    output=output.replace(existing,`<section class="quote-scope-decision"><h2>${esc(decision.heading)}</h2><p>${esc(decision.lead)}</p><ul>${decision.items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></section>`);
  }
  if(route==='/contact/'&&!output.includes('id="enquiry-form"')){
    output=output.replace(/(<section class="page-hero shell">[\s\S]*?<\/h1>)/,`$1<a class="btn btn-primary enquiry-jump" href="#enquiry-form">Go to the enquiry form</a>`);
    output=output.replace('<form class="enquiry-form" action="/api/contact" method="post">','<form class="enquiry-form" id="enquiry-form" tabindex="-1" aria-labelledby="enquiry-form-heading" action="/api/contact" method="post"><h2 id="enquiry-form-heading">Your carpentry enquiry</h2>');
  }
  return output;
}
