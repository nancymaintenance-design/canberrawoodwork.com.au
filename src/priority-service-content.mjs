// Service-specific detail on existing URLs. Photo commentary is illustrative:
// no invented project location, dates, customer testimonial or performance claim.
export const priorityServices = {
  'fascia-and-eaves-repairs': {
    scope: 'Fascia repair addresses the timber along the lower roof edge; bargeboard repair addresses the sloping gable edge. Eaves lining closes the underside and needs its own material check. Ellis repairs these components according to their condition, rather than treating every roof-edge defect as the same job. We inspect the damaged section and adjoining fixings before choosing a fitted timber repair or fascia replacement.',
    method: 'For fascia replacement, we record the existing profile and junctions, remove deteriorated timber and fit the agreed replacement sections to suitable fixing points. We check exposed ends and joints and define the protective finish. The assessment also identifies repeated wetting, so the work plan addresses the cause alongside the timber repair. Eaves repair begins with material identification before any lining is disturbed.',
    photos: 'The work photos show roof-edge timber and a close view of deteriorated material being prepared for repair. Paint breakdown, damaged edges and adjoining connections are assessed together to define the timber replacement and finishing work.',
    guides: [['fascia-bargeboard-eaves', 'Fascia, bargeboard and eaves: component differences and repair planning']],
  },
  'pergola-timber-repairs': {
    scope: 'Pergola and verandah repairs cover timber posts, beams and their connections. A soft post base needs more than a new surface finish: we check the remaining member, footing and connected structure to select the repair extent. Ellis plans the support sequence before removing damaged timber and confirms the replacement and finishing details in the quote.',
    method: 'A defined post-base repair retains suitable timber above the affected section and uses an agreed connection detail. Where the damage extends further, we specify post replacement and inspect the adjoining beam connection. Ground level, trapped debris and repeated wetting inform the base detail and finish. Our completion checks cover the repaired connections and the work agreed for the structure.',
    photos: 'The post-base detail shows renewed timber below an existing outdoor post. The repair junction, base and connected framing are key parts of our assessment. We select the repair extent and connection detail for the condition of the structure.',
    guides: [['pergola-post-rot', 'Pergola post rot: base repair, replacement and moisture protection']],
  },
  'timber-stair-and-handrail-repairs': {
    scope: 'Our timber stair repair service addresses loose treads, damaged step edges and the timber or fixings supporting them. Handrail repairs include rail joints, brackets and fixing points. We assess the moving component and its support together, then define the repair required to restore the agreed use. This page concerns repairs to existing stairs and handrails, not a new staircase design service.',
    method: 'We check tread movement, supporting timber and connection condition before replacing a damaged section or renewing fixings. A handrail repair includes the fixing substrate, not only the visible bracket. We confirm matching profiles, access, finishing and relevant project checks before work, then review the repaired components against the agreed scope. Avoid using a loose step or rail while awaiting assessment.',
    photos: 'The overall stair view and handrail close-up illustrate the parts inspected together: step edges, rails and wall connections. Our assessment checks the affected support and fixing points so the repair addresses the source of movement.',
    guides: [['loose-timber-stairs', 'Loose timber stairs and handrails: supports and repair scope']],
  },
  'skirting-and-architraves': {
    scope: 'Ellis installs and replaces timber skirting boards and architraves in Canberra. Skirting finishes the wall-to-floor junction; architraves finish around doors and windows. We measure the existing profile, height and thickness to select a suitable match, and check the new floor level where flooring has changed.',
    method: 'The measured trim plan sets out lengths, corners, joins and transitions to adjoining profiles. We prepare suitable fixing points and fit the selected trim around the existing openings and floor junction. Removal, supply, caulking and painting are identified in the quote. We check door clearance separately where a changed floor level affects opening and closing.',
    photos: 'The trim photos show skirting, door surrounds and a floor transition. These are useful references when discussing profile matching and the junction between old and new work. Bring a safe close-up of your existing trim if available; we take the installation measurements on site.',
    guides: [['skirting-after-new-flooring', 'Skirting after new flooring: profile matching and installation planning']],
  },
  'deck-repairs': {
    scope: 'Deck repairs and timber deck maintenance start with the boards and their supporting assembly. We check loose fixings, worn edges, deteriorated boards, joists, bearers and posts to identify the work required. Board replacement retains supports suitable for continued use; supporting timber repairs are defined before replacement boards are installed. Our service focuses on the timber repair scope, rather than presenting cleaning or coating alone as a structural repair.',
    method: 'We specify board dimensions, replacement sections and compatible fixings for the assessed deck. The repair plan considers drainage gaps, exposed ends, edges and transitions to steps. Surface preparation and protective coating are stated as inclusions where agreed, not assumed to be included in every repair. After the timber work, we check the repaired boards and connections and explain the agreed finish and care requirements.',
    photos: 'The overall deck and board close-up illustrate the walking surface, perimeter trim and fixing details. Our on-site assessment checks these exposed components together with the supports to specify board replacement and any supporting timber repairs.',
    guides: [['deck-boards-or-frame', 'Deck boards or supporting frame: identifying the repair scope'], ['repair-or-rebuild-a-deck', 'Deck repair, replacement and rebuilding: compare the options']],
  },
};

const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export const priorityGuideDetails = {
  'fascia-bargeboard-eaves': 'A request for roof fascia repair should identify whether the affected timber is along the gutter edge or the gable. Eaves repair concerns the underside lining and its supports. Peeling paint can draw attention to an area, but the repair extent follows the timber condition and water path. Ellis checks these details on site and specifies a local timber repair or replacement of the affected section. The written scope distinguishes the timber work, access and agreed finishing.',
  'loose-timber-stairs': 'A loose tread and a loose handrail need different fixing checks. For a tread, Ellis examines the board and the members supporting it; for a handrail, we check joints, brackets and the fixing substrate. Replacing a screw without establishing a suitable fixing point does not address deteriorated supporting timber. We identify the affected sections and set out the timber, hardware and finish in the repair quote. Do not test a loose component by adding weight.',
  'skirting-after-new-flooring': 'Profile matching involves more than board height. Thickness and the shaped upper edge affect the transition to existing trim, while the floor level changes the junction and door clearance. Ellis measures the rooms and openings, records lengths and joins, and specifies suitable material and fixings. The quote identifies removal, supply, installation and the agreed caulking or paint finish. This separates a trim installation from any door adjustment needed after the flooring work.',
  'deck-boards-or-frame': 'Timber deck maintenance can include replacing deteriorated boards and renewing unsuitable or damaged fixings, but the supports must be assessed first. Ellis checks the board edges, drainage gaps and exposed timber alongside the joists, bearers and posts. The quote distinguishes board replacement, support repairs and agreed surface preparation or coating. A finished walking surface does not demonstrate the condition of the concealed frame; the repair decision follows the site inspection.',
};

export function enrichPriorityGuide(route, html) {
  if (!route.startsWith('/news/')) return html;
  const copy = priorityGuideDetails[route.split('/').filter(Boolean).at(-1)];
  if (!copy) return html;
  return html.replace('<section><h2>What to send with your enquiry</h2>', `<p>${escape(copy)}</p><section><h2>What to send with your enquiry</h2>`);
}

export function enrichPriorityService(route, html) {
  const entry = priorityServices[route.split('/').filter(Boolean).at(-1)];
  if (!entry || !route.startsWith('/services/')) return html;
  let output = html.replace('<ul class="sign-list">', `<p>${escape(entry.scope)}</p><ul class="sign-list">`);
  // Append to the existing narrative, without adding another small heading.
  output = output.replace('</div></div><aside class="detail-aside">', `<p>${escape(entry.method)}</p></div></div><aside class="detail-aside">`);
  output = output.replace('<div class="case-study-grid">', `<p>${escape(entry.photos)}</p><div class="case-study-grid">`);
  const links = entry.guides.map(([slug, label]) => `<a class="text-link" href="/news/${slug}/">${escape(label)} ↗</a>`).join(' · ');
  output = output.replace('<nav aria-label="Related carpentry services">', `<p>${links}</p><p>See our <a class="text-link" href="/service-areas/">Canberra carpentry service areas</a> and tell us your suburb when requesting a quote.</p><nav aria-label="Related carpentry services">`);
  return output;
}
