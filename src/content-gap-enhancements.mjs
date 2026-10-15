import {gapGuides} from './gap-guides.mjs';

const quote='/news/carpentry-quote-cost-factors/';
const materials='/news/timber-vs-composite-decking-canberra/';
const care='/news/timber-deck-maintenance-canberra/';
const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const a=(url,label)=>`<a href="${esc(url)}">${esc(label)}</a>`;
const sections={
  '/services/small-carpentry-jobs/':{
    questions:[['Can I compare a small-job quote using an hourly rate alone?','Not reliably. Compare the task list, material supply, access, disposal and finishing as well as the labour pricing basis. Ask Ellis to confirm any visit or minimum booking charge for your enquiry.']],
    links:[[quote,'What affects a carpentry quote'],['/contact/','Send your small-repair list to Ellis']]
  },
  '/services/door-and-frame-repairs/':{
    questions:[['What should I decide before buying a replacement internal door?','First confirm the measured opening, construction, permissible trimming and hardware requirements with the team. Ask whether your proposed fitting task is accepted and which supply, removal and finishing items the quote includes.']],
    links:[['/news/timber-door-sticks-after-rain/','Understand adjustment before replacing a sticking door'],[quote,'Compare door fitting and repair quote inclusions']]
  },
  '/services/timber-window-repairs/':{
    questions:[['Does a faulty sash always mean replacing the whole timber window?','No conclusion follows from that symptom alone. The operating mechanism, fixing timber, frame and sill need assessment. The proposal should distinguish component work from wider timber replacement and any separate glazing requirements.']],
    links:[['/news/rotten-window-sill/','Compare local sill repair with wider timber work'],['/services/rotten-timber-repairs/','Understand the moisture-source and retained-timber checks']]
  },
  '/services/deck-repairs/':{
    questions:[['Is a restoration quote the same as a deck repair quote?','Not necessarily. Ask which boards and supports are assessed or replaced, and whether the proposal is only surface preparation and coating. Ellis confirms the accepted repair and finishing inclusions after assessment.']],
    links:[[care,'Timber deck maintenance: when care becomes a repair enquiry'],['/news/repair-or-rebuild-a-deck/','Compare local repair, support repairs and rebuilding']]
  },
  '/services/deck-building/':{
    questions:[['What information helps compare new deck quotes?','Use the same footprint, height, board specification, support system, access, removal and finish. Ask which project checks and supply arrangements each proposal includes before comparing the price.']],
    links:[[materials,'Timber vs composite decking: compare the product and scope'],[quote,'What to check in a carpentry construction quote']]
  },
  '/services/custom-joinery/':{
    questions:[['What should a built-in wardrobe proposal identify?','The measured layout, storage use, doors and drawer clearance, materials, hardware, finish, manufacture or supply arrangements, fitting and making-good. Ask which drawing or sample you approve before ordering.']],
    links:[['/services/cabinet-door-and-drawer-repairs/','Repair an existing cupboard or wardrobe fitting'],['/services/interior-carpentry/','Plan on-site shelving and interior timber installation']]
  },
  '/services/interior-carpentry/':{
    questions:[['Does wall panelling include changing sockets or waterproofing?','Do not assume those inclusions. The timber installation scope identifies fitting and finish; electrical changes, wet-area systems and other specialist work need their own confirmed requirements and responsibilities.']],
    links:[['/services/custom-joinery/','Compare fitted shelving with custom built-in storage'],['/services/skirting-and-architraves/','Coordinate wall panelling with existing trim']]
  },
  '/services/skirting-and-architraves/':{
    links:[['/news/skirting-after-new-flooring/','Plan skirting around the finished floor level'],['/services/interior-carpentry/','Coordinate other room finishing details']]
  },
  '/contact/':{
    heading:'Prepare a quote enquiry without guessing the repair',
    paragraphs:['Include your suburb, the item, what has changed and any property-access arrangements. For several tasks, use one item per line. Existing plans or safe photos are optional; do not dismantle timber or enter an unsafe area to provide them.','Before accepting a visit, confirm any assessment, call-out or minimum booking charge. Before accepting the work, check the proposed materials, removal, finishing and price inclusions. Ask how labour is priced and when a visit is available before making booking plans.'],
    links:[[quote,'Read what affects a carpentry quote'],['/services/small-carpentry-jobs/','Describe several small tasks together']]
  },
  '/faq/':{
    heading:'Hourly-rate and quote comparisons',
    paragraphs:['An hourly rate is not the complete price of a repair. Materials, access, removal and finishing may be separate, and the time required follows the assessed condition. Ask Ellis how the proposed work will be priced and whether any visit or minimum booking charge applies before accepting an appointment.'],
    links:[[quote,'Understand labour, materials and quote inclusions'],['/contact/','Ask about the arrangements for your job']]
  },
  '/services/':{
    heading:'Compare repair and installation options',
    paragraphs:['A mixed repair list can be assessed through small carpentry jobs; new fitted storage starts with a measured layout. For decks, distinguish repairs to existing boards and supports from a new build or extension. These guides explain quote inclusions, material choices and the difference between surface care and timber repair.'],
    links:[[quote,'What affects a carpentry quote'],[materials,'Compare timber and composite decking'],[care,'Deck maintenance or repair: decide what to ask']]
  }
};

export function serviceContentExtras(route){
  return route.startsWith('/services/') && route !== '/services/' ? sections[route] || {} : {};
}

function block(item){
  const questions=(item.questions||[]).map(([q,answer])=>`<details class="faq-item"><summary>${esc(q)}</summary><p>${esc(answer)}</p></details>`).join('');
  return `<section class="service-local-notes shell content-gap-notes"><h2>${esc(item.heading)}</h2>${item.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}${questions}<p>${item.links.map(([url,label])=>a(url,label)).join(' · ')}</p></section>`;
}

export function enhanceContentGaps(route,html){
  let result=html;
  if(route==='/contact/'){
    const item=sections[route];
    const preparation=`<details class="contact-preparation"><summary>What to include and confirm</summary>${item.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}<p>${item.links.map(([url,label])=>a(url,label)).join(' · ')}</p></details>`;
    result=result.replace('</p></div><form class="enquiry-form"',`</p>${preparation}</div><form class="enquiry-form"`);
  }else if(sections[route] && !route.startsWith('/services/')){
    const marker=route.startsWith('/services/')&&route!=='/services/'?'<section class="service-local-notes shell">':'<section class="cta-panel">';
    result=result.replace(marker,block(sections[route])+marker);
  }
  const article=gapGuides[route.split('/').filter(Boolean).at(-1)];
  if(!article||!route.startsWith('/news/'))return result;
  if(route===quote||route===materials){
    result=result.replace('Request a carpentry assessment',route===materials?'Discuss deck materials and construction':'Request an itemised carpentry quote');
    result=result.replace('Contact Ellis for an on-site assessment and a written repair plan and quote.',route===materials?'Arrange an on-site measure to discuss the deck layout, board product and construction quote.':'Arrange an on-site assessment of the tasks you want included in the quote.');
  }
  // The shared guide renderer owns paragraph sections, anchors and citations.
  if(article.comparison){const t=article.comparison;const table=`<section><h2>Compare the material decisions</h2><div class="decision-table"><table><caption>${esc(t.caption)}</caption><thead><tr>${t.columns.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(([label,...cells])=>`<tr><th scope="row">${esc(label)}</th>${cells.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;result=result.replace('<p class="article-enquiry">',table+'<p class="article-enquiry">');}
  result=result.replace('<h2>Relevant official guidance</h2>','<h2>Sources and product guidance</h2>');
  // Only informational external links are changed; forms and contact channels stay intact.
  result=result.replace(/<a href="(https:\/\/[^"<>]+)">/g,'<a href="$1" target="_blank" rel="noopener noreferrer">');
  return result;
}
