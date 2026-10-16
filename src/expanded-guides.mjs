// Complete article bodies. Sections own their paragraphs, sources and stable anchors.
// Research phrases inform coverage; they are not search-volume or service guarantees.
export const guideSources={
  windows:['https://www.woodsolutions.com.au/applications-products/exterior/windows','WoodSolutions: timber windows, moisture and maintenance'],
  moisture:['https://www.woodsolutions.com.au/news/handling-moisture-affected-timber','WoodSolutions: resources on moisture-affected timber'],
  decking:['https://www.woodsolutions.com.au/applications-products/exterior/decking','WoodSolutions: timber decking and finish maintenance'],
  approval:['https://www.planning.act.gov.au/applications-and-assessments/building-approvals/check-if-you-need-a-ba','ACT Planning: check if you need building approval'],
  asbestos:['https://www.act.gov.au/housing-planning-and-property/staying-healthy-in-your-home/asbestos','ACT Government: asbestos risks in the home'],
  doors:['https://www.humedoors.com.au/support/product-support','Hume Doors: product care and finishing support'],
  runners:['https://www.blum.com/au/en/products/runnersystems/overview/','Blum Australia: drawer runner systems and compatibility'],
  composite:['https://www.modwood.com.au/technical-documentation/','ModWood: installation and product care documents'],
  heat:['https://www.trex.com/deck-ideas/composite-decking-myths/','Trex: composite decking and hot weather qualifications'],
  oil:['https://www.cabots.com.au/product/decking/cabots-natural-decking-oil/','Cabot’s: Natural Decking Oil preparation and care'],
  flooring:['https://www.quick-step.com.au/-/media/imported%20assets/flooring/6/8/0/qsinstallationlvthybridbloomenaupdf281672.ashx?filename=Installation+instructions+QS+Bloom.pdf&rev=2d82e3b4556e48a1bb3b3e1213843817&type=original','Quick-Step Bloom: product-specific floor and skirting instructions'],
};

const section=(id,heading,paragraphs,sources=[])=>({id,heading,paragraphs,sources});
export const expandedGuideBodies={};
const legacyAnchors={
  'carpentry-quote-cost-factors':{'hourly-fixed':'decision-1','extent-uncertainty':'decision-2','supply-and-match':'decision-3','access-removal-finish':'decision-4','minimum-and-visit':'decision-5','quote-request':'decision-6'},
  'timber-vs-composite-decking-canberra':{'care-commitment':'decision-2','sun-and-use':'decision-3','frame-compatibility':'decision-4','complete-material-price':'decision-5','material-enquiry':'decision-6'},
  'timber-deck-maintenance-canberra':{'safe-care-observations':'decision-2','preparation-scope':'decision-3','repair-before-finish':'decision-4','care-price-boundary':'decision-5','care-enquiry':'decision-6'},
};

const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
// Only explicit Markdown links are accepted; the text itself is always escaped.
const inline=text=>escape(text).replace(/\[([^\]]+)\]\((\/[^\s)]*|https:\/\/[^\s)]+)\)/g,'<a href="$2">$1</a>');
export function renderGuideSections(article){
  const body=expandedGuideBodies[article.slug];
  if(!body)return article.sections.map(([heading,text])=>`<section><h2>${escape(heading)}</h2><p>${escape(text)}</p></section>`).join('');
  const toc=`<nav class="decision-contents" aria-label="On this page"><p><strong>On this page</strong></p><ul>${body.map(s=>`<li><a href="#${escape(s.id)}">${escape(s.heading)}</a></li>`).join('')}</ul></nav>`;
  return toc+body.map(s=>`<section id="${escape(s.id)}">${legacyAnchors[article.slug]?.[s.id]?`<span id="${legacyAnchors[article.slug][s.id]}" aria-hidden="true"></span>`:''}<h2>${escape(s.heading)}</h2>${s.paragraphs.map(p=>`<p>${inline(p)}</p>`).join('')}${s.sources.length?`<p class="source-note">Guidance: ${s.sources.map(key=>{const [url,label]=guideSources[key];return `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)}</a>`;}).join(' · ')}.</p>`:''}</section>`).join('');
}

Object.assign(expandedGuideBodies,{
  'timber-vs-composite-decking-canberra':[
    section('decision-1','Compare a specified deck, not just two material names',[
      'Timber and composite decking both need a defined product and construction scope. Start with whether you are building, extending or repairing, then record the intended use, layout and finish. A hardwood species name or a composite colour does not describe the whole system. Samples help with appearance, but product documents and site assessment establish the details that need to be agreed.',
      'For timber, identify the species, board dimensions and coating proposal. For composite, identify the manufacturer, range, board system and associated fixing and edge components. Ask who supplies each item and which instructions apply. Ellis Services Group’s carpentry team installs composite decking. Confirm the product and site arrangement in the accepted proposal, which needs to specify the actual system.'
    ]),
    section('care-commitment','Choose the care commitment you are prepared to keep',[
      'Timber appearance and care depend on the selected finish and exposure. Composite also has cleaning and care requirements. ModWood publishes different care documents for its products, so use the document for the proposed range rather than assuming one method fits all composite boards. “Low maintenance” still needs a practical explanation of cleaning, stains and the owner’s responsibilities.',
      'Ask what routine care is expected, which products are compatible and what records should be kept. If a proposal compares lifetime costs, check the assumptions about future cleaning, recoating, repairs and replacement. No material is universally cheaper over its life. Your priorities may include preserving a timber appearance, reducing coating work or matching an existing area; describe them before choosing a product.'
    ],['composite']),
    section('sun-and-use','Think about sun, colour and everyday use',[
      'An exposed deck and a shaded area have different use conditions. Ask the supplier about the exact range and colour under the expected exposure, particularly where barefoot use matters. Trex qualifies its heat-mitigating products: they can still become hot in sustained direct sun and high temperatures. That is not a universal measured temperature comparison between all timber and composite products.',
      'A sample can show texture and colour but cannot reproduce every season or outdoor condition. Discuss shade, intended furniture, pets and how the space will be used. If the proposal includes slip or fire-performance claims, ask for the current product-specific evidence and its relevant installation conditions. A board category alone should not be treated as proof of suitability for every location.'
    ],['heat']),
    section('frame-compatibility','An existing frame needs a separate retention decision',[
      'Changing boards does not establish that old supports can be reused. The joists, bearers, posts and connections need assessment, and the proposed system’s support and fixing requirements need checking. Old fixing positions or a familiar board width are not enough to confirm compatibility. Ask how retained framing will suit the selected board system and what work is allowed for if it does not.',
      'ModWood’s technical directory illustrates why installation documents belong with the product specification. It is not evidence that your deck uses ModWood or that an old frame meets a particular range’s requirements. Where support damage is present, resolve it before treating the job as a surface conversion. The [board-versus-frame guide](/news/deck-boards-or-frame/) explains that assessment boundary.'
    ],['composite']),
    section('layout-and-detail','Edges, stairs and connections are part of the material choice',[
      'The visible walking surface meets walls, thresholds, outer edges, steps and sometimes rails or screens. Those details need to work with the chosen product and layout. A material-only square-metre comparison can overlook components and labour at these junctions. Ask what the proposal includes for edge treatment and how it relates to adjoining surfaces.',
      'For an extension, consider the old and new areas together. A visual match may be limited by weathering, product changes or different board dimensions. For a rebuild, clarify whether the footprint and access arrangement stay the same. The [repair-or-rebuild guide](/news/repair-or-rebuild-a-deck/) helps separate those scope choices before the product is selected.'
    ]),
    section('complete-material-price','Compare supply, construction and finish together',[
      'Put the complete footprint, supports, boards, fixings, removal, access and finishing beside the price. Confirm who orders the product and whether delivery and disposal are included. Timber coating work and a composite system’s fitting components may appear in different parts of the proposal, so request an explanation rather than assuming one line item covers them all.',
      'Ground preparation, difficult entry and changes to stairs or barriers can influence the completed cost. Ask what is retained, what is replaced and how concealed findings affect the quote. Our [carpentry quote guide](/news/carpentry-quote-cost-factors/) explains why a low board price cannot decide between two full installations. Compare the accepted scope and ongoing care obligations as well as the initial amount.'
    ]),
    section('records-and-warranty','Keep product records and project responsibilities clear',[
      'Ask for the current installation, care and warranty documents for the selected product. Read the warranty conditions and who provides it; a manufacturer’s document is not a blanket promise about every part of the installed deck. Confirm the agreed construction and supply responsibilities separately. Keep the quote, product identity and any variations together for future maintenance or repair enquiries.',
      'The actual new build, extension or repair also needs its applicable project checks confirmed with the relevant professionals. Material selection alone does not resolve approvals or structural suitability. The Mitchell project record above demonstrates one installation sequence and recorded scope, not a guarantee that another site will use the same preparation, supports or products.'
    ]),
    section('material-enquiry','Prepare a useful material discussion before ordering',[
      'Send your suburb, intended use, approximate layout if known and whether an existing deck is involved. Include available plans and product preferences, plus the care commitment you want to discuss. Optional safe photographs can show the area and access. Do not enter an unsafe deck space to supply measurements or an underside view.',
      'Use [new deck construction and extensions](/services/deck-building/) for the overall brief, or [composite decking installation](/services/composite-decking/) for the confirmed service. Ask which products and scope are accepted before ordering. The useful choice is a specified deck that suits the assessed site and the way you will care for it, with the complete inclusions visible in the quote.'
    ])
  ],
  'timber-deck-maintenance-canberra':[
    section('decision-1','Decide whether the enquiry is care, repair or both',[
      'A weathered-looking deck may need surface care, timber repairs or both. Ellis provides stand-alone deck cleaning and oiling as well as deck repairs. Cleaning and a renewed coating concern the exposed surface. Loose boards, movement, deteriorated supports or an unreliable barrier need assessment before appearance work is agreed. A new finish cannot establish that a deck is structurally suitable, and a photograph of grey boards cannot determine the concealed condition.',
      'Start with what you have already noticed and what result you want. If the issue is an aged finish on otherwise assessed suitable timber, define the preparation and coating scope. If a board moves or feels soft, describe that existing symptom without testing it again. Combining care and repair is possible as an agreed proposal, but the two decisions should remain understandable.'
    ]),
    section('safe-care-observations','Observe from accessible ground without testing the structure',[
      'Note rough edges, broken finish, debris at a junction or water remaining after rain where visible safely. Do not lift boards, crawl under an unsafe deck, lean over a loose rail or add weight to test movement. Keep an unstable or visibly damaged area out of use while assessment is arranged. A description is enough to start if new photos would require unsafe access.',
      'Mention stairs, barriers, building connections and earlier repairs. Existing plans and product records can help explain the layout. A surface-care request should still make known defects visible to the team before the booking is discussed. Hiding a loose board beneath furniture or postponing the symptom until coating day can leave the preparation scope unresolved.'
    ]),
    section('identify-coating','Identify the timber and existing coating where possible',[
      'Look for the old quote, coating container, product record or care instructions already held with the property. “Deck oil” may not identify the formulation or compatibility requirements. Timber species, previous finish and exposure all matter when discussing the next treatment. Do not apply a test coating or strip a patch simply to identify the old finish before professional advice.',
      'WoodSolutions advises following the coating manufacturer’s recommendations when recoating. Ask whether retained boards and new repair timber require different preparation and how the proposed product suits the existing surface. Keep the agreed product identity with the scope. A universal annual oiling instruction cannot replace the guidance for the actual finish and its condition.'
    ],['decking']),
    section('preparation-scope','Cleaning, sanding and coating are a defined sequence',[
      'A care quote should describe the treated area, preparation and selected coating. “Restoration” can mean different things, from cleaning to board replacement, so ask what will actually happen. Furniture handling, protection of adjoining walls or plants and debris removal can also affect the job. Sanding is not automatically appropriate for every board condition or previous coating.',
      'Cabot’s Natural Decking Oil guidance distinguishes preparation for different surface conditions and specifies weather limits for that product. It is an example of why product directions matter, not confirmation that it is the exact formulation used in the Melba project. The verified Melba record identifies Cabot’s oil-based decking oil; exact coats, dry times and cost were not supplied.'
    ],['oil']),
    section('repair-before-finish','Resolve board and support defects before treating the finish',[
      'A raised edge, split end or loose fixing may involve the board and the supporting material beneath it. Repeated movement or deteriorated connections should not be priced only as another coat of oil. The assessment needs to identify suitable retained components and any repair boundary. New boards may remain visually different from weathered retained material after the agreed finish.',
      'For widespread or connected defects, compare [repair with rebuilding](/news/repair-or-rebuild-a-deck/) before committing to surface work. A clean deck can still have a support problem. The Melba sequence above shows board repair followed by preparation and oiling; it does not establish that every deck has the same condition or needs the same sequence.'
    ]),
    section('exposure-care','Use exposure and product instructions to plan future care',[
      'Sun, repeated wetting, sheltered areas and debris collection can produce uneven wear across one deck. Discuss those patterns rather than assuming the entire surface needs treatment on one fixed calendar. WoodSolutions relates recoating to finish and exposure and recommends removing debris before recoating. Use the selected product’s instructions for the actual care method.',
      'Keep an eye on changes visible during normal safe use, and report new movement or softness as a repair enquiry. Do not try to compensate for a wet junction by adding repeated coating without reviewing the source. If you are considering changing board material to alter the care commitment, read [timber versus composite decking](/news/timber-vs-composite-decking-canberra/) and compare the complete system.'
    ],['decking']),
    section('care-price-boundary','Ask what the care price includes',[
      'Confirm the area, product supply, preparation, repairs, access and disposal in the quote. Ask whether the finish includes only repaired boards or the retained surface as well. Different preparation allowances can explain different prices for decks of a similar area. No universal coating life, drying time or maintenance cost is promised by the phrase “cleaning and oiling”.',
      'Agree weather and access arrangements under the selected product instructions, including when the area can be used and who confirms that at handover. Tell the team about furniture, pets and the only access route to the house. If repair findings change the job, ask for the added work and price basis to be explained before the extra work proceeds.'
    ]),
    section('care-enquiry','Send a useful deck-care enquiry and keep the record',[
      'For [deck cleaning and oiling](/services/deck-cleaning-and-oiling/), provide your suburb, the intended treated area, coating information if known and any defects already noticed. Use [deck repairs](/services/deck-repairs/) where movement or timber damage is the main issue. Optional safe overview and detail photos, earlier scopes and available product records help the team prepare the assessment.',
      'After agreed work, keep the quote, repair details, coating name and care information with your property records. These make the next maintenance discussion more precise than “it was oiled last time”. The practical takeaway is to establish condition first, define preparation and product second, then follow the care instructions for the work actually completed.'
    ])
  ],
});

Object.assign(expandedGuideBodies,{
  'repair-or-rebuild-a-deck':[
    section('whole-deck-decision','Start with condition and the layout you need',[
      'Repair is worth considering when damaged components can be defined and suitable boards, supports and connections retained. Rebuilding becomes a comparison when damage is widespread or connected, or when you want a different footprint, height or use. The percentage of worn boards cannot settle the decision. An old deck is not automatically beyond repair, and a recent surface is not proof of sound framing.',
      'Separate your two questions: what needs work now, and what would you like to change? A deck that could be repaired locally may still not suit a proposed extension or new stair position. Conversely, an appearance concern may only require defined surface care once defects are assessed. Tell the assessor both the observed problem and your intended use before asking for one headline price.'
    ]),
    section('deck-assessment','Assess the existing deck before selecting a scope',[
      'Stop using an unstable or visibly damaged area while assessment is arranged. Do not lift boards, crawl underneath an unsafe deck or add weight to test movement. Existing plans, earlier repair records and safely available photographs can help describe the structure. They do not confirm that concealed timber or connections are suitable for retention.',
      'Ask the assessment to distinguish the surface, supporting joists and bearers, posts, footings, building connections, stairs and barriers where present. The accessibility of these parts affects what can be established. If some areas cannot be checked initially, the quote should explain that uncertainty and the agreed inspection or variation process before covering them with new boards.'
    ]),
    section('local-board-choice','Local board repair preserves assessed useful material',[
      'A local board repair can suit a defined defect with suitable adjacent boards and retained supports. Its scope should name the boards, joins, fixing work and finishing boundary. Damaged ends beside a stair or wall may involve different access from boards in an open area. Ask how the proposed replacement relates to the existing layout rather than counting surface boards alone.',
      'New timber may differ in colour, texture or dimensions from the weathered surface. Agree a practical match and whether preparation or coating will include retained boards. Surface appearance and support condition are separate decisions. See [deck boards or framing](/news/deck-boards-or-frame/) for the distinction before comparing a board-only proposal with broader work.'
    ]),
    section('frame-choice','Frame and connection repairs need their own plan',[
      'Defined damage in a joist, bearer, post or connection can lead to a support repair rather than a complete rebuild, where the retained assembly is suitable. The repair method, safe sequence and any structural professional input need to follow the actual condition. A fresh walking surface cannot compensate for an affected support or an unsuitable connection.',
      'Ask which connected components will be checked, how access is provided and whether the wetting cause is included. A building junction or repeatedly damp corner deserves attention as a detail, not merely another replacement length. Where additional damage is found, the finding and proposed revised boundary should be explained before work beyond the accepted scope proceeds.'
    ]),
    section('rebuild-choice','A rebuild can answer connected defects or a changed brief',[
      'Rebuilding may provide a clearer option where several parts need work together or the retained structure does not suit the new design. Compare removal, site preparation, supports, boards, stairs, barriers and finish on the same basis. A rebuild quote should state what, if anything, is retained. Do not assume that “new deck” includes every adjoining landscape or drainage item.',
      'An extension also needs the existing and new systems considered together. The proposed material, connections and access may change the design. Discuss the intended furniture and use without assuming an old frame can accept a new surface or added area. The [timber and composite comparison](/news/timber-vs-composite-decking-canberra/) helps identify the product questions to settle before supply.'
    ]),
    section('act-deck-checks','Confirm building and planning responsibilities for the actual proposal',[
      'ACT guidance treats development approval and building approval as separate matters. A possible exemption from one does not settle the other, and general conditions sit alongside project-specific criteria. Ask the relevant professionals to check the actual repair, rebuild or extension. There is no single low-height shortcut that confirms every deck project’s requirements.',
      'Keep existing plans and approvals available and identify who confirms any new documentation before work is agreed. The quoted construction scope and approval responsibilities should fit together. This guide is a decision aid; it does not assess your property’s eligibility, certify an existing deck or promise an approval outcome or schedule.'
    ],['approval']),
    section('deck-written-quote','From assessment to a written quote',[
      'Our written quote identifies the agreed retained and replaced components, materials, fixings, removal, access and finishing. Confirm which specialist checks and project requirements apply, how additional findings are recorded and which parts remain outside the scope. A written variation should state the added work, price basis and scheduling effect before that extra work proceeds.',
      'Send your suburb, the observed symptoms, intended layout and available records. Optional safe photos can help start the discussion. Use [deck repairs](/services/deck-repairs/) for an existing defect or [new deck construction and extensions](/services/deck-building/) for the changed brief. The sensible decision follows the assessed retained structure and a comparable complete scope, then a care record for the work actually carried out.'
    ])
  ],
  'carpentry-jobs-before-selling':[
    section('presale-priority','Put safety and everyday operation ahead of cosmetic lists',[
      'For pre-sale carpentry, start with components that need to work: doors that close, fittings that hold and stairs or rails that are safe to use. Then consider damaged trim and visible finishing. A long list of cosmetic marks does not mean every item needs replacement. Repairs can address defined defects, but the quote does not establish a sale-price increase or promise a faster sale.',
      'If a tread, barrier or outdoor structure appears unsafe, avoid the affected area and arrange assessment. Do not test it again to decide whether it belongs on the list. A sticking door, failed latch and loose hinge may be three descriptions of one opening problem, so group symptoms by component instead of multiplying jobs before the cause is known.'
    ]),
    section('room-list','Make a room-by-room list the assessor can use',[
      'Give each item a location and one clear observed issue: laundry door rubs at the bottom; kitchen drawer drops on the right; hallway skirting has a damaged length. Add the intended result, such as restoring operation or matching retained trim. A description is enough to start, with optional safe photos where they show more than the words.',
      'Mention flooring, painting and other work already planned, plus any known leak or pest assessment. Include your suburb and the person authorised to arrange access. A task list also helps distinguish necessary repairs from optional upgrades, so ask for separate items where you may choose to accept only part of the proposal.'
    ]),
    section('fixout-sequence','Coordinate fix-out carpentry with flooring and painting',[
      'Fix-out generally refers to the finishing components of a build or renovation, such as internal doors and trims; the actual quote must name the requested work. New floor levels can affect door clearance and skirting junctions. Finishing a missing architrave after door replacement differs from repairing the structural frame, so describe both if they are affected.',
      'Agree who completes removal, fitting, caulking, priming and final painting. A fitted board is not necessarily a decorated room. Protecting new flooring and accessing walls behind furniture also require planning. The [skirting after flooring guide](/news/skirting-after-new-flooring/) explains the junction and sequencing questions that are useful before a sale photography date is set.'
    ]),
    section('repair-existing-cabinets','Assess local cabinet faults before replacing storage',[
      'A failed hinge, runner or kickboard can be a defined repair to an existing kitchen or wardrobe. Hardware compatibility and sound mounting points determine the option. Full cabinet replacement is a different decision, with supply and installation responsibilities to agree. Do not assume a loose cupboard door requires a whole new kitchen, or that a new hinge solves a damaged panel.',
      'For shelves in an uneven alcove, discuss the intended use, wall type, fixing positions and concealed-service considerations. A shelf is not safely specified by width alone. Electrical, plumbing and glazing tasks need their appropriate professionals. See [cabinet hinges and drawer runners](/news/cabinet-hinges-and-drawer-runners/) for the repair checks that can keep this part of the list focused.'
    ]),
    section('fitted-versus-furniture','New built-in storage is a measured installation brief',[
      'Freestanding furniture is movable; built-in storage is fitted to the property and needs a measured relationship with the room. Custom joinery may be appropriate when standard units do not achieve the required layout, but design, fabrication, supply and fitting are separate responsibilities to confirm. A small repair service does not establish in-house manufacturing facilities.',
      'For a wardrobe enquiry, include the space, intended storage, door arrangement, obstructions, existing units and finish expectations. Ask who supplies the product and who completes assembly and fitting. The [Pearce IKEA wardrobe installation](/projects/pearce-wardrobe-installation/) records that particular assembly and fitting scope; it does not establish a universal custom-manufacture service or a product partnership.'
    ]),
    section('sale-access-timing','Plan access around occupants and the actual booking',[
      'An occupied or tenanted property needs an authorised contact, agreed entry and a workable area. Mention keys, parking, furniture, pets and agent coordination when relevant. A proposed sale or inspection date helps explain your timing needs but does not guarantee availability. Confirm material lead times and accepted appointments with the team before relying on a completion date.',
      'If an assessment reveals a larger moisture or structural problem, keep it visible in the work plan rather than treating it as a rushed touch-up. Ask the appropriate property professional about any sale documentation or disclosure questions. The carpenter’s scope describes the physical work and its limits; it cannot decide the transaction’s legal requirements.'
    ]),
    section('presale-quote','Compare an itemised scope with your priorities',[
      'Ask for labour, materials, supply responsibility, removal, finish and access to be clear for the accepted tasks. Confirm any minimum booking or assessment charge and whether GST is included. Grouping several items may make coordination easier, but it does not establish a discount or mean every task can be completed at one visit.',
      'Start with [interior and renovation carpentry](/services/interior-carpentry/) or [small carpentry jobs](/services/small-carpentry-jobs/) and send the room list. Keep the accepted scope and any agreed variations with your property records. The useful pre-sale outcome is a prioritised list of defects repaired to an agreed finish, with optional upgrades considered separately on their own merits.'
    ])
  ],
  'carpentry-quote-cost-factors':[
    section('price-comparison','Compare the completed job before comparing the price',[
      'Carpentry cost depends on what must be assessed, supplied, repaired, accessed and finished. An hourly rate or a material price describes only part of that work. A small visible defect can involve careful matching or difficult access, while several simple tasks may have different supply needs. No general hourly rate can establish your final repair price from the symptom alone.',
      'Start with the component and the outcome you want: restore a closing door, replace a defined board group, fit matching trim or build a new deck. Then compare proposals for that same outcome. If one quote includes removal and decoration and another only installs supplied timber, the total prices answer different questions even if the job title looks identical.'
    ]),
    section('hourly-fixed','Hourly work, fixed scope and allowances need clear terms',[
      'Ask whether the proposed work is priced as an agreed scope, time-based labour or a combination with specified allowances. For time-based work, clarify what time and charges are included. For a quoted scope, check the assumptions and exclusions. The useful question is how the price is calculated for your accepted work, not which charging label is always better.',
      'An allowance for uncertain material or concealed work needs an explanation of what it covers and how it is reconciled. A safe photograph can help prepare an assessment, but it cannot establish every fixing point or hidden support. Ask what remains to be checked on site before treating an early estimate as a complete agreed price.'
    ]),
    section('extent-uncertainty','Visible size and repair extent can be different',[
      'A soft sill corner may extend into the frame; a loose deck board may involve its support; a cupboard hinge may have damaged mounting timber. These distinctions affect labour and materials. The assessment should identify suitable retained components, the proposed replacement boundary and any inspection access required. A narrow visible patch is not necessarily a narrow repair.',
      'Ask how further findings will be documented and when the price is reviewed. Additional work should have an explained scope and agreed price basis before it proceeds. The [deck repair-or-rebuild guide](/news/repair-or-rebuild-a-deck/) shows why apparently similar requests can become different construction scopes once the retained structure and intended layout are considered.'
    ]),
    section('supply-and-match','Materials and customer-supplied items change the proposal',[
      'Species, profile, dimensions, coating and hardware compatibility influence the specification. A common trim profile and a difficult match to old joinery can require different supply arrangements. Ask who orders the material, whether delivery is included and what happens if the selected item is unavailable. New material can remain visible beside weathered timber even after finishing.',
      'Owner-supplied products still need suitability and dimensions checked before fitting is agreed. A door, hinge or runner that looks similar may not be compatible with the existing assembly. Confirm responsibility for missing or unsuitable components and any extra visit they could require. Buying first and asking the installer to make it fit can change the job rather than reduce its cost.'
    ]),
    section('access-removal-finish','Access, removal and decoration are real work items',[
      'Mention height, stairs, narrow side access, occupied rooms and authorised entry arrangements. Safe equipment and protecting adjoining surfaces can be part of a small repair. Removal and disposal also need a defined boundary, especially with unknown old materials. A price for new timber alone should not be compared directly with one that includes dismantling and making good.',
      'Clarify preparation, priming, painting, staining or oiling by area and product where relevant. Primed boards are not the same as final-painted trim, and new deck boards are not automatically a sanded and oiled deck. Ask who moves furniture and who finishes the wall or floor affected by the work. These questions make the handover understandable before booking.'
    ]),
    section('minimum-and-visit','Confirm assessment and minimum charges directly',[
      'Ask whether an assessment, call-out, travel or minimum booking charge applies to your enquiry, how it is calculated and whether any amount is credited against later work. Do not assume that requesting a quote includes a free visit. Actual arrangements need confirmation with the team, particularly when a visit is needed to identify hidden damage or a difficult profile.',
      'For several small jobs, send one list with locations and symptoms. Ask whether they can be assessed together and how the quote treats each task. Grouping work does not establish a discount or a guaranteed single visit. Confirm whether the price includes GST, agreed products, delivery and disposal, and ask about payment terms and quote validity before acceptance.'
    ]),
    section('professional-checks','Check the roles required by the work',[
      'A timber quote should identify relevant specialist responsibilities rather than imply that every task is general carpentry. Ask who handles glazing, locks, electrical or plumbing work, roof leaks, suspected asbestos, pest findings and structural or approval checks where they affect the project. The work and contracting arrangements determine which qualifications, licences and insurance evidence should be checked.',
      'Request current documents relevant to the accepted scope and confirm which entity is contracting for it. This article does not assert a universal licence category or a verified insurance policy. Keep those checks attached to your actual proposal. If a specialist dependency is unresolved, ask how it affects the work sequence and final scope rather than overlooking it in the price comparison.'
    ]),
    section('quote-request','Send a task list that supports a clear quote',[
      'Give Ellis your suburb, the component, symptoms, intended finish and access details. Optional safe photos and available product records help describe the task; do not dismantle or enter an unsafe area to obtain them. For new work, include the intended use and any plans. For repeat repairs, include the earlier scope and known cause if available.',
      'Start with [small carpentry jobs](/services/small-carpentry-jobs/) or choose the relevant service from the [service directory](/services/). Ask for the accepted inclusions, exclusions and variation process in writing. A comparable quote gives you a defined result and price basis, so the decision can be made on what will actually be delivered.'
    ])
  ],
});

Object.assign(expandedGuideBodies,{
  'cabinet-hinges-and-drawer-runners':[
    section('hardware-or-panel','Start with the fitting and the material holding it',[
      'A cupboard door hanging out of line may have an adjustment issue, a failed hinge or damaged fixing holes in the panel. A drawer dropping off its runners can involve the runner, its mounts or the drawer box. These are different repairs even when the symptom looks similar. The first decision is whether the fitting and its supporting material remain suitable.',
      'Stop using a loose door or unstable drawer rather than repeatedly opening it to show the fault. Do not remove a heavy panel or pull a drawer free for a hardware photograph. Describe the problem and which cabinet it affects. The assessor can then plan access and identify whether replacement parts, panel repair or a wider scope should be considered.'
    ]),
    section('hinge-options','Adjustment is useful only where the hinge can hold',[
      'An otherwise serviceable hinge may need alignment; a damaged hinge needs compatible hardware. If screws have pulled out of a swollen or broken panel, the timber or sheet material needs assessment first. Installing a new hinge into an unsuitable fixing point can repeat the problem. Ask whether the repair retains the door, the mounting plate and the cabinet side.',
      'Overlay, opening angle and the surrounding clearances influence hinge selection. A soft-close upgrade should not be assumed to fit an older door simply because the hinge looks familiar. Before ordering owner-supplied hardware, have the model and mounting arrangement confirmed. A local repair may retain most of the kitchen, but its limits should be explained where a panel no longer supports the required fixing.'
    ]),
    section('runner-identity','Runner length is only one compatibility check',[
      'Drawer runners differ in their fixing methods, extension, load class and motion features. Blum’s Australian range illustrates why nominal length alone is not a complete specification. That does not identify the fittings in your drawer or make a particular Blum system a direct substitute. The actual runner, drawer dimensions and cabinet arrangement need to be checked together.',
      'Record a visible brand or part number only if it can be seen safely without dismantling. Include whether one drawer or several are affected and whether the fault developed suddenly or gradually. The repair proposal should confirm the replacement system, suitable mounting points and any drawer-box work. Parts availability can influence whether a direct replacement or a different agreed solution is practical.'
    ],['runners']),
    section('water-damaged-cabinet','A swollen kickboard is also a moisture question',[
      'A kickboard is the panel closing the gap beneath cabinets, not the skirting running around the room. If a plumbing leak has damaged it, confirm that the leak is resolved before replacement. Ask whether adjacent panels, feet or fixing locations also need assessment. A fresh kickboard can hide a continuing problem if the enquiry is treated only as a colour match.',
      'Water-damaged sheet material may not return to its original dimensions or fixing condition just because the visible surface dries. The extent and material need checking. Plumbing work belongs with the relevant qualified professional; cabinet reinstatement is a separate scope. Confirm removal, matching finish, edge details and access around appliances before a new panel is ordered.'
    ]),
    section('wardrobe-and-new-storage','Keep wardrobe mechanisms and new storage proposals distinct',[
      'A wardrobe sliding door coming off its track requires its rollers, track, stops and fixing arrangement assessed together. Do not lift out a heavy or mirrored door to inspect it yourself. Glass and mirrored panels need appropriate specialist handling. Repairing the mechanism differs from redesigning the wardrobe or replacing every cabinet in the room.',
      'New fitted storage needs a measured layout, materials, supply and installation responsibilities. The [Pearce wardrobe record](/projects/pearce-wardrobe-installation/) shows IKEA product assembly and fitting, not in-house cabinet manufacture or an IKEA partnership. A cabinet repair enquiry should therefore identify whether you want to restore an existing fitting or discuss a new storage installation.'
    ]),
    section('cabinet-scope','Build a small repair list with useful details',[
      'For [cabinet door and drawer repairs](/services/cabinet-door-and-drawer-repairs/), send your suburb, the cabinet location and one symptom per item. Optional overview and safely visible hardware photos can help identify the task. Mention any known leak, glass panel, appliance obstruction and existing product records. Do not buy a runner based only on a photograph of a similar kitchen.',
      'Ask the quote to separate hardware supply, fitting-point repair, replacement panels, removal and finish. Several small jobs can be assessed from one list, but each still needs an agreed boundary and price. See [quote cost factors](/news/carpentry-quote-cost-factors/) when comparing repair with new cabinetry. A working replacement depends on the whole fitting arrangement, not the cheapest matching-looking part.'
    ])
  ],
  'timber-weatherboard-damage':[
    section('weatherboard-symptom','A cracked board is a starting point, not a wall diagnosis',[
      'A few damaged timber weatherboards can sometimes be replaced individually where surrounding boards, supports and junctions remain suitable. A split end, peeling paint or stained joint does not show everything behind the cladding. The repair needs to establish both the visible board defect and whether moisture or support damage changes the boundary. Repainting alone does not answer that second question.',
      'Tell the team where the damage sits: under a window, near a corner, beside a downpipe or across an exposed wall. Note any known leak and earlier patch. Do not pull a board away to see behind it. Photos from accessible ground can show the pattern; inspection access and material identification should be agreed before the wall is disturbed.'
    ]),
    section('profile-lap','Matching the face also means matching the profile',[
      'Weatherboards overlap to form the wall’s outer layer. Thickness, shaped profile, exposed face and junction details affect how a replacement meets retained boards. A similar colour or nominal width is not enough to establish compatibility. Ask how the proposed board relates to the existing lap, corners and openings, particularly where the original profile is no longer readily available.',
      'A sample or measured profile may be needed before supply. Local replacement can preserve useful cladding but may show a colour or texture difference after finishing. A longer section can sometimes create a more workable junction or finish. The reason should be explained in the proposal rather than assuming that every cracked end requires replacing the whole wall.'
    ]),
    section('behind-cladding','What the assessment may need to check behind the board',[
      'The fixing substrate, surrounding framing and water-management details matter when cladding is opened. A sound new face board cannot correct deteriorated support or a leaking opening detail behind it. The assessor should explain which accessible areas can be checked and what remains uncertain before removal. Extra findings need a defined process for recording and pricing the changed work.',
      'If the damaged area is next to a window, coordinate the two scopes rather than treating the junction as somebody else’s problem. The [rotten window-sill guide](/news/rotten-window-sill/) explains why the opening and its drainage details matter. Roof leaks, glazing, electrical items or structural damage require their relevant professional input before timber reinstatement proceeds.'
    ]),
    section('cladding-material','Confirm the material before cutting or removing',[
      'This guide concerns timber weatherboards. Fibre-cement, metal and composite systems can have different details and are not automatically covered by a timber-repair proposal. Older or unknown sheet materials behind or beside the affected section need identification before disturbance. A painted surface cannot establish that an unknown product is safe to cut or discard.',
      'Where asbestos is suspected, use the qualified assessment pathway and do not take a sample yourself. ACT guidance warns that disturbing asbestos-containing material, including with cutting and sanding tools, can release fibres. Tell the team about existing material reports or property restrictions. Keep this assessment dependency visible in the scope rather than treating all removed cladding as ordinary timber waste.'
    ],['asbestos']),
    section('weatherboard-finish','Access and the finishing boundary can dominate a small repair',[
      'A short board high on a wall can involve more access setup than several low boards in an open area. Mention narrow side access, planting, neighbouring property restrictions and services on the wall. The repair method also needs to protect adjoining boards and openings. Do not climb or reach past an unstable surface to provide a close-up.',
      'Ask whether the quote includes removal, disposal, preparation, priming and final painting. Agree whether finishing covers the new boards, a wall section or the full elevation. New paint on old cladding may remain visible, and an exact aged match cannot be assumed. Comparing only the board length overlooks the access and decoration that define the completed result.'
    ]),
    section('weatherboard-enquiry','Prepare a defined cladding repair request',[
      'For [timber weatherboard repairs](/services/timber-weatherboard-repairs/), include your suburb, wall location, approximate affected area if known and any water history. Optional safe overview and detail photos help explain the profile and nearby openings. Existing material records and earlier repair scopes are helpful; a clear description is enough if photographs are not safe.',
      'Ask what can be retained, which junctions will be checked and how concealed findings will be handled. If damage has returned at an earlier patch, [recurring timber rot](/news/why-timber-rot-returns/) is useful further reading. A complete repair decision joins the replacement board to suitable retained work and addresses the water route, with the finish agreed before booking.'
    ])
  ],
  'loose-timber-stairs':[
    section('stair-safety','Treat movement in a tread or rail as a safety issue',[
      'A loose timber tread or handrail needs its supporting arrangement assessed. Stop relying on the affected component and avoid the unsafe route while professional assessment is arranged. A bracket might be the visible fault, but the material holding it can also be affected. A cosmetic repair or another screw cannot establish that the stair or rail is suitable to use.',
      'Do not add weight, bounce on a tread or shake a rail to demonstrate movement. If the stair is the only access, tell the property contact and assessor promptly so access arrangements can be discussed. Keep children and visitors away from the affected area. New photos are optional; there is no reason to use an unsafe stair to obtain evidence.'
    ]),
    section('stair-components','Identify the tread, stringer, rail and barrier',[
      'The tread is the surface you step on. Supporting members and connections carry its load; a stringer is a sloping support beside or beneath the treads. A handrail provides a grip, while a balustrade or barrier has a fall-protection role. One stair can contain all of these, so describing “loose timber” alone may not establish the task.',
      'Say whether movement was noticed at one tread, several steps, a landing, the rail or the barrier post. Mention whether the stair is inside or outdoors, where moisture appears and whether repairs were done before. This helps plan the assessment; it does not substitute for checking concealed connections and adjoining supports.'
    ]),
    section('stair-fixings','Why replacing a fixing may leave the cause unresolved',[
      'A fixing needs suitable material and a compatible connection. If its substrate is split, deteriorated or moving, a new screw may not restore the intended support. The assessment should distinguish worn hardware from damaged timber and consider the nearby assembly. Several loose parts can point to a wider boundary than the first visible fitting.',
      'Do not dismantle a rail or remove a tread to discover how it is supported. Local repair may be appropriate where the fault and retained components are defined. Supporting-member damage can require structural input and a different work sequence. Ask how the proposal establishes the retained components and which qualified checks are required before work starts.'
    ]),
    section('stair-requirements','A changed stair needs more than a matching board',[
      'Replacing a component and changing a stair layout are different proposals. Dimensions, connections, intended use and the surrounding barrier arrangement matter when defining the repair. Do not use a generic height or “like-for-like” label as the approval decision. ACT Planning separates general exemption conditions from project-specific criteria and advises checking the actual work.',
      'Confirm the applicable building and planning checks with the relevant professionals, especially where structure or safety arrangements are affected. This article does not provide tread dimensions, fastener sizes or a structural repair method. The purpose is to prepare a useful enquiry and make the assessment responsibilities clear before the stair is disturbed.'
    ],['approval']),
    section('stair-quote-inclusions','Price the repair, access and handover together',[
      'The quote should identify the component, retained supports, replacement material and connection work. Ask how access is managed while the stair is unavailable and whether adjoining finishes or barriers are included. A matching timber tread and a completed usable stair are not necessarily the same scope. Painting or coating should be listed separately from the support repair.',
      'If deterioration appears outdoors, discuss the moisture route and the care information for the selected finish. Where more damage is found during agreed access, request the finding and revised scope before extra work proceeds. Clarify any use restrictions and the handover arrangements after the agreed repair. Avoid treating a new finish as proof that concealed supports were checked.'
    ]),
    section('stair-enquiry','Send observations from a safe position',[
      'For [timber stair and handrail repairs](/services/timber-stair-and-handrail-repairs/), provide your suburb, the affected stair or rail and what you already noticed. Mention whether another route exists, who authorises access and any available plans or repair records. Use existing safe photographs or a description; do not crawl beneath an unstable stair or lean over a loose barrier.',
      'A stair beside a moving deck may need the connected area considered too; see [deck boards and framing](/news/deck-boards-or-frame/). The practical next step is an assessment of the component and its support path, followed by a written repair boundary. Operation, support and fall protection need attention before decorative finishing is discussed.'
    ])
  ],
  'pergola-post-rot':[
    section('post-support','A rotten post belongs to a connected structure',[
      'A soft pergola or verandah post base may be the visible defect, but the repair decision depends on the structure it supports. Beams, connections, footings and any roof or attachments need consideration together. A replacement post is one possible outcome after assessment; it is not a safe first step to remove the old base and see what remains.',
      'Keep clear of a structure showing movement, instability or falling material. Do not cut the post, excavate its footing or improvise props. Even an open pergola can depend on connections that are not apparent from a photograph. Tell the assessor about any roof, screens, attachments or recent changes so the whole arrangement can be considered.'
    ]),
    section('post-moisture','Why the base detail deserves attention',[
      'Water collecting beside the post, changed paving levels, debris and repeated wetting are useful observations. The condition of the base connection and footing also affects the option. A new post fitted into the same unresolved water trap may leave a recurrence problem. Describe when water appears and whether drainage or landscaping changed before the deterioration was noticed.',
      'A photo can show the location but cannot establish timber condition below paint or inside a connection. The assessment may need agreed access and qualified structural input to define the boundary. Do not probe the base or expose a footing to obtain more detail. The repair plan should explain the moisture-source work as well as the replacement material.'
    ]),
    section('post-options','Local repair, post replacement or wider timber work?',[
      'A local base repair requires suitable retained timber and a connection that meets its supporting role. Replacing a full post still needs an appropriate connection and footing. If beams or adjoining posts are affected, the scope may extend beyond the first soft area. Ask which components remain and how that decision is supported.',
      'Compare the complete work rather than the cost of a length of timber. Access, support planning, removal, fabrication, connections and finishing can differ between options. A patch that restores the outline is not automatically a structural repair. The [recurring rot guide](/news/why-timber-rot-returns/) explains why sound retained material and the wetting route both matter.'
    ]),
    section('pergola-checks','Repair and alteration have different project questions',[
      'Adding a roof, changing a footprint or altering supports can change the project from a local repair to an alteration proposal. ACT Planning lists specific criteria for pergolas and shade structures alongside general building-approval conditions. Confirm the requirements for the actual work; a label such as “pergola repair” does not decide them.',
      'Building approval and development approval are separate checks, and other property constraints may apply. Ask the relevant design professional, builder or building certifier who confirms the requirements and which documents are needed. No approval outcome or timeframe is promised here. Existing drawings and approvals are useful records, but they should be compared with the structure and proposed work now.'
    ],['approval']),
    section('pergola-scope','Define the connections, access and finish in the proposal',[
      'For a repair quote, identify the affected posts and beams, retained components, proposed material and connections. Ask how concealed findings will be handled and which specialist roles are included. Overhead electrical fittings and roof or gutter defects need their relevant qualified pathways. They should not disappear inside a general timber replacement allowance.',
      'Discuss access around planting, paving, stored items and adjoining property. Confirm whether the finish covers repaired areas or a wider visible assembly, and who makes good disturbed surfaces. Matching an aged stain exactly may be difficult. The accepted scope should explain the completed boundary, including disposal and any care information, rather than end at “replace post”.'
    ]),
    section('pergola-enquiry','Prepare the enquiry without approaching a failing support',[
      'Send your suburb, the location of the post and the symptoms already visible. From safe ground, an overview can show the structure and attachments; a base detail is optional only where safely accessible. Include known leaks, drainage changes and available plans. Do not climb, enter beneath an unstable structure or test the post to provide more evidence.',
      'Start with [pergola and verandah timber repairs](/services/pergola-timber-repairs/) and ask for the assessment and responsibility boundaries to be confirmed. If nearby stairs are loose, mention that separately and read [timber stair safety observations](/news/loose-timber-stairs/). A useful repair plan follows the connected supports and the water problem before selecting the replacement timber.'
    ])
  ],
});

Object.assign(expandedGuideBodies,{
  'leaning-paling-fence':[
    section('fence-pattern','Look at the leaning pattern before counting palings',[
      'A leaning timber fence can involve a post, footing, rail or connection. Palings are the visible boards, so they may look serviceable even when a support is failing. Replacing loose palings cannot correct every lean. The first useful distinction is whether movement is around one post or continues through several bays, with the adjoining sections assessed before a repair boundary is agreed.',
      'Record what changed: a storm, nearby ground work, a gate that now catches or a post base that looks deteriorated. These observations help explain the request but do not identify a single cause. Do not push the fence to test it, remove a paling to inspect behind it or stand beside a section that appears unstable.'
    ]),
    section('fence-components','Posts, rails and palings lead to different scopes',[
      'Posts support the fence; rails connect the posts and carry the palings. An isolated broken paling may be a straightforward component replacement where the rail can hold a suitable fixing. A deteriorated post changes that conversation because the retained rails and palings need a support and connection plan. The assessor should explain which components are suitable to stay.',
      'Damage near ground level also prompts questions about wetting, surrounding levels and the footing. A new post is not a complete specification on its own. Ask what support detail is proposed and how the rails, gate or adjoining panel will connect. Do not dig around the base or brace a failing fence yourself to establish the extent of decay.'
    ]),
    section('partial-fence-repair','Can a post be replaced while keeping the fence boards?',[
      'Partial repair may be possible when retained rails and palings remain suitable and can be handled without creating further damage. Keeping older material can reduce unnecessary replacement, but dismantling and refitting also involves labour and uncertainty. A section that looks sound from one side may have poor fixing points on the other, so retention should follow assessment.',
      'A longer replacement can be worth comparing when defects run through several supports, rails are damaged too or the retained material cannot be reconnected reliably. Ask for both scopes to identify the same affected length and access assumptions. The useful comparison is the completed fence section, not simply the number of new palings included.'
    ]),
    section('fence-appearance','Agree the match, height and gate relationship',[
      'A new board or post will often look different beside weathered timber. Check the proposed profile, dimensions and any painted or stained finish. If the fence line supports a gate, the gate’s swing, hinges and latch position need consideration as part of the repair. A gate problem can remain even after palings have been replaced.',
      'Describe the existing arrangement and whether you want a local repair or a changed fence design. Altering height, layout or use introduces questions beyond matching an old board. Discuss relevant project requirements before accepting a changed design. Our [sagging gate guide](/news/why-timber-gates-sag/) explains why post movement and gate alignment belong together.'
    ]),
    section('fence-access-agreement','Settle access and property arrangements before booking',[
      'A boundary fence repair can require access from both sides. Confirm the authorised property contacts, access permission, pets, planting and any restrictions before a visit. A written repair scope describes the physical work; it does not settle ownership, a disputed boundary or who must contribute. Seek the appropriate property or legal advice for those questions.',
      'Ask whether the scope includes taking down the affected section, temporary access arrangements, disposal, post work, refitting retained boards and finishing. Tell the team if a tenant or neighbour needs to coordinate entry. Shared-owner approval and the contractor’s booking are separate matters, so do not assume an estimate alone authorises the physical work.'
    ]),
    section('fence-quote','Prepare a fence enquiry with the whole affected run',[
      'Send your suburb, an approximate affected length if known, the fence type and the change you have noticed. Optional safe photos should show the run from an accessible position, not only one damaged paling. Mention whether the gate is affected and whether both sides can be accessed. Existing repair records can help explain why a previous patch has failed.',
      'For [timber fence repairs](/services/timber-fence-repairs/), compare post, rail and paling work separately from removal and finish. Ask how any additional damage discovered during agreed access will be priced. The takeaway is to establish the support fault first, then decide how much fence can sensibly remain; new surface boards alone are not a complete answer to a leaning run.'
    ])
  ],
  'skirting-after-new-flooring':[
    section('new-floor-junction','A new floor changes more than the skirting height',[
      'When new flooring leaves a gap below old skirting, there is more than one possible finish. Existing boards might be removed and refitted, replacement skirting might cover the junction, or a compatible finishing trim may be considered. The right choice depends on the actual flooring system, finished level, retained trim and condition of the wall after removal.',
      'Do not fill every visible gap before asking the flooring installer which edge detail applies. Some gaps serve the flooring system’s movement requirements. For example, Quick-Step Bloom instructions keep its floor free to move beneath wall-fixed skirting. That is product-specific guidance, not a universal gap dimension or sealant rule for every timber, laminate or hybrid floor.'
    ],['flooring']),
    section('skirting-sequence','Agree the sequence with the flooring installer',[
      'The finished floor level and required perimeter detail need to be known before final fitting. If you are keeping skirting, ask whether it can be removed intact and whether enough material will remain for the new arrangement. Brittle boards, heavy old paint or previous fixings can affect reuse. Retention is a decision to assess rather than a promise based on room size.',
      'Coordinate flooring, skirting and painting dates so each person understands the handover. Ask who protects the new floor, moves furniture and makes good wall marks. Where door clearance has reduced, include that as its own task with the door construction checked. A quote for skirting should not silently assume that trimming every door is included or permissible.'
    ]),
    section('whole-profile','Match height, thickness and the shaped edge',[
      'Skirting finishes the wall-to-floor junction; architraves finish around door and window openings. They meet at doorways, so height alone is not enough for a match. Thickness, the shaped top edge and the way the boards return into an opening can be conspicuous beside retained trim. A taller board may also expose or cover different areas of existing wall finish.',
      'Send an overview of retained trim and a safe close-up of its profile. Measurements and a sample may be needed on site. Decide whether you want continuity with another room or a new profile throughout the area. Confirm the selected material, dimensions and finish before buying customer-supplied boards, especially where an advertised profile has a different thickness.'
    ]),
    section('trim-material','Local damage and swollen boards need different decisions',[
      'A small impact or chewed section can sometimes be treated locally where surrounding material is suitable and a finish can be agreed. Water-damaged MDF or timber needs the moisture source addressed first. A swollen board may no longer offer the profile or fixing surface required, so ask for a material assessment rather than assuming drying or filler will restore it.',
      'Replacement of a defined length can avoid changing an entire room, but joins, available profiles and the paint boundary influence appearance. Ask whether an isolated section or a full wall length gives the more workable finish. If the leak is recent, confirm which moisture-source work has been completed before new trim is installed. Do not seal over ongoing dampness to meet a painting date.'
    ]),
    section('trim-finish','A fitted board and a finished painted room are different inclusions',[
      'Quotes can include different stages: removal, supply, cutting and fitting, fixing holes, caulking, priming or final painting. Primed material is not the same as a completed painted finish. Ask which surface the caulking applies to, how wall damage will be handled and where decoration stops. Any treatment beside a floating floor must respect the selected flooring instructions.',
      'Corners, returns, short lengths around cabinets and junctions at architraves can take more attention than a simple perimeter measurement suggests. Access to furniture-covered walls and protection of the new floor also affect the work. Use [skirting and architrave installation](/services/skirting-and-architraves/) to define the measured scope rather than comparing board supply prices with a complete room finish.'
    ]),
    section('trim-enquiry','What to send before the on-site measure',[
      'Include the rooms, your suburb, whether flooring is installed or planned and which trim is staying. Give the flooring product or installer’s edge requirements if available. Optional photos of the wall junction, a corner and a doorway help show the relationship between components. A room perimeter can start the conversation, but it does not replace a measured fitting list.',
      'Ask Ellis to confirm the profile, supply responsibility, removal, floor protection and finish in the installation plan and quote. Mention door rubbing separately; the [wet-weather door guide](/news/timber-door-sticks-after-rain/) also explains why clearance needs a cause check before trimming. A successful trim decision is one that suits the finished floor and adjoining room, with the visible finish agreed in advance.'
    ])
  ],
  'why-timber-gates-sag':[
    section('gate-support-path','A latch problem can begin at the post',[
      'A timber gate transfers its weight through the frame and hinges into the supporting post. When that support moves or a fixing loses its hold, the latch can be the first place you notice the change. Moving the latch may make it close briefly without correcting the cause. Start by describing the leaf, hinges, post and ground clearance as one assembly.',
      'Note whether the top and bottom gaps have changed, the latch side has dropped or the post appears out of line. These are observations rather than tests of strength. Do not hang on the leaf, lift it while swinging or push the post to see how far it moves. Keep clear if the gate looks unstable or could fall.'
    ]),
    section('hinge-fixing','Loose hinges need a suitable fixing point',[
      'A hinge can be loose because its hardware is damaged or because the timber supporting the screws has split or deteriorated. Replacing screws does not establish that the remaining material can hold them. A post with a sound upper face can still have a problem at its base. Ask the assessment to distinguish hardware work from timber and support repair.',
      'A serviceable gate leaf may be retained while a defined hinge or post problem is repaired. Where the leaf frame is badly distorted or fixing timber is unsound, replacement of more of the assembly may be appropriate. The proposal should explain the retained parts and how new hardware suits them, rather than quote a hinge pair without a connection plan.'
    ]),
    section('dragging-ground','Dragging can follow rain or a change in the ground',[
      'A gate that drags throughout its swing presents a different pattern from one that catches on a newly raised paving edge. Wet-weather timber movement, soil buildup or a changed ground level can also reduce clearance. Record when it happens and whether the gate becomes easier to use in dry conditions. Avoid forcing it across the obstruction to demonstrate the problem.',
      'Cutting the lower edge before checking alignment can leave an unnecessary gap while the leaf continues to sag. Agree the intended swing, clearance and latch operation together. If the gate supports a particular access or safety function, explain that use before alterations are proposed. Pool barriers, powered gate equipment and access-control systems need their relevant specialist requirements assessed separately.'
    ]),
    section('gate-repair-options','Compare retaining the leaf with replacing the assembly',[
      'Retaining an otherwise suitable leaf can preserve a matching fence appearance. Its size, weight, condition and available hardware still need to suit the repaired supports. A new leaf fitted to a failing post may develop the same symptom. Conversely, replacing a post does not correct every distorted gate frame, so ask which part is driving the proposed scope.',
      'When comparing options, include the post or footing work, leaf repair, hinges, latch, removal and finish. Discuss whether new timber will match the weathered fence closely enough for your needs. A changed opening width or design should be described explicitly. Read [leaning fence repairs](/news/leaning-paling-fence/) if the supporting fence line is moving as well.'
    ]),
    section('gate-site-details','Access and hardware supply affect the practical job',[
      'A side gate may be the only route to a backyard. Mention pets, security, tenant access and anything that prevents the opening being unavailable during work. Confirm permission for access from either side and who needs to be present. Hardware supplied by the owner needs compatibility checked before installation is agreed; a similar-looking latch may not fit the existing arrangement.',
      'Ask whether priming, painting or staining the repaired areas is included and whether disposal covers the old post or leaf. Ground work and concealed findings can change the scope. Request the process for approving additional work before it begins, rather than treating a photograph as a final price for every part of the assembly.'
    ]),
    section('gate-enquiry','Describe the movement, then arrange the repair assessment',[
      'Send your suburb, the gate location and whether it drags, misses the latch or has loose hinge fixings. Optional safe photos of the whole opening, the hinges and the post base are useful if they can be taken without moving the gate. Include any known change to paving, drainage or the adjoining fence.',
      'For [timber gate repairs](/services/timber-gate-repairs/), ask which components can be retained and how operation will be checked after the agreed work. If the latch mechanism itself has failed, confirm the locksmith or hardware pathway rather than assuming a timber adjustment covers it. The useful outcome is a gate repair based on its supports and intended movement, not repeated latch relocation.'
    ])
  ],
  'why-timber-rot-returns':[
    section('recurring-rot','A repeated patch needs a cause review',[
      'When timber deteriorates again after repair, there may still be a wetting source, a water-trapping detail or damage beyond the earlier patch. It does not automatically prove that all timber needs replacement, but it does mean another surface patch is a poor starting assumption. Ask what was retained last time, which moisture route was addressed and what the new assessment can establish.',
      'Keep the earlier scope, photos and product information if available. A description such as “fixed and painted” may not distinguish timber replacement from filler and finish work. Note whether the same corner failed, a nearby section now looks affected or the defect followed a new leak. This history helps the assessor investigate the pattern without relying on guesswork.'
    ]),
    section('weathering-decay','Weathering, decay and insect damage are different questions',[
      'A grey or worn surface describes appearance; it does not establish the condition of the timber below. Decay can affect material and connections, while insect damage has a separate cause and can occur alongside dampness. A photo is not a reliable way to identify all three. Report the existing symptom without scraping, probing or opening the structure yourself.',
      'If pest activity is suspected, arrange the qualified pest assessment and retain its findings. Treatment of active pests and reinstatement of damaged timber are separate work scopes. A treatment record does not certify that a bearer, jamb or other component remains structurally suitable. Supporting members need the appropriate structural assessment before a replacement plan is agreed.'
    ]),
    section('find-water-route','Look beyond the paint to the wetting route',[
      'A sill, fascia, deck edge and fence post have different surroundings. Discuss roof or gutter leaks, ground contact, changed drainage, open junctions and water that remains after rain where relevant. The same filler or coating is not a universal answer for all these locations. WoodSolutions provides resources on assessing moisture-affected timber, which supports treating moisture as an assessment topic rather than a cosmetic defect.',
      'Identify which professional is responsible for the source and how that work coordinates with the timber repair. Roofing, plumbing or drainage defects may need their respective specialists. Avoid closing the repair up while the cause remains unresolved. An instruction to “seal everything” should be clarified against the component’s intended drainage and ventilation details.'
    ],['moisture']),
    section('sound-repair-boundary','Why the retained timber matters as much as the new piece',[
      'A replacement section needs suitable retained material and connections. Damage extending behind paint or into a junction may make the repair larger than the visible soft spot. A local splice is considered where its boundary and connection can be justified; widespread or connected damage can require replacement of the full component or a wider assembly.',
      'Filler can be part of a specified surface repair, but it cannot be assumed to restore every rotten timber member. The supporting role of the component matters. Do not cut away decay, remove a post or expose framing as a trial repair. Agree inspection access, any structural input and the response to further findings before disturbance.'
    ]),
    section('component-specific','Use the component’s own repair and finishing detail',[
      'For a window, profile and water shedding need consideration; at a fascia, the gutter and roof edge may influence access and recurrence. A deck repair needs boards and supporting components separated. Our [window-sill guide](/news/rotten-window-sill/) and [deck board and frame guide](/news/deck-boards-or-frame/) explain these boundaries in their own settings.',
      'Ask what material is proposed, how cut or exposed areas are protected and whether the quote includes final paint, stain or oil. Maintenance depends on the selected product and exposure. A new coating does not remove an ongoing leak or establish sound concealed timber. Keep the care instructions with the repair record so future changes can be described against the actual specification.'
    ]),
    section('rot-evidence','Give the repair history and agree the next decision',[
      'For [rotten timber repairs](/services/rotten-timber-repairs/), send your suburb, the component, the repeated location and any known leak or pest findings. Optional safe overview and detail photos can explain the issue. Mention access restrictions and previous concealed findings. If a load-bearing member, deck, stair or overhead structure appears unstable, avoid the affected area while professional advice is arranged.',
      'Compare the proposed retained and replaced parts, moisture-source work, access, removal and finish. Ask how extra damage will be documented and approved, and which specialist checks are needed. The takeaway is to repair to a justified boundary and address the conditions that caused the failure; the neatness of the final paint alone cannot demonstrate either.'
    ])
  ],
});
Object.assign(expandedGuideBodies,{
  'timber-door-sticks-after-rain':[
    section('wet-weather-movement','Why a door changes after wet weather',[
      'If your back door works in dry weather and catches after rain, start with the change in conditions. Timber and its finish respond to moisture, but the moving part may be the leaf, the frame or both. The useful question is where clearance has changed and whether water is reaching exposed timber. A wet-weather pattern is a clue; it does not prove that the door simply needs shaving.',
      'A swollen edge, loose hinge and thick paint can produce similar rubbing. Recent flooring can also reduce the bottom gap without changing the sides. Write down when the fault occurs, whether it improves later and what work happened before it started. Hume provides separate care and finishing support for its doors; identify your own manufacturer and construction before agreeing an adjustment.'
    ],['doors']),
    section('read-the-opening','Read the opening, not just the scrape',[
      'The jamb is the side of the frame where the hinge or closing edge sits. The architrave is the trim covering the junction between frame and wall. A split in the jamb around a hinge affects the fixing point; a mark on the architrave may only affect the finish. Tell the assessor which part is damaged, or send a whole-opening photo if the names are unfamiliar.',
      'Note whether the top corner drops, one edge rubs throughout closing, or the leaf swings freely but the latch misses. A door that closes without latching needs an alignment and hardware check, rather than automatic edge removal. Several changing gaps, a soft lower jamb or fresh wall cracks deserve a wider assessment. Do not push, lift or slam the leaf to demonstrate the problem.'
    ]),
    section('safe-door-observations','What to record without taking the door apart',[
      'From the usual standing position, photograph the full opening, the rubbing location and any existing broken coating. Include both sides if they are safely accessible. Mention an exposed entry, a recently repaired leak, new flooring or a previous adjustment. There is no need to scrape paint, probe soft timber or remove a hinge to make the enquiry useful.',
      'Keep a reliable way in and out of the home. If the door is jammed or cannot secure the property, explain that when contacting the team so the appropriate response can be discussed. A heavy leaf, glazed panel or unsupported hinge can create a handling hazard. Locks, glass and identified fire-rated doors need their relevant specialist pathway and product requirements.'
    ]),
    section('choose-door-repair','Choose between adjustment, jamb repair and replacement',[
      'Adjustment can suit a serviceable leaf and frame where the cause is defined. A damaged hinge fixing point needs sound supporting material before alignment can be restored. Local jamb repair may retain the rest of the opening where suitable timber remains; decay reaching connected joints can make a larger replacement necessary. Ask which parts can be retained and what evidence supports that choice.',
      'Trimming is a material change, not a diagnostic test. A leaf that is trimmed while wet may have an excessive gap later, and construction can limit what can be removed. Not every internal door has the same edge allowance. The proposal should identify the door type, permitted adjustment and protection of newly exposed edges, rather than applying one cutting rule to every leaf.'
    ]),
    section('water-and-finish','Address the wetting route and the finish together',[
      'If moisture reaches the lower jamb or leaf, replacing a damaged piece alone leaves a separate question about the source. Discuss weather exposure, surrounding junctions and any known leak with the assessor. A coating helps protect suitable timber, but paint is not evidence that the material beneath it is sound. Repeated damage after a patch warrants another look at the cause.',
      'Confirm whether the work includes preparation, priming, painting or staining of the adjusted area, and whether adjoining surfaces are included. A local finish can be visible beside older paint. Our guide to [timber rot returning after repair](/news/why-timber-rot-returns/) explains why the repair boundary and the moisture route belong in the same conversation.'
    ]),
    section('door-quote','Get a useful door repair scope',[
      'Send your suburb, the door location, the closing symptom and its timing. Add safe overview and detail photos if convenient, plus any product label or previous repair record already available. Tell the team whether it is the main access door and whether pets, tenants or restricted entry affect the visit. Do not remove the door to obtain measurements.',
      'A quote should separate alignment work, timber replacement, hardware, finish and any specialist arrangements. Access and handling of a large or glazed leaf can change the scope as much as the visible scrape. Start with [door and frame repairs](/services/door-and-frame-repairs/) and ask which cause will be addressed before accepting a trimming-only proposal. A good next step is a defined repair, followed by an operation check against that agreed scope.'
    ])
  ],
  'deck-boards-or-frame':[
    section('surface-or-support','Begin with the surface and the support system',[
      'A deck board is the walking surface. Joists sit beneath the boards; bearers carry the joists, and posts and connections carry the load onwards. These names help explain why a few unattractive boards and a moving deck are different enquiries. A board-only repair is an option after the supports to be retained have been assessed, not simply because most boards look tidy.',
      'A split around a screw, worn coating or raised edge tells you about the visible area. Softness or movement already noticed underfoot raises a safety question that cleaning cannot answer. Do not walk back over the spot to compare it with another board. Keep an unstable or visibly damaged area out of use while the assessment is arranged.'
    ]),
    section('loose-fixings','Why a proud nail or loose screw needs context',[
      'A fixing can move because of the board, the fastener, the timber holding it or movement elsewhere in the assembly. Hammering it down may hide the symptom without establishing that it will hold. Several fixings lifting in one line give different information from one damaged board end. Describe that pattern and any earlier repair rather than adding more fixings before the visit.',
      'The assessor needs to distinguish a usable fixing location from deteriorated support material. That may require agreed inspection access; a photo from above cannot establish every connection below. Ask how concealed findings will be recorded and which further checks apply if supporting members are affected. The repair plan should explain the retained structure as well as the new walking surface.'
    ]),
    section('local-reboarding','When a local board replacement is worth considering',[
      'Replacing a defined group of boards can preserve useful material where the surrounding surface and assessed supports remain suitable. The choice needs the board dimensions, the position of joins, fixing access and the condition at ends. A narrow damaged patch beside a stair or building junction may involve more detail than the same board area in an open middle section.',
      'New timber can differ in colour and texture from weathered boards. Agree whether a reasonable material match or a broader appearance change is the goal. Sanding and coating retained boards are separate finishing decisions and may not make old and new timber identical. Ask to see the proposed material description before supply is ordered, particularly where the existing species is uncertain.'
    ]),
    section('framing-findings','When support findings change the job',[
      'Damaged joists, bearers, posts or building connections need their own assessment and repair scope. Reboarding over them can make future access harder while leaving the original fault. If adjoining components are affected, the visible board count is a poor measure of the repair extent. Safe access, the work sequence and any qualified structural input become part of deciding what can be retained.',
      'Ask for the options to be explained once the condition is understood: local board repair, defined frame work or a wider rebuild proposal. The [repair-or-rebuild guide](/news/repair-or-rebuild-a-deck/) compares these decisions in more detail. Neither a good-looking top nor the age of the deck alone settles which option is suitable.'
    ]),
    section('care-versus-repair','Put sanding and oiling in the right place',[
      'Surface care concerns cleaning, preparation and the protective finish. It does not restore a deteriorated support or prove the deck is safe. Resolve movement and damaged timber before agreeing an appearance-only treatment. WoodSolutions links finish maintenance to the selected coating and exposure, so a universal recoating interval is not a substitute for identifying your actual product.',
      'Where repair and care are both requested, ask whether preparation covers all boards or only replacements, which coating is proposed and how the existing finish affects compatibility. Read [timber deck maintenance](/news/timber-deck-maintenance-canberra/) before comparing a small repair price with a complete cleaning and oiling quote. The treated area and preparation can be substantially different.'
    ],['decking']),
    section('deck-evidence','Give the assessor the location and history',[
      'Send the suburb, the affected part of the deck and the symptoms already noticed. Mention stairs, railings, a building junction, known leaks and earlier repairs. An overview from stable ground and any existing underside view can help, but do not crawl below an unsafe deck or lift boards for photographs. Plans, material records and previous scopes are useful if you already have them.',
      'For [deck repairs and board replacement](/services/deck-repairs/), ask the written scope to identify boards, supports, fixings, removal, disposal, access and finishing. Agree how extra findings affect scope and price before extra work proceeds. The practical takeaway is to price the assessed repair boundary first; a board-only estimate should not silently assume that every concealed support can stay.'
    ])
  ],
  'rotten-window-sill':[
    section('sill-repair-boundary','A soft corner does not define the whole repair',[
      'A timber window sill can sometimes be repaired locally, but the remaining material and adjoining frame must be suitable for the proposed connection. Decay at both ends, through the sill or into a side frame can require a larger repair. The size of a stain or a patch of peeling paint is not a reliable cutting line, and a sound-looking coating can conceal deterioration.',
      'Record what is already visible: cracked coatings, open joints, staining or a change in window operation. Do not dig into the sill to find the edge of the damage. The on-site assessment should establish the component condition, the likely moisture route and any inspection access required before deciding between a splice, sill replacement or wider frame work.'
    ]),
    section('window-water','Why the sill shape and water route matter',[
      'A sill is more than a horizontal piece of timber under glass. Its profile, projection and junctions affect how the opening sheds water. Ends meet the side frames and may be concealed by other trim. A replacement that looks similar from indoors can still change an outside detail, so discuss function as well as appearance when choosing the repair.',
      'WoodSolutions describes timber-window durability as a combination of exposure, materials and maintenance, with resistance to water entry also relevant. If dampness follows rain, the leak needs attention alongside timber work. Repainting alone cannot establish that the wetting route has been corrected. Tell the team about previous sealing or leak work and which side becomes wet.'
    ],['windows']),
    section('splice-or-sill','Compare a splice with replacing the sill',[
      'A local splice replaces a defined damaged section while retaining suitable timber around it. This may preserve the existing opening and its character, but it relies on a viable join and a compatible profile. Longer sill replacement can be more practical where damage is continuous or the retained ends cannot provide suitable connections. Neither option follows a universal percentage rule.',
      'Ask the proposal to state the retained lengths, replacement profile, material and exposed-edge protection. Surface filler can form part of a specified finish but should not be presented as a cure for every rotten component. If the adjoining jamb or sash is affected, compare the complete repair with a broader replacement option instead of considering the sill in isolation.'
    ]),
    section('glass-and-sash','Separate glazing, sash operation and timber work',[
      'A sash is the frame holding the glass within the opening. A sash that drops, sticks or appears painted shut has an operating problem that is distinct from the sill repair. If it will not stay open, stop relying on it to support itself. Do not wedge it open, force it free or dismantle balances and cords to diagnose the fault.',
      'Keeping the outer frame does not automatically mean glass can remain untouched. Access, the glass condition and retention details may require a glazier. Ask which specialist arrangements are needed and who coordinates them. Replacing glass, improving glazing performance and repairing timber are different scopes; [timber window repairs](/services/timber-window-repairs/) is the starting point for defining the timber work.'
    ]),
    section('profile-and-finish','Match the profile and agree the painted boundary',[
      'Photographs of the whole window and the affected corner help discuss a match. A measured section or supplier profile may still be needed before ordering. Species, dimensions, existing finishes and access around the opening affect the proposal. A visually close profile should also preserve the intended drainage detail, rather than merely reproducing an indoor edge.',
      'Confirm whether preparation, priming and final painting include the entire sill, the repaired area or surrounding frame. Local paint can stand out beside an aged coating. On a property with heritage controls or specific consent conditions, flag those records before alterations are planned and confirm the relevant professional advice. This guide does not decide what changes a particular property permits.'
    ]),
    section('window-enquiry','Prepare a window repair enquiry that answers the useful questions',[
      'Include your suburb, the window type if known, the affected corner and whether water appears during rain. Mention earlier repairs, an unreliable sash and any difficulty accessing the outside. Optional photos should come from safe ground or a normal indoor position. Do not lean out, climb or remove paint to make the damage clearer.',
      'Request a scope that distinguishes timber repair, leak investigation, glazing, access equipment, removal and finish. If more damage is found during agreed access, ask for the finding and proposed change before extra work begins. For a corner that has already been patched, read [why timber rot returns](/news/why-timber-rot-returns/) too. A lasting repair decision begins with the retained timber and the wetting source, not a fresh topcoat.'
    ])
  ],
  'fascia-bargeboard-eaves':[
    section('name-roof-edge','Identify the roof-edge component from the ground',[
      'Fascia runs along the lower roof edge, commonly beside the gutter. Bargeboard follows the sloping edge of a gable. Eaves lining closes the underside of the roof overhang. These parts can meet in one corner, but they are not interchangeable materials or repair tasks. A whole-edge photo is useful when you are unsure which name applies.',
      'Describe whether the defect sits behind a gutter, on a sloping roof edge or underneath the overhang. Note a split, peeling coating, stain or sag already visible from safe ground. Do not climb onto the roof or lean a ladder against a deteriorated board for a closer view. The assessment must establish the material and fixing condition rather than rely on the component name alone.'
    ]),
    section('roof-water-route','Rot behind the gutter needs a water-path discussion',[
      'A timber board behind a gutter can be repeatedly wetted by overflow, leaks or an adjoining roof-edge detail. Replacing the board without considering that route can leave the cause in place. Tell the assessor whether water spills during rain, whether a leak was repaired recently and whether the damage recurs at the same corner.',
      'Timber repair and roof or gutter work need distinct responsibilities in the proposal. Ask who checks the moisture source, whether the gutter must be disturbed for access and who reinstates the adjoining details. A roof leak needs the relevant roofing professional; nearby electrical items need the appropriate electrical pathway. A carpenter’s timber quote should not silently include every roof-edge trade.'
    ]),
    section('unknown-eaves-material','Treat unknown eaves lining as an identification question',[
      'Eaves lining may be a sheet product rather than timber. An old painted panel cannot be reliably identified from its colour or a photo. Before disturbance, arrange the relevant material assessment, including an appropriately licensed asbestos specialist where suspected. Do not cut, drill, sand, pressure-clean or take a sample yourself to help with the quote.',
      'ACT Government guidance explains that damaging or disturbing asbestos-containing material can release fibres and that tools can increase the release. Keep the material question separate from choosing a replacement panel. A quote can identify an assessment dependency before the repair is priced fully; it should not classify unknown lining as ordinary timber waste.'
    ],['asbestos']),
    section('retained-roof-edge','Local board repair or replacement along the edge?',[
      'A defined damaged length may suit local replacement when adjoining timber and fixings are suitable. Longer deterioration, connected damage or an unavailable profile can change the practical extent. For fascia, the gutter relationship matters; for bargeboard, the gable junction and finish matter. The visible length alone does not establish how much access is needed.',
      'Ask what happens to the retained ends and connections, how the new profile meets the old work and whether painting stops at the replacement or continues along the edge. A patch of new paint may remain visible. [Fascia and eaves repairs](/services/fascia-and-eaves-repairs/) can start with the component and symptom, then define the actual materials and repair boundary on site.'
    ]),
    section('access-and-price','Height, access and making good affect the quote',[
      'Working safely at a roof edge can require equipment and setup that are not apparent in a close-up. Tell the team about side access, gardens, overhead services, neighbouring property restrictions and occupied areas below. Do not promise access over a neighbour’s land without their permission. The access plan is part of the work, not an optional detail to settle after materials arrive.',
      'Compare removal, disposal, material identification, roof or gutter coordination and painting alongside the board replacement. Ask whether concealed support damage is an allowance, an exclusion or a finding to quote separately. Two proposals for the same visible length can differ because one includes reinstating adjoining components and the other only supplies the timber.'
    ]),
    section('roof-edge-enquiry','Send a location, a water history and an overview',[
      'Give your suburb, the side of the building and the component’s position. Optional ground-level photos of the full edge and visible defect can show the pattern. Include any existing material records, earlier leak report or repair scope already available. A clear description is enough to begin if photographs cannot be taken safely.',
      'The next step is to agree the assessment, material checks and responsibilities before disturbance. Read [recurring timber rot](/news/why-timber-rot-returns/) where the same board has failed again, or [weatherboard damage](/news/timber-weatherboard-damage/) if the problem continues down the wall. A useful roof-edge repair addresses both the timber and the conditions that keep wetting it.'
    ])
  ],
});
