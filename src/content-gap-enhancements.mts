import type {TemplateData,FeedNode,FeedItem,Service,FAQ,Article} from './types.mjs';
import {gapGuides} from './gap-guides.mjs';

const quote='/news/carpentry-quote-cost-factors/';
const materials='/news/timber-vs-composite-decking-canberra/';
const care='/news/timber-deck-maintenance-canberra/';
const esc=(value: any)=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const a=(url: any,label: any)=>`<a href="${esc(url)}">${esc(label)}</a>`;
const sections={
  '/services/small-carpentry-jobs/':{
    heading:'Small-job costs and visit arrangements',
    paragraphs:['Describe small carpentry repairs as individual tasks: for example, a door adjustment, a loose cupboard fitting and a missing trim length. This helps separate the work you want from a general hourly-rate enquiry. Each task still needs its condition, materials and access assessed before the grouped scope is agreed.','Ask how labour will be priced for the proposed tasks, whether a call-out or minimum booking charge applies and which materials, disposal and finishing are included. An hourly figure alone does not establish the completed cost. Confirm the appointment and charging arrangements before accepting a visit; this page does not promise a standard hourly rate, a free assessment or a discount for a longer list.'],
    questions:[['Can I compare a small-job quote using an hourly rate alone?','Not reliably. Compare the task list, material supply, access, disposal and finishing as well as the labour pricing basis. Ask Ellis to confirm any visit or minimum booking charge for your enquiry.']],
    links:[[quote,'What affects a carpentry quote'],['/contact/','Send your small-repair list to Ellis']]
  },
  '/services/door-and-frame-repairs/':{
    heading:'Internal door fitting and replacement enquiries',
    paragraphs:['If you want an internal door hung rather than repaired, say so when contacting Ellis. Identify whether you have already bought the door and hardware, whether the frame is staying and whether flooring has changed. The measured opening, door construction, trimming allowance and hinge and latch positions determine whether the supplied item is suitable. Confirm the accepted fitting scope before ordering.','Repairing a sound leaf with a defined alignment fault differs from replacing a damaged leaf or restoring a softened hinge fixing. The written proposal should identify retained parts, any door or jamb replacement, hardware supply, removal and finishing. A replacement door does not itself correct movement or damage in the frame. Garage doors, automatic access, glazing, lock mechanisms and fire-rated assemblies are not established by an internal timber-door enquiry.'],
    questions:[['What should I decide before buying a replacement internal door?','First confirm the measured opening, construction, permissible trimming and hardware requirements with the team. Ask whether your proposed fitting task is accepted and which supply, removal and finishing items the quote includes.']],
    links:[['/news/timber-door-sticks-after-rain/','Understand adjustment before replacing a sticking door'],[quote,'Compare door fitting and repair quote inclusions']]
  },
  '/services/timber-window-repairs/':{
    heading:'Sash-window components and repair choices',
    paragraphs:['A sash is the moving part of the window. If it sticks, drops or will not stay open, describe that separately from a rotten sill. The sash, its balance or cord, hardware, fixing points and surrounding timber can raise different repair questions. An unsupported sash should not be relied on; do not remove glass or dismantle the mechanism for an enquiry.','A local sill or frame repair may retain suitable adjoining timber. Connected decay, unsuitable fixing points or a wider operating fault can change that scope. Ask what can remain, which timber or hardware needs replacement and whether glazing access is required. Complete window manufacture, double-glazing conversion and a full heritage-restoration package are not implied by a timber repair request; confirm the applicable supplier, specialist and property requirements before changes.'],
    questions:[['Does a faulty sash always mean replacing the whole timber window?','No conclusion follows from that symptom alone. The operating mechanism, fixing timber, frame and sill need assessment. The proposal should distinguish component work from wider timber replacement and any separate glazing requirements.']],
    links:[['/news/rotten-window-sill/','Compare local sill repair with wider timber work'],['/services/rotten-timber-repairs/','Understand the moisture-source and retained-timber checks']]
  },
  '/services/deck-repairs/':{
    heading:'Deck restoration, maintenance or timber repair?',
    paragraphs:['If you ask for deck restoration, describe whether the problem is worn coating, damaged boards or movement in the deck. Those requests are not interchangeable. Surface preparation and oiling concern the finish; timber and connection defects need an assessed repair scope. Do not cover a defect with new boards or a new finish before the supporting area is understood.','Ellis carpentry provides deck repairs and stand-alone cleaning and oiling. The quote distinguishes board replacement, support work, access, removal and surface-care inclusions so these are not assumed to be interchangeable packages. If the footprint or whole support system needs changing, compare the repair proposal with a new construction scope.'],
    questions:[['Is a restoration quote the same as a deck repair quote?','Not necessarily. Ask which boards and supports are assessed or replaced, and whether the proposal is only surface preparation and coating. Ellis confirms the accepted repair and finishing inclusions after assessment.']],
    links:[[care,'Timber deck maintenance: when care becomes a repair enquiry'],['/news/repair-or-rebuild-a-deck/','Compare local repair, support repairs and rebuilding']]
  },
  '/services/deck-building/':{
    heading:'Deck materials and construction cost factors',
    paragraphs:['A deck-building quote follows the footprint, height, supports, ground and building connections, access and intended use. Ask the scope to separate board supply, framing and footings, steps or railings, removal of any existing deck and the agreed finish. A board-only price does not describe the completed project.','Ellis carpentry installs timber and composite decks. For material discussions, identify the proposed timber and finish or exact composite product, and compare the relevant care and installation documents rather than just a colour sample. The selected system, supply and construction details are agreed in the proposal. No single square-metre rate can establish the cost of an unassessed site.'],
    questions:[['What information helps compare new deck quotes?','Use the same footprint, height, board specification, support system, access, removal and finish. Ask which project checks and supply arrangements each proposal includes before comparing the price.']],
    links:[[materials,'Timber vs composite decking: compare the product and scope'],[quote,'What to check in a carpentry construction quote']]
  },
  '/services/custom-joinery/':{
    heading:'Built-in wardrobes and under-stair storage planning',
    paragraphs:['For a built-in wardrobe, begin with what must fit: hanging space, shelves, drawers or a combination. For under-stair storage, describe the available opening and anything that must remain accessible. Note door and drawer travel, skirting, nearby switches, vents and service access. Rough dimensions can explain the request, but the final layout needs an on-site measure.','Agree which layout or drawing you will approve, what products or components need manufacture and who is responsible for supply and fitting. This page does not establish an in-house factory or a complete kitchen-renovation service. A wardrobe hinge or runner repair may belong with existing cabinet repairs; fitting a standard shelf differs from designing a complete built-in unit. Confirm these boundaries in the proposal before ordering.'],
    questions:[['What should a built-in wardrobe proposal identify?','The measured layout, storage use, doors and drawer clearance, materials, hardware, finish, manufacture or supply arrangements, fitting and making-good. Ask which drawing or sample you approve before ordering.']],
    links:[['/services/cabinet-door-and-drawer-repairs/','Repair an existing cupboard or wardrobe fitting'],['/services/interior-carpentry/','Plan on-site shelving and interior timber installation']]
  },
  '/services/interior-carpentry/':{
    heading:'Timber wall panelling and fitted shelving',
    paragraphs:['For timber wall panelling, identify the room, walls to be covered, preferred layout and existing corners, doors, skirting and sockets. Confirm panel supply, wall preparation, fixings, edge details and painting or coating in the quote. Installing decorative timber does not establish waterproofing, an exterior cladding system or a scope to move electrical fittings.','For shelving, describe the intended use and objects to be stored. Standard components fitted on site belong in the installation discussion; a new measured storage unit with design and manufacture arrangements belongs with custom joinery. This distinction keeps a shelf-installation quote separate from the cost of creating a complete cabinet.'],
    questions:[['Does wall panelling include changing sockets or waterproofing?','Do not assume those inclusions. The timber installation scope identifies fitting and finish; electrical changes, wet-area systems and other specialist work need their own confirmed requirements and responsibilities.']],
    links:[['/services/custom-joinery/','Compare fitted shelving with custom built-in storage'],['/services/skirting-and-architraves/','Coordinate wall panelling with existing trim']]
  },
  '/services/skirting-and-architraves/':{
    heading:'MDF or timber skirting: match the room and finish',
    paragraphs:['When comparing MDF with timber skirting, record the existing profile, height, thickness and selected finish rather than choosing by the material name alone. Moisture-affected trim needs the source checked before replacement. A moisture-resistant product description does not by itself establish suitability for every wet location.','Ask the proposal to identify the material, preparation, joins, fixing and coating inclusions, and whether existing skirting will be retained, removed or replaced. Dimensions and the finished floor junction matter when matching an existing run. Confirm compatibility before buying customer-supplied lengths.'],
    links:[['/news/skirting-after-new-flooring/','Plan skirting around the finished floor level'],['/services/interior-carpentry/','Coordinate other room finishing details']]
  },
  '/contact/':{
    heading:'Prepare a quote enquiry without guessing the repair',
    paragraphs:['Include your suburb, the item, what has changed and any property-access arrangements. For several tasks, use one item per line. Existing plans or safe photos are optional; do not dismantle timber or enter an unsafe area to provide them.','Before accepting a visit, confirm any assessment, call-out or minimum booking charge. Before accepting the work, check the proposed materials, removal, finishing and price inclusions. The enquiry starts the scope discussion; it does not guarantee a free visit, a standard hourly rate or an immediate appointment.'],
    links:[[quote,'Read what affects a carpentry quote'],['/services/small-carpentry-jobs/','Describe several small tasks together']]
  },
  '/faq/':{
    heading:'Hourly-rate and quote comparisons',
    paragraphs:['An hourly rate is not the complete price of a repair. Materials, access, removal and finishing may be separate, and the time required follows the assessed condition. Ask Ellis how the proposed work will be priced and whether any visit or minimum booking charge applies before accepting an appointment.'],
    links:[[quote,'Understand labour, materials and quote inclusions'],['/contact/','Ask about the arrangements for your job']]
  },
  '/services/':{
    heading:'Plan the decision before requesting the work',
    paragraphs:['Use the service list for the component or installation you need. If you are still comparing the scope, the guides below explain quote inclusions, deck materials and the difference between surface care and timber repair. The assessment confirms which work applies to your property.'],
    links:[[quote,'What affects a carpentry quote'],[materials,'Compare timber and composite decking'],[care,'Deck maintenance or repair: decide what to ask']]
  }
};

function block(item: { questions?: string[][]; heading: string; paragraphs: string[]; links: string[][]; }){
  const questions=(item.questions||[]).map(([q,answer]:string[])=>`<details class="faq-item"><summary>${esc(q)}</summary><p>${esc(answer)}</p></details>`).join('');
  return `<section class="service-local-notes shell content-gap-notes"><h2>${esc(item.heading)}</h2>${item.paragraphs.map((p: any)=>`<p>${esc(p)}</p>`).join('')}${questions}<p>${item.links.map(([url,label])=>a(url,label)).join(' · ')}</p></section>`;
}

export function enhanceContentGaps(route: string,html: any){
  let result=html;
  if((sections as Record<string,(typeof sections)[keyof typeof sections]>)[route]){
    const marker=route==='/contact/'?'<section class="contact-layout shell">':route.startsWith('/services/')&&route!=='/services/'?'<section class="service-local-notes shell">':'<section class="cta-panel">';
    result=result.replace(marker,block((sections as Record<string,(typeof sections)[keyof typeof sections]>)[route])+marker);
  }
  const legacyLinks={
    '/news/deck-boards-or-frame/':[[care,'Read timber deck maintenance and repair boundaries'],[materials,'Compare the material decision before changing boards']],
    '/news/repair-or-rebuild-a-deck/':[[materials,'Compare timber and composite decking proposals'],[care,'Keep surface care separate from structural repair'],[quote,'Review the inclusions in a deck-work quote']]
  };
  if((legacyLinks as Record<string,(typeof legacyLinks)[keyof typeof legacyLinks]>)[route])result=result.replace('<div class="article-next">',`<section><h2>Materials, maintenance and the quote</h2><p>${(legacyLinks as Record<string,(typeof legacyLinks)[keyof typeof legacyLinks]>)[route].map(([url,label])=>a(url,label)).join(' · ')}</p></section><div class="article-next">`);
  const article=(gapGuides as Record<string,TemplateData>)[route.split('/').filter(Boolean).at(-1)!];
  if(!article||!route.startsWith('/news/'))return result;
  if(route===quote||route===materials){
    result=result.replace('Contact Ellis Services Group for an on-site assessment. We identify the cause and confirm your repair plan and quote.','Contact Ellis Services Group to discuss your requirements, materials and site access. Confirm the accepted scope, assessment arrangements and quote before booking.');
    result=result.replace('Arrange your timber repair assessment','Discuss your requirements and quote');
    result=result.replace('Contact Ellis Services Group with your suburb and the repair details. We arrange an on-site assessment, identify the cause and confirm the repair plan and quote.','Tell Ellis Services Group what you want to repair or build. Discuss the materials, on-site measure and accepted scope before agreeing the quote and booking arrangements.');
  }
  // The shared guide renderer owns paragraph sections, anchors and citations.
  if(article.comparison){const t=article.comparison;const table=`<section><h2>Compare the material decisions</h2><div class="decision-table"><table><caption>${esc(t.caption)}</caption><thead><tr>${t.columns.map((c: any)=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(([label,...cells]:string[])=>`<tr><th scope="row">${esc(label)}</th>${cells.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;result=result.replace('<section><h2>Start your enquiry</h2>',table+'<section><h2>Start your enquiry</h2>');}
  result=result.replace('<h2>Relevant official guidance</h2>','<h2>Sources and product guidance</h2>');
  // Only informational external links are changed; forms and contact channels stay intact.
  result=result.replace(/<a href="(https:\/\/[^"<>]+)">/g,'<a href="$1" target="_blank" rel="noopener noreferrer">');
  return result;
}
