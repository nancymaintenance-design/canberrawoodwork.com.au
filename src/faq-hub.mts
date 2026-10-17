import type {TemplateData,FeedNode,FeedItem,Service,FAQ,Article} from './types.mjs';
import { canonicalFaqQuestion } from './faq-consolidation.mjs';
import { faqScenarios } from './faq-scenarios.mjs';

const escape = (value: string) => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const groups = [
  { id:'booking-and-quotes', title:'Booking & quotes', intro:'Small jobs, assessment, appointments and what your written quote should include.', owners:['small-carpentry-jobs'] },
  { id:'doors-and-windows', title:'Doors & windows', intro:'Sticking doors, damaged frames and sills, window operation and the right trade for the fault.', owners:['door-and-frame-repairs','timber-window-repairs'] },
  { id:'decking', title:'Decking', intro:'Boards, fixings and supports, repair or rebuilding, and preparation for a new deck.', owners:['deck-repairs','deck-building'] },
  { id:'fences-and-gates', title:'Fences & gates', intro:'Leaning fences, damaged posts and palings, gate alignment and shared-boundary quotes.', owners:['timber-fence-repairs','timber-gate-repairs'] },
  { id:'interior-trim-and-storage', title:'Interior trim & storage', intro:'Skirting, architraves, cupboard hardware, shelving and measured storage choices.', owners:['skirting-and-architraves','cabinet-door-and-drawer-repairs','interior-carpentry','custom-joinery'] },
  { id:'rot-and-exterior-timber', title:'Rot & exterior timber', intro:'Recurring moisture, roof-edge timber, weatherboards, stairs, pergolas and structural repair boundaries.', owners:['rotten-timber-repairs','fascia-and-eaves-repairs','timber-weatherboard-repairs','timber-stair-and-handrail-repairs','pergola-timber-repairs','structural-timber-repairs'] }
];
const intentRefinements = {
  204:'A joiner or cabinetmaker typically handles the measured design and manufacture of built-in wardrobes; fitting may also involve carpentry. A small cupboard-hardware repair is a different scope. Describe the storage use, dimensions and preferred finish, then confirm who designs, manufactures and installs the wardrobe in the proposal before ordering.',
  205:'Replacement cabinet doors need accurate measurements, a compatible hinge layout and a material and finish that suit the retained cabinets. New doors do not automatically require a whole new kitchen, but an exact match to an older finish may be unavailable. Confirm the manufacture and fitting arrangements, samples and price before ordering; a hinge-only repair quote does not cover new door manufacture.',
  206:'Under-stair storage starts with the usable space, access and intended contents. The layout must preserve stair supports and required clearances and account for concealed services. Discuss shelves, drawers or cupboards and the proposed finish, then confirm the measured design, manufacture and fitting scope. Structural changes need their own qualified assessment before installation is agreed.',
  210:'Check development approval and building approval separately for the proposed deck; exemption from one does not establish exemption from the other. The design, location, height, supports and site constraints determine the project checks. Ask the relevant design professional, builder and building certifier to establish the applicable requirements before construction. An existing repair assessment does not approve a new deck or extension.'
};
const approvalSources = [
  ['https://www.planning.act.gov.au/applications-and-assessments/building-approvals/check-if-you-need-a-ba','ACT building approval checks'],
  ['https://www.planning.act.gov.au/applications-and-assessments/development-applications/check-if-you-need-a-da','ACT development approval checks']
];

// Keep the original booking and knowledge answers. Only explicitly paired
// scenario/intent synonyms share a disclosure; every keyword ID remains traceable.
export function buildFaqHub(source: any[], keywordMap: { categories: { intent: any; scenario: any[]; }; }) {
  const items = source.map((item: any) => ({ ...item, keywordIds:[] }));
  for (const row of keywordMap.categories.intent) {
    const question = canonicalFaqQuestion(row.term);
    const item = items.find((item: { q: any; }) => item.q === question);
    if (!item) throw new Error(`FAQ hub missing intent: ${row.id}`);
    item.keywordIds.push(row.id);
    const number = Number(row.id.split('-').at(-1));
    if ((intentRefinements as Record<string,(typeof intentRefinements)[keyof typeof intentRefinements]>)[number]) item.a = (intentRefinements as Record<string,(typeof intentRefinements)[keyof typeof intentRefinements]>)[number];
    if ([203,210].includes(number)) item.sources = approvalSources;
  }
  for (const scenario of faqScenarios) {
    const rows = scenario.rows.map(number => {
      const row = keywordMap.categories.scenario.find((row: { id: string; }) => row.id === `CBR-C-${number}`);
      if (!row) throw new Error(`FAQ hub missing scenario source: ${number}`);
      return row;
    });
    let item = scenario.intent && items.find((item: { keywordIds: string|string[]; }) => item.keywordIds.includes(`CBR-C-${scenario.intent}`));
    if (!item) {
      item = { q:scenario.q, a:scenario.a, owner:rows[0].owner.split('/').at(-1), keywordIds:[] };
      items.push(item);
    } else {
      // The expanded answer addresses the paired symptom, with the existing
      // service-page answer retained by the service pipeline.
      item.a = scenario.a;
    }
    item.keywordIds.push(...rows.map(row => row.id));
    if (scenario.rows[0] === 277) item.sources = [['https://www.accesscanberra.act.gov.au/business-and-work/building-and-construction/asbestos-assessor-and-removal-licensing','ACT asbestos assessment and removal licensing']];
  }
  // Retain the hub's previous material-choice guidance as answered questions.
  items.push(
    { q:'Can existing material or items I supply be used?', a:'The condition, dimensions, fixing points and available matching material determine what can be retained. Confirm supplied-item compatibility and quantity before ordering, including the profile, hardware and finish. Ask the quote to distinguish supplied products from installation, making good and finishing so the responsibilities are clear.', owner:'small-carpentry-jobs', keywordIds:[] },
    { q:'How should I compare repair and replacement options?', a:'A local repair retains suitable surrounding material. Connected damage or a changed layout can lead to a wider scope. Compare the retained parts, replacement extent, expected appearance, finish and access rather than a headline price alone. Where supporting timber is damaged, the assessment must establish its condition before a smaller cosmetic repair is chosen.', owner:'small-carpentry-jobs', keywordIds:[] }
  );
  const seen = new Set();
  for (const item of items) {
    item.anchor = item.keywordIds.length ? `faq-${item.keywordIds[0].toLowerCase()}` : `faq-${slug(item.q)}`;
    if (seen.has(item.anchor)) throw new Error(`Duplicate FAQ anchor: ${item.anchor}`);
    seen.add(item.anchor);
    if (!groups.some(group => group.owners.includes(item.owner))) throw new Error(`Unclassified FAQ owner: ${item.owner}`);
  }
  return groups.map(group => ({ ...group, items:items.filter((item: { owner: string; }) => group.owners.includes(item.owner)) }));
}

export function renderFaqHub(source: { q: string; a: string; owner: string; group: string; }[], keywordMap: any) {
  const model = buildFaqHub(source, keywordMap);
  const nav = `<nav class="faq-topic-nav" aria-label="FAQ topics"><h2>Browse topics</h2><div class="faq-topic-links">${model.map(group => `<a href="#${group.id}"><span>${escape(group.title)}</span><span class="faq-topic-count">${group.items.length}</span></a>`).join('')}</div></nav>`;
  const content = model.map(group => `<section id="${group.id}" class="faq-group" aria-labelledby="${group.id}-heading"><div class="faq-group-heading"><p class="eyebrow">${group.items.length} QUESTIONS</p><h2 id="${group.id}-heading">${escape(group.title)}</h2><p>${escape(group.intro)}</p></div>${group.items.map((item: { anchor: any; keywordIds: any[]; q: any; a: any; sources: [any,any][]; owner: any; }) => `<details class="faq-item" id="${item.anchor}" data-keyword-ids="${item.keywordIds.join(' ')}"><summary>${escape(item.q)}</summary><p>${escape(item.a)}</p>${item.sources?.length ? `<p class="faq-sources">${item.sources.map(([url,label]) => `<a href="${escape(url)}">${escape(label)}</a>`).join(' · ')}</p>` : ''}<a class="faq-service-link" href="/services/${item.owner}/#service-questions">Related service questions ↗</a></details>`).join('')}</section>`).join('');
  return `<section class="faq-hub shell" aria-label="Carpentry questions and answers">${nav}<div class="faq-hub-answers">${content}</div></section>`;
}
