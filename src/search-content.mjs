// Editorial content for existing URLs only: no district doorway pages.
import { enrichPriorityService } from './priority-service-content.mjs';

export const guideAnswers = {
  'CBR-C-331':'Carpentry includes on-site timber repair and installation; joinery focuses on fitted timber components, while cabinetmaking focuses on cabinets and storage units. Ellis confirms the measured design, supply and fitting arrangements for the work you request.',
  'CBR-C-335':'Moisture changes can affect door and frame dimensions. Ellis checks clearance, hinges, exposed edges and water entry before specifying adjustment or timber repair.',
  'CBR-C-337':'The latch and strike can become misaligned through hinge movement, frame movement or reduced clearance. We inspect the complete opening and repair the cause before setting the final latch alignment.',
  'CBR-C-339':'The jamb forms the side of the door frame and supports hardware or the closing edge. An architrave is the trim around the opening. We check both when damage extends beyond the visible finish.',
  'CBR-C-340':'Softness, broken coatings and deteriorated joints can indicate sill damage. Do not remove timber to investigate; Ellis checks the sill and adjoining frame on site to define the damage and moisture source.',
  'CBR-C-341':'A repair retains timber and connections that are suitable for continued use and replaces the affected sections. We assess the complete opening before comparing local repair with wider frame or sill replacement.',
  'CBR-C-342':'A sash that drops can have a balance, cord, hardware or fixing fault. Stop relying on the unsupported sash and arrange an assessment; Ellis checks the mechanism and timber support before defining the repair.',
  'CBR-C-345':'Surface weathering affects the exposed finish or timber surface; decay can compromise the material and connections beneath it. Appearance alone does not establish soundness, so we inspect the affected section before quoting.',
  'CBR-C-347':'Persistent moisture or damage extending beyond an earlier patch can cause repeat deterioration. Our repair plan identifies the water path, removes affected material to suitable retained timber and defines the protective finish.',
  'CBR-C-348':'Decay and insect damage have different causes and can coexist. Ellis assesses the remaining timber and uses available pest findings to plan the repair; suspected active pest activity requires treatment before replacement is completed.',
  'CBR-C-349':'Fascia follows the lower roof edge, a bargeboard follows a gable edge and eaves lining closes the underside. Material identification, water entry and access are checked for the actual component being repaired.',
  'CBR-C-350':'Overflow, leaks, debris or deteriorated roof-edge details can repeatedly wet the timber. We assess the water path and define moisture-source work alongside the fascia replacement and finish.',
  'CBR-C-353':'Board-only replacement is specified after the supporting joists, bearers, posts and connections are assessed as suitable for retention. Where supports need repair, that work is included before the new boards are fitted.',
  'CBR-C-356':'Timber movement, deteriorated fixing material or unsuitable or damaged connections can loosen deck fixings. We check the board and supporting member together rather than simply adding another screw.',
  'CBR-C-360':'Repeated moisture exposure around ground level can affect timber post bases. Ellis inspects the post, footing and surrounding drainage and specifies the replacement and connection detail for the affected fence section.',
  'CBR-C-362':'A moving post, loose hinge fixings or a distorted gate frame can change the clearance and latch position. We repair or adjust the affected parts as an assembly and check operation at completion.',
  'CBR-C-365':'Skirting finishes the wall-to-floor junction; architraves finish around openings. Ellis measures the profile, height and adjoining trim before specifying matching supply and installation.',
  'CBR-C-366':'We measure the existing height, thickness and shaped profile and compare suitable materials or samples. The selected match and finish are agreed before new trim is ordered.',
  'CBR-C-370':'Runner length, mounting position, load requirements and sound fixing points determine compatibility. Our assessment identifies a suitable replacement and any panel repair needed before fitting.',
  'CBR-C-371':'Cabinet repairs restore existing doors, drawers, fittings or panels. Custom cabinetry creates a measured storage layout with specified manufacture, materials and installation; the quote distinguishes the two scopes.',
  'CBR-C-374':'The wall substrate, fixing locations and intended shelf load determine the fixing system. Ellis checks the installation area and concealed-service considerations before specifying the shelving and supports.',
  'CBR-C-381':'Ellis reviews the existing structure and proposed repair or alteration to identify the applicable ACT project checks before work is agreed. A changed roof, footprint or support arrangement is not assumed to have the same requirements as a local timber repair.',
  'CBR-C-382':'Custom joinery suits measured alcoves, under-stair storage or fitted units where standard dimensions do not deliver the required layout. We measure the space and confirm design, materials and installation in your proposal.',
  'CBR-C-383':'Built-in storage is measured and fixed to the property; freestanding furniture is a separate movable item. Built-in work requires checks of the available space, substrates and fixing locations.',
  'CBR-C-387':'The proposed work, supporting structure and site conditions determine the relevant ACT checks. Our assessment and work plan identify those requirements before structural timber is disturbed; unsafe affected areas should not be used while awaiting assessment.'
};

export const districtCopy = {
  "Belconnen": "Belconnen, Kaleen, Florey and Aranda are suburb examples in this district. Include your actual suburb and identify the door, window, deck or other timber item. For several repairs, list each location and any restrictions on access so the visit can be planned around the full request.",
  "Gungahlin": "Use Gungahlin, Amaroo, Casey or Ngunnawal to help locate the property, then describe the task itself. For a gate or fence enquiry, note which boundary is accessible and whether the gate affects entry. Confirm the property contact and access before a visit is arranged.",
  "Inner North & City": "For City, Braddon, Ainslie and Dickson enquiries, include parking and building-entry arrangements where relevant. If matching existing trim or an opening profile matters, mention the retained material and rooms involved. The suburb identifies the location; the assessment establishes the repair condition.",
  "Inner South": "Kingston, Griffith, Red Hill and Narrabundah are examples for Inner South enquiries. State the timber component, whether the work is indoors or outside and any access restrictions. If the property has documents affecting proposed alterations, mention them when discussing the project scope.",
  "Woden Valley": "For Woden, Curtin, Chifley or Phillip, describe the affected fitting or the installation you want. A cupboard hinge repair and new shelving involve different measurements and fixing checks. Include the room and any authorised occupant contact needed for access.",
  "Weston Creek": "Weston, Duffy, Fisher and Holder are examples in Weston Creek. For outdoor timber work, note whether the affected area can be viewed safely from ground level and whether access crosses another property. Do not enter an unsafe space to obtain photos.",
  "Tuggeranong": "Include your actual suburb, such as Kambah, Wanniassa or Gowrie, and the affected item. If a stair, handrail or deck is loose, avoid the unsafe area while assessment is arranged. Describe where movement was noticed without testing the component again.",
  "Molonglo Valley": "Denman Prospect, Whitlam and Wright are suburb examples for Molonglo Valley. Distinguish a repair to an existing component from a new installation or extension. Mention available plans, intended use and access; material and project checks follow the actual proposal.",
  "East Canberra": "For Fyshwick or Pialligo, identify the property contact, requested timber work and access arrangements. Include any relevant restrictions on entry or working areas. Confirm the proposed task and visit details with the team rather than assuming the suburb alone establishes the scope."
};

const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const pageTitles = {
  '/':'Canberra Carpentry & Timber Repairs',
  '/services/':'Carpentry Services Canberra ACT',
  '/service-areas/':'Carpentry Services Across Canberra ACT',
  '/about/':'About Our Canberra Carpentry Team',
  '/contact/':'Contact Our Canberra Carpentry Team',
  '/faq/':'Canberra Carpentry FAQs & Repair Quotes',
  '/news/':'Canberra Carpentry & Timber Repair Advice'
};
const serviceTitles = {
  'deck-repairs':'Deck Repairs Canberra',
  'deck-building':'Deck Building Canberra',
  'skirting-and-architraves':'Skirting & Architrave Installation Canberra',
  'custom-joinery':'Custom Joinery Canberra',
  'interior-carpentry':'Interior Carpentry Canberra',
  'pergola-timber-repairs':'Pergola & Verandah Repairs Canberra',
  'timber-stair-and-handrail-repairs':'Timber Stair & Handrail Repairs Canberra'
};

export function enhanceSearchContent(route, html, { services, articles, areas }) {
  let output = html;
  const service = services.find(item => route === `/services/${item.slug}/`);
  const article = articles.find(item => route === `/news/${item.slug}/`);
  const title = pageTitles[route] || (service && (serviceTitles[service.slug] || `${service.title} Canberra`)) || (article && article.title);
  if (title) output = output.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)} | Ellis Services Group</title>`);
  if (service) {
    output = output.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${esc(service.title)} in Canberra</h1>`);
    output = output.replace(/<script type="application\/ld\+json">(.*?)<\/script>/gs,(match,json)=>{
      const schema=JSON.parse(json);
      if(schema['@type']!=='Service')return match;
      schema.name=`${service.title} in Canberra`;
      return `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`;
    });
    output = output.replace(/<h2>Our (repair|installation) plan<\/h2>/, `<h2>${esc(service.title)}: ${['deck-building','custom-joinery','interior-carpentry','skirting-and-architraves'].includes(service.slug) ? 'installation' : 'repair'} method</h2>`);
    output = output.replace('<h2>Planning your work in Canberra</h2>', `<h2>Booking ${esc(service.title.toLowerCase())} in Canberra</h2>`);
    // Preserve every mapped service term but render one readable scope paragraph.
    output = output.replace(/(<section class="keyword-scope shell">[\s\S]*?)<ul>([\s\S]*?)<\/ul>/, (match, start, list) => {
      const terms = [...list.matchAll(/<li>(.*?)<\/li>/g)].map(m=>m[1]);
      return `${start.replace('Related carpentry requests',`${esc(service.title)}: related work`)}<p>Related work includes ${terms.join(', ')}. Tell our team which components need attention when requesting your quote.</p>`;
    });
  }
  if (route === '/') {
    output = output.replace('The work we’re here for','Carpentry services in Canberra');
    output = output.replace('Find the right starting point','Timber repair and installation services');
    output = output.replace('Deck details matter.','Deck repairs and board replacement');
    output = output.replace('Clear from first contact','Carpentry assessment and written quotes');
    output = output.replace('Useful reads for Canberra homes','Canberra timber repair guides');
    output = output.replace('<h2>Across Canberra</h2>','<h2>Local carpentry services across Canberra ACT</h2>');
    output = output.replace('Browse ACT districts and tell us your suburb when you get in touch.', 'Looking for a carpenter near me? Our Canberra office and carpentry team provide timber repairs, outdoor carpentry and interior installation across the ACT districts below. Tell us your suburb and the work you need to arrange an on-site assessment.');
  }
  if (route === '/service-areas/') {
    output = output.replace(/<h1>[\s\S]*?<\/h1>/,'<h1>Carpentry Services Across Canberra ACT</h1>');
    for (const [name] of areas) {
      output = output.replace(`<h2>${esc(name)}</h2>`, `<h2>Carpentry Services in ${esc(name)}</h2>`);
      output = output.replace(`<p>For a timber repair in ${esc(name)}, explore relevant work below and include your suburb in the enquiry. The same scope-first approach applies across Canberra.</p>`, `<p>${esc(districtCopy[name])}</p>`);
    }
    output = output.replace('<h2>Choose a district</h2>','<h2>Find local carpentry services near you</h2>');
    output = output.replace('<h2>Tell us where the work is.</h2>', '<h2>Book a carpenter in your Canberra suburb</h2><p>Searching for carpentry services near me? Contact our team at 121 Marcus Clarke St, Canberra, ACT 2600 with your suburb and repair or installation details. We arrange site visits across the nine service areas listed above.</p>');
    output = output.replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="Local carpentry services across Canberra ACT, including Belconnen, Gungahlin, Woden Valley and Tuggeranong. Contact Ellis for timber repairs and installation.">');
  }
  if (route === '/news/') {
    const groups = [
      ['Timber Repair Advice','door-and-frame-repairs','timber-window-repairs','rotten-timber-repairs','fascia-and-eaves-repairs','timber-weatherboard-repairs'],
      ['Deck, Fence and Pergola Repair Guides','deck-repairs','deck-building','timber-fence-repairs','timber-gate-repairs','pergola-timber-repairs','timber-stair-and-handrail-repairs'],
      ['Interior Carpentry and Cabinet Repair Guides','skirting-and-architraves','cabinet-door-and-drawer-repairs','interior-carpentry']
    ];
    const hub = `<section class="scenario-hub shell"><p class="eyebrow">CARPENTRY REPAIR GUIDES</p><h2>Canberra carpentry advice by service</h2><p>Explore timber repair methods, replacement options and installation preparation. Each guide explains the affected components and links to the Ellis service for your work.</p><div class="scenario-grid">${groups.map(([heading,...owners])=>`<details open><summary>${heading}</summary><ul>${articles.filter(a=>owners.includes(a.owner)).map(a=>`<li><a href="/news/${a.slug}/">${esc(a.title)} ↗</a></li>`).join('')}</ul></details>`).join('')}</div></section>`;
    output = output.replace(/<section class="scenario-hub shell">[\s\S]*?<\/section>/,hub);
  }
  return enrichPriorityService(route, output);
}
