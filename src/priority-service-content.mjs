// Service-specific detail on existing URLs. Photo commentary is illustrative:
// no invented project location, dates, customer testimonial or performance claim.
export const priorityServices = {
  'fascia-and-eaves-repairs': {
    photos: 'Roof-edge boards, deteriorated edges and adjoining connections illustrate the component differences discussed above. A close view complements the overall roof-edge position when describing a repair.',
    guides: [['fascia-bargeboard-eaves', 'Fascia, bargeboard and eaves: component differences and repair planning']],
  },
  'pergola-timber-repairs': {
    photos: 'The post-base detail draws attention to the junction between retained and replacement timber. Its suitability for a particular structure follows assessment of the post, connections and footing.',
    guides: [['pergola-post-rot', 'Pergola post rot: base repair, replacement and moisture protection']],
  },
  'timber-stair-and-handrail-repairs': {
    photos: 'The stair view and handrail close-up illustrate different support points: tread edges, rail joints and wall connections. A surface view does not establish the condition of concealed anchorage.',
    guides: [['loose-timber-stairs', 'Loose timber stairs and handrails: supports and repair scope']],
  },
  'skirting-and-architraves': {
    photos: 'Skirting, door surrounds and floor transitions illustrate why profile height, thickness and adjoining levels matter together. A safe close-up of existing trim can help discuss the match before the on-site measure.',
    guides: [['skirting-after-new-flooring', 'Skirting after new flooring: profile matching and installation planning']],
  },
  'deck-repairs': {
    photos: 'The overall deck and close board view illustrate the walking surface, perimeter and fixing positions. Those surface details do not establish the condition of the framing beneath.',
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
  // The complete service narrative and contextual guide links now live in
  // service-editorial.mjs. Keep only component commentary beside the photos.
  let output = html;
  output = output.replace('<div class="case-study-grid">', `<p>${escape(entry.photos)}</p><div class="case-study-grid">`);
  return output;
}
