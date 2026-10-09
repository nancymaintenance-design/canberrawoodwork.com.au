// Editorial content for existing URLs only: no district doorway pages.
import { enrichPriorityService, enrichPriorityGuide } from './priority-service-content.mjs';
export const articleSearchTitles = {
  'timber-door-sticks-after-rain':'Timber Door Repairs After Wet Weather',
  'deck-boards-or-frame':'Deck Board and Timber Frame Repairs',
  'rotten-window-sill':'Rotten Timber Window Sill Repairs',
  'fascia-bargeboard-eaves':'Fascia, Bargeboard and Eaves Repairs',
  'leaning-paling-fence':'Leaning Timber Fence and Post Repairs',
  'skirting-after-new-flooring':'Skirting Board Installation After New Flooring',
  'why-timber-gates-sag':'Sagging Timber Gate and Hinge Repairs',
  'why-timber-rot-returns':'Rotten Timber Repairs and Moisture Protection',
  'cabinet-hinges-and-drawer-runners':'Cabinet Hinge and Drawer Runner Repairs',
  'timber-weatherboard-damage':'Damaged Timber Weatherboard Replacement',
  'loose-timber-stairs':'Loose Timber Stair and Handrail Repairs',
  'pergola-post-rot':'Rotten Pergola and Verandah Post Repairs',
  'repair-or-rebuild-a-deck':'Deck Repair, Replacement and Rebuilding',
  'carpentry-jobs-before-selling':'Small Carpentry Repairs Before Selling a Home'
};

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

export const repairGuideDetails = {
  'rotten-window-sill': [
    ['Window sill inspection and repair scope', 'Our timber window sill repair starts with the complete opening, not just the visible soft spot. We inspect the sill ends, frame junctions, exposed edges and adjoining coating, and establish which timber is sound enough to retain. The existing profile, projection and drainage detail guide the replacement shape. We record any further deterioration revealed through agreed inspection access and explain the revised work before extending the repair.'],
    ['Timber splice repair or sill replacement', 'For a defined damaged section with suitable surrounding timber, we cut back the deteriorated material and fit a replacement section to the retained profile. The repair plan identifies the joint, compatible materials, fixings and finish. Where deterioration extends across the sill or into connected frame sections, we specify a larger replacement rather than conceal the problem with surface filler. The condition of the supporting timber determines the repair extent.'],
    ['Window drainage, finishing and maintenance', 'We trace recurring wetting at the opening and plan the timber work around the water-entry cause. The finished sill must retain its drainage function; the selected protective coating and joint treatment are stated in the quote. At completion, we review the repaired junctions and any affected window operation against the agreed scope. Keep the sill clear of debris and arrange a check if paint breakdown, persistent dampness or movement returns.']
  ],
  'why-timber-rot-returns': [
    ['Assessing timber rot and the moisture source', 'Ellis inspects the damaged component and its adjoining timber to establish the repair boundary. We look at exposed end grain, deteriorated coatings, water-trapping joints and repeated wetting around the opening or outdoor structure. Inspection access is agreed before finishes are opened. This separates timber that can be retained from sections requiring replacement and gives the quote a defined repair scope rather than a cosmetic patch.'],
    ['Removing damaged timber and fitting replacement sections', 'We select the repair method according to the extent of deterioration and the function of the component. A localised defect can be addressed with a fitted replacement section where the retained timber and connection are suitable. More extensive decay calls for replacement of the affected member or connected sections. Timber profiles, exterior exposure, fixing conditions and finishing requirements are considered together. Supporting members receive the project-specific structural checks before disturbance.'],
    ['Protecting the repaired timber from repeat damage', 'The repair plan addresses the identified water path as well as the timber damage. We define the required moisture-source work, replacement timber, exposed-edge treatment and protective finish in the agreed scope. Clear drainage paths, suitable junction details and maintenance of the selected coating help protect the completed repair. We explain what was repaired and what maintenance remains; new softness or movement needs inspection rather than another coat of paint.']
  ],
  'pergola-post-rot': [
    ['Pergola post inspection and support planning', 'Our pergola and verandah timber repair assessment covers the post base, connected beams, roof attachments where present, and the fixing or footing detail. Before removing a deteriorated post, we establish how the connected structure will be supported and sequence the work accordingly. Ground-level photographs can help describe the issue, but the repair method follows the on-site condition. Do not cut away a support post or test a damaged structure by adding weight.'],
    ['Post base repair and replacement post selection', 'The damaged length and condition of the retained member determine whether a defined base repair or post replacement is appropriate. We specify the replacement timber, connection detail and fixing arrangement for the agreed work. Where decay extends into adjoining members or connections, the repair scope includes those affected components. Existing roof attachments, footing condition and applicable project requirements are reviewed before the replacement post is fitted.'],
    ['Drainage and finishing around the post base', 'We inspect how water reaches or collects around the post and consider adjacent ground level, drainage and the existing protective coating. The repaired base detail and finish are selected for the exposure and connected structure, rather than simply covering soft timber. At handover, the agreed work and care requirements are explained. Keep the base clear of trapped debris and arrange inspection if the post or its connections show renewed movement or deterioration.']
  ]
};

export const districtCopy = {
  'Belconnen':'Our Belconnen carpentry services cover timber doors, window frames, decks and fence repairs, including enquiries from Kaleen, Florey and Aranda. For a repair list across several parts of your property, describe each item so we can assess the work together. We check the damaged timber and its connections, then specify retained sections, replacement materials and finishing in your quote.',
  'Gungahlin':'Contact our Canberra team for carpentry services in Gungahlin, Amaroo, Casey and Ngunnawal. We repair gates and fences, replace damaged deck boards and fit interior timber trim. When a gate drags or a door will not latch, our assessment checks the supporting post or frame as well as the moving component, so the repair addresses the cause of the misalignment.',
  'Inner North & City':'Our carpentry services in Canberra’s Inner North and City include enquiries from Braddon, Ainslie and Dickson. Timber window repairs, door adjustments and matching skirting or architraves are assessed against the existing opening and profile. Tell us about parking, building access and the rooms involved so the measured repair or installation scope covers the site arrangements.',
  'Inner South':'For carpentry services in the Inner South, contact Ellis about work in Kingston, Griffith, Red Hill and Narrabundah. We assess timber windows, exterior doors, verandah timber and interior finishing. If retaining an existing timber profile matters, we measure the adjoining components and confirm the proposed replacement and finish before ordering materials.',
  'Woden Valley':'Our Woden Valley carpentry services cover Woden, Curtin, Chifley and Phillip. We repair cupboard hinges and drawer runners, fit shelving and complete skirting and architraves after renovation work. A hardware repair starts with compatible fittings and sound fixing points; a new installation starts with measured dimensions, the intended use and suitable wall fixings.',
  'Weston Creek':'Contact Ellis for carpentry services in Weston Creek, including Weston, Duffy, Fisher and Holder. Deck repairs, pergola timber repairs and fence post or rail replacement are assessed as connected assemblies. We check the condition of the supporting timber and the required access before defining the replacement sections and finishing work.',
  'Tuggeranong':'Our Tuggeranong carpentry services include enquiries from Kambah, Wanniassa and Gowrie. We repair timber stairs, handrails, decks, gates and exterior timber. For loose steps or rails, avoid using the affected component and tell us where movement occurs. We assess the supporting material and connections before specifying the repair and project checks.',
  'Molonglo Valley':'Ellis provides carpentry services in Molonglo Valley, including Denman Prospect, Whitlam and Wright. Contact us about deck construction or extensions, shelving, built-in storage and renovation finishing. We measure the available space and confirm the intended layout, materials, fixing details and project requirements in an installation plan and quote.',
  'East Canberra':'Our East Canberra carpentry services include enquiries from Fyshwick and Pialligo. We assess timber weatherboards, external trim, fences and smaller property repairs. Describe the affected component, approximate length and site access; our assessment checks the material, adjoining timber and moisture exposure before confirming replacement and finishing work.'
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
  if (article && repairGuideDetails[article.slug]) {
    const additions = repairGuideDetails[article.slug].map(([heading,copy])=>`<section><h2>${esc(heading)}</h2><p>${esc(copy)}</p></section>`).join('');
    output = output.replace('<section><h2>What to send with your enquiry</h2>',`${additions}<section><h2>What to send with your enquiry</h2>`);
  }
  return enrichPriorityGuide(route, enrichPriorityService(route, output));
}
