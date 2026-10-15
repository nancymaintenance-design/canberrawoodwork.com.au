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
    section('decision-1','Compare the boards, supports and complete deck',[
      "Compare a complete deck: the board product, supports, fixings and finished edges. Timber species and composite ranges differ, so a colour sample alone cannot settle the choice. Start with whether the project is a new build, extension or replacement surface, then consider exposure, everyday use and the care you are prepared to carry out.",
      'For timber, identify the species, board dimensions and coating proposal. For composite, identify the manufacturer, range, board system and associated fixing and edge components. Ask who supplies each item and which instructions apply. Ellis Services Group’s carpentry team installs composite decking. Confirm the product and site arrangement in the accepted proposal, which needs to specify the actual system.'
    ]),
    section('care-commitment','Compare cleaning and coating requirements',[
      'Timber appearance and care depend on the selected finish and exposure. Composite also has cleaning and care requirements. ModWood publishes different care documents for its products, so use the document for the proposed range rather than assuming one method fits all composite boards. “Low maintenance” still needs a practical explanation of cleaning, stains and the owner’s responsibilities.',
      'Ask what routine care is expected, which products are compatible and what records should be kept. If a proposal compares lifetime costs, check the assumptions about future cleaning, recoating, repairs and replacement. No material is universally cheaper over its life. Your priorities may include preserving a timber appearance, reducing coating work or matching an existing area; describe them before choosing a product.'
    ],['composite']),
    section('sun-and-use','Think about sun, colour and everyday use',[
      'An exposed deck and a shaded area have different use conditions. Ask the supplier about the exact range and colour under the expected exposure, particularly where barefoot use matters. Trex qualifies its heat-mitigating products: they can still become hot in sustained direct sun and high temperatures. That is not a universal measured temperature comparison between all timber and composite products.',
      'A sample can show texture and colour but cannot reproduce every season or outdoor condition. Discuss shade, intended furniture, pets and how the space will be used. If the proposal includes slip or fire-performance claims, ask for the current product-specific evidence and its relevant installation conditions. A board category alone should not be treated as proof of suitability for every location.'
    ],['heat']),
    section('frame-compatibility','Check whether existing framing can support new boards',[
      'Changing boards does not establish that old supports can be reused. The joists, bearers, posts and connections need assessment, and the proposed system’s support and fixing requirements need checking. Old fixing positions or a familiar board width are not enough to confirm compatibility. Ask how retained framing will suit the selected board system and what work is allowed for if it does not.',
      "Use the technical documents for the selected manufacturer and range to check support spacing, fixing methods and edge details. The linked ModWood directory is one example, not identification of the boards at your property. Resolve damaged supports before choosing a surface conversion; the [board-versus-frame guide](/news/deck-boards-or-frame/) explains what needs checking."
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
    section('material-enquiry','Confirm the decking product before ordering',[
      'Send your suburb, intended use, approximate layout if known and whether an existing deck is involved. Include available plans and product preferences, plus the care commitment you want to discuss. Optional safe photographs can show the area and access. Do not enter an unsafe deck space to supply measurements or an underside view.',
      "Start with [new deck construction and extensions](/services/deck-building/) for the overall layout or [composite decking installation](/services/composite-decking/) for WPC fitting. Before ordering, settle the exact board range, compatible fixings, support design and who supplies each item. Keep the product’s care instructions with the quote so future cleaning and repairs refer to the deck actually installed."
    ])
  ],
  'timber-deck-maintenance-canberra':[
    section('decision-1','Distinguish deck surface care from timber repair',[
      "A faded deck may need cleaning and a renewed coating; a loose board or moving support needs repair assessment first. Ellis provides stand-alone deck cleaning and oiling as well as carpentry repairs. These jobs can be combined, but cleaning, preparation and coating cannot restore a deteriorated support or establish the condition beneath the boards.",
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
    section('preparation-scope','Plan cleaning, preparation and coating',[
      'A care quote should describe the treated area, preparation and selected coating. “Restoration” can mean different things, from cleaning to board replacement, so ask what will actually happen. Furniture handling, protection of adjoining walls or plants and debris removal can also affect the job. Sanding is not automatically appropriate for every board condition or previous coating.',
      "Cabot’s Natural Decking Oil guidance explains how preparation changes with the existing surface and sets weather limits for that product. Check the directions for the coating actually selected. The Melba record identifies Cabot’s oil-based decking oil but not its exact formulation, coat count or drying schedule, so use it to understand the work stages rather than copy an application method."
    ],['oil']),
    section('repair-before-finish','Resolve board and support defects before treating the finish',[
      'A raised edge, split end or loose fixing may involve the board and the supporting material beneath it. Repeated movement or deteriorated connections should not be priced only as another coat of oil. The assessment needs to identify suitable retained components and any repair boundary. New boards may remain visually different from weathered retained material after the agreed finish.',
      'For widespread or connected defects, compare [repair with rebuilding](/news/repair-or-rebuild-a-deck/) before committing to surface work. A clean deck can still have a support problem. The Melba sequence above shows board repair followed by preparation and oiling; it does not establish that every deck has the same condition or needs the same sequence.'
    ]),
    section('exposure-care','Use exposure and product instructions to plan future care',[
      'Sun, repeated wetting, sheltered areas and debris collection can produce uneven wear across one deck. Discuss those patterns rather than assuming the entire surface needs treatment on one fixed calendar. WoodSolutions relates recoating to finish and exposure and recommends removing debris before recoating. Use the selected product’s instructions for the actual care method.',
      'Keep an eye on changes visible during normal safe use, and report new movement or softness as a repair enquiry. Do not try to compensate for a wet junction by adding repeated coating without reviewing the source. If you are considering changing board material to alter the care commitment, read [timber versus composite decking](/news/timber-vs-composite-decking-canberra/) and compare the complete system.'
    ],['decking']),
    section('care-price-boundary','Check preparation, product and access costs',[
      'Confirm the area, product supply, preparation, repairs, access and disposal in the quote. Ask whether the finish includes only repaired boards or the retained surface as well. Different preparation allowances can explain different prices for decks of a similar area. No universal coating life, drying time or maintenance cost is promised by the phrase “cleaning and oiling”.',
      'Agree weather and access arrangements under the selected product instructions, including when the area can be used and who confirms that at handover. Tell the team about furniture, pets and the only access route to the house. If repair findings change the job, ask for the added work and price basis to be explained before the extra work proceeds.'
    ]),
    section('care-enquiry','Details to send and maintenance records to keep',[
      'For [deck cleaning and oiling](/services/deck-cleaning-and-oiling/), provide your suburb, the intended treated area, coating information if known and any defects already noticed. Use [deck repairs](/services/deck-repairs/) where movement or timber damage is the main issue. Optional safe overview and detail photos, earlier scopes and available product records help the team prepare the assessment.',
      "Keep the repair details, coating name and care instructions with the property records. At the next visit, this lets the team check compatibility and see which boards were replaced. Note uneven wear or new movement as it appears during normal use; finish maintenance and a developing support fault need different responses."
    ])
  ],
});

Object.assign(expandedGuideBodies,{
  'repair-or-rebuild-a-deck':[
    section('whole-deck-decision','Start with condition and the layout you need',[
      "Repair may suit isolated board, connection or support damage where the surrounding structure can stay. Rebuilding becomes worth comparing when several connected parts are damaged or a new footprint, height or stair position is needed. The number of worn boards alone cannot decide: a tidy surface may hide poor supports, while an older deck may still contain serviceable timber.",
      'Separate your two questions: what needs work now, and what would you like to change? A deck that could be repaired locally may still not suit a proposed extension or new stair position. Conversely, an appearance concern may only require defined surface care once defects are assessed. Tell the assessor both the observed problem and your intended use before asking for one headline price.'
    ]),
    section('deck-assessment','Inspect the boards, supports and connections',[
      'Stop using an unstable or visibly damaged area while assessment is arranged. Do not lift boards, crawl underneath an unsafe deck or add weight to test movement. Existing plans, earlier repair records and safely available photographs can help describe the structure. They do not confirm that concealed timber or connections are suitable for retention.',
      'Ask the assessment to distinguish the surface, supporting joists and bearers, posts, footings, building connections, stairs and barriers where present. The accessibility of these parts affects what can be established. If some areas cannot be checked initially, the quote should explain that uncertainty and the agreed inspection or variation process before covering them with new boards.'
    ]),
    section('local-board-choice','When local board repair is suitable',[
      'A local board repair can suit a defined defect with suitable adjacent boards and retained supports. Its scope should name the boards, joins, fixing work and finishing boundary. Damaged ends beside a stair or wall may involve different access from boards in an open area. Ask how the proposed replacement relates to the existing layout rather than counting surface boards alone.',
      'New timber may differ in colour, texture or dimensions from the weathered surface. Agree a practical match and whether preparation or coating will include retained boards. Surface appearance and support condition are separate decisions. See [deck boards or framing](/news/deck-boards-or-frame/) for the distinction before comparing a board-only proposal with broader work.'
    ]),
    section('frame-choice','Frame and connection repairs need their own plan',[
      'Defined damage in a joist, bearer, post or connection can lead to a support repair rather than a complete rebuild, where the retained assembly is suitable. The repair method, safe sequence and any structural professional input need to follow the actual condition. A fresh walking surface cannot compensate for an affected support or an unsuitable connection.',
      'Ask which connected components will be checked, how access is provided and whether the wetting cause is included. A building junction or repeatedly damp corner deserves attention as a detail, not merely another replacement length. Where additional damage is found, the finding and proposed revised boundary should be explained before work beyond the accepted scope proceeds.'
    ]),
    section('rebuild-choice','When damage or a new layout leads to rebuilding',[
      'Rebuilding may provide a clearer option where several parts need work together or the retained structure does not suit the new design. Compare removal, site preparation, supports, boards, stairs, barriers and finish on the same basis. A rebuild quote should state what, if anything, is retained. Do not assume that “new deck” includes every adjoining landscape or drainage item.',
      'An extension also needs the existing and new systems considered together. The proposed material, connections and access may change the design. Discuss the intended furniture and use without assuming an old frame can accept a new surface or added area. The [timber and composite comparison](/news/timber-vs-composite-decking-canberra/) helps identify the product questions to settle before supply.'
    ]),
    section('act-deck-checks','Confirm building and planning responsibilities for the actual proposal',[
      'ACT guidance treats development approval and building approval as separate matters. A possible exemption from one does not settle the other, and general conditions sit alongside project-specific criteria. Ask the relevant professionals to check the actual repair, rebuild or extension. There is no single low-height shortcut that confirms every deck project’s requirements.',
      "Keep existing drawings and approvals available, and ask who checks the new proposal and obtains any required documents. Describe an extension, altered stairs or a changed barrier explicitly. Those changes need to appear in both the construction proposal and the approval review, so a quote for board replacement is not mistaken for permission to alter the whole deck."
    ],['approval']),
    section('deck-written-quote','From assessment to a written quote',[
      'Our written quote identifies the agreed retained and replaced components, materials, fixings, removal, access and finishing. Confirm which specialist checks and project requirements apply, how additional findings are recorded and which parts remain outside the scope. A written variation should state the added work, price basis and scheduling effect before that extra work proceeds.',
      "Send the observed symptoms, intended layout, suburb and available records. Use [deck repairs](/services/deck-repairs/) for existing damage or [new deck construction and extensions](/services/deck-building/) for a new layout. Compare the same removal, supports, boards, stairs and finish across proposals; a cheaper board-only price answers a different question from rebuilding the structure."
    ])
  ],
  'carpentry-jobs-before-selling':[
    section('presale-priority','Put safety and everyday operation ahead of cosmetic lists',[
      "Put unreliable doors, loose fittings and unsafe stairs or rails at the top of a pre-sale repair list. Next consider damaged skirting, architraves and unfinished room junctions. Distinguish a defect from an optional upgrade: restoring a cupboard hinge may be enough without replacing the storage. These repairs improve the agreed components; their effect on a sale price or timing is uncertain.",
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
    section('fitted-versus-furniture','Measure and plan new built-in storage',[
      "Built-in storage is fitted to the room, so its doors, drawers and fixing points must suit the measured space. Standard units may work with fitted edge details; an awkward opening may need separately manufactured components. Establish the product and who supplies or makes it before buying. Freestanding furniture has a different relationship to the walls and surrounding trim.",
      'For a wardrobe enquiry, include the space, intended storage, door arrangement, obstructions, existing units and finish expectations. Ask who supplies the product and who completes assembly and fitting. The [Pearce IKEA wardrobe installation](/projects/pearce-wardrobe-installation/) records that particular assembly and fitting scope; it does not establish a universal custom-manufacture service or a product partnership.'
    ]),
    section('sale-access-timing','Plan access around occupants and the actual booking',[
      'An occupied or tenanted property needs an authorised contact, agreed entry and a workable area. Mention keys, parking, furniture, pets and agent coordination when relevant. A proposed sale or inspection date helps explain your timing needs but does not guarantee availability. Confirm material lead times and accepted appointments with the team before relying on a completion date.',
      'If an assessment reveals a larger moisture or structural problem, keep it visible in the work plan rather than treating it as a rushed touch-up. Ask the appropriate property professional about any sale documentation or disclosure questions. The carpenter’s scope describes the physical work and its limits; it cannot decide the transaction’s legal requirements.'
    ]),
    section('presale-quote','Separate priority repairs from optional upgrades',[
      'Ask for labour, materials, supply responsibility, removal, finish and access to be clear for the accepted tasks. Confirm any minimum booking or assessment charge and whether GST is included. Grouping several items may make coordination easier, but it does not establish a discount or mean every task can be completed at one visit.',
      "Send the room list through [small carpentry jobs](/services/small-carpentry-jobs/) or [interior and renovation carpentry](/services/interior-carpentry/) for an on-site assessment. Ask the written repair plan and quote to distinguish priority defects from optional upgrades. This makes it easier to accept the necessary work and coordinate flooring, painting and access around the actual booking."
    ])
  ],
  'carpentry-quote-cost-factors':[
    section('price-comparison','Compare the completed job before comparing the price',[
      "Compare what each quote delivers: the parts to repair or replace, supplied materials, access, removal and finishing. An hourly rate covers labour on a stated basis; a board price covers material. Neither shows the whole job. A small sill defect may involve matching an old profile and arranging glazing access, while a longer straight trim run may be simpler to fit.",
      'Start with the component and the outcome you want: restore a closing door, replace a defined board group, fit matching trim or build a new deck. Then compare proposals for that same outcome. If one quote includes removal and decoration and another only installs supplied timber, the total prices answer different questions even if the job title looks identical.'
    ]),
    section('hourly-fixed','Hourly work, fixed scope and allowances need clear terms',[
      'Ask whether the proposed work is priced as an agreed scope, time-based labour or a combination with specified allowances. For time-based work, clarify what time and charges are included. For a quoted scope, check the assumptions and exclusions. The useful question is how the price is calculated for your accepted work, not which charging label is always better.',
      'An allowance for uncertain material or concealed work needs an explanation of what it covers and how it is reconciled. A safe photograph can help prepare an assessment, but it cannot establish every fixing point or hidden support. Ask what remains to be checked on site before treating an early estimate as a complete agreed price.'
    ]),
    section('extent-uncertainty','Hidden damage can increase the work required',[
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
      "Request current qualifications, licence and insurance evidence relevant to the actual work, and identify the contracting entity. If a leak, glazing task or structural assessment must happen first, name that dependency and its responsible professional in the proposal. This makes the repair sequence and costs easier to compare without assuming that every trade is included."
    ]),
    section('quote-request','Send a task list that supports a clear quote',[
      'Give Ellis your suburb, the component, symptoms, intended finish and access details. Optional safe photos and available product records help describe the task; do not dismantle or enter an unsafe area to obtain them. For new work, include the intended use and any plans. For repeat repairs, include the earlier scope and known cause if available.',
      "Start with [small carpentry jobs](/services/small-carpentry-jobs/) or the appropriate entry in the [service directory](/services/). Before acceptance, check written inclusions, exclusions and how additional findings will be priced. Keep the accepted quote and agreed changes together, including the material specification and final finishing area."
    ])
  ],
});

Object.assign(expandedGuideBodies,{
  'cabinet-hinges-and-drawer-runners':[
    section('hardware-or-panel','Start with the fitting and the material holding it',[
      "A dropped cupboard door may need hinge adjustment, a new fitting or repair to the panel holding its screws. A drawer can tilt because of its runners, mounts or drawer box. Check these parts together: new hardware will not solve a swollen cabinet side that cannot hold a fixing. An isolated fault can often be assessed without treating the whole kitchen as a replacement job.",
      'Stop using a loose door or unstable drawer rather than repeatedly opening it to show the fault. Do not remove a heavy panel or pull a drawer free for a hardware photograph. Describe the problem and which cabinet it affects. The assessor can then plan access and identify whether replacement parts, panel repair or a wider scope should be considered.'
    ]),
    section('hinge-options','Adjustment is useful only where the hinge can hold',[
      'An otherwise serviceable hinge may need alignment; a damaged hinge needs compatible hardware. If screws have pulled out of a swollen or broken panel, the timber or sheet material needs assessment first. Installing a new hinge into an unsuitable fixing point can repeat the problem. Ask whether the repair retains the door, the mounting plate and the cabinet side.',
      'Overlay, opening angle and the surrounding clearances influence hinge selection. A soft-close upgrade should not be assumed to fit an older door simply because the hinge looks familiar. Before ordering owner-supplied hardware, have the model and mounting arrangement confirmed. A local repair may retain most of the kitchen, but its limits should be explained where a panel no longer supports the required fixing.'
    ]),
    section('runner-identity','Runner length is only one compatibility check',[
      "Drawer runners differ in mounting method, extension, load class and motion features as well as length. Blum’s Australian range shows these distinctions. The replacement must match the actual drawer and cabinet, so a runner from that range is not automatically a substitute for an unidentified older fitting.",
      'Record a visible brand or part number only if it can be seen safely without dismantling. Include whether one drawer or several are affected and whether the fault developed suddenly or gradually. The repair proposal should confirm the replacement system, suitable mounting points and any drawer-box work. Parts availability can influence whether a direct replacement or a different agreed solution is practical.'
    ],['runners']),
    section('water-damaged-cabinet','Check the moisture source behind a swollen kickboard',[
      'A kickboard is the panel closing the gap beneath cabinets, not the skirting running around the room. If a plumbing leak has damaged it, confirm that the leak is resolved before replacement. Ask whether adjacent panels, feet or fixing locations also need assessment. A fresh kickboard can hide a continuing problem if the enquiry is treated only as a colour match.',
      'Water-damaged sheet material may not return to its original dimensions or fixing condition just because the visible surface dries. The extent and material need checking. Plumbing work belongs with the relevant qualified professional; cabinet reinstatement is a separate scope. Confirm removal, matching finish, edge details and access around appliances before a new panel is ordered.'
    ]),
    section('wardrobe-and-new-storage','Keep wardrobe mechanisms and new storage proposals distinct',[
      'A wardrobe sliding door coming off its track requires its rollers, track, stops and fixing arrangement assessed together. Do not lift out a heavy or mirrored door to inspect it yourself. Glass and mirrored panels need appropriate specialist handling. Repairing the mechanism differs from redesigning the wardrobe or replacing every cabinet in the room.',
      'New fitted storage needs a measured layout, materials, supply and installation responsibilities. The [Pearce wardrobe record](/projects/pearce-wardrobe-installation/) shows IKEA product assembly and fitting, not in-house cabinet manufacture or an IKEA partnership. A cabinet repair enquiry should therefore identify whether you want to restore an existing fitting or discuss a new storage installation.'
    ]),
    section('cabinet-scope','Details to send about cabinet faults',[
      'For [cabinet door and drawer repairs](/services/cabinet-door-and-drawer-repairs/), send your suburb, the cabinet location and one symptom per item. Optional overview and safely visible hardware photos can help identify the task. Mention any known leak, glass panel, appliance obstruction and existing product records. Do not buy a runner based only on a photograph of a similar kitchen.',
      "Ask the quote to separate hardware, fixing-point repair, panels and finish. For several units, list each fault so an adjustment is not confused with panel replacement. The [quote cost guide](/news/carpentry-quote-cost-factors/) explains how supply and fitting affect the price. A matching-looking hinge or runner is only suitable if its mounting arrangement and clearances also work."
    ])
  ],
  'timber-weatherboard-damage':[
    section('weatherboard-symptom','Check the cracked board and adjoining wall',[
      "Individual timber weatherboards can sometimes be replaced where the adjoining boards and supports remain sound. The repair still needs to follow the board’s profile and overlap. A split end beneath a window or a stain that returns after rain also calls for checking the water route and backing; repainting the visible mark will not correct damage behind it.",
      'Tell the team where the damage sits: under a window, near a corner, beside a downpipe or across an exposed wall. Note any known leak and earlier patch. Do not pull a board away to see behind it. Photos from accessible ground can show the pattern; inspection access and material identification should be agreed before the wall is disturbed.'
    ]),
    section('profile-lap','Matching the face also means matching the profile',[
      'Weatherboards overlap to form the wall’s outer layer. Thickness, shaped profile, exposed face and junction details affect how a replacement meets retained boards. A similar colour or nominal width is not enough to establish compatibility. Ask how the proposed board relates to the existing lap, corners and openings, particularly where the original profile is no longer readily available.',
      'A sample or measured profile may be needed before supply. Local replacement can preserve useful cladding but may show a colour or texture difference after finishing. A longer section can sometimes create a more workable junction or finish. The reason should be explained in the proposal rather than assuming that every cracked end requires replacing the whole wall.'
    ]),
    section('behind-cladding','What the assessment may need to check behind the board',[
      "When a board is removed, the material holding its fixings and the adjoining framing can be checked where accessible. A new face board needs sound support and a working drainage detail. Before removal, establish what can already be inspected and how further damage will be recorded and quoted if it becomes visible.",
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
    section('weatherboard-enquiry','Details to send about damaged weatherboards',[
      'For [timber weatherboard repairs](/services/timber-weatherboard-repairs/), include your suburb, wall location, approximate affected area if known and any water history. Optional safe overview and detail photos help explain the profile and nearby openings. Existing material records and earlier repair scopes are helpful; a clear description is enough if photographs are not safe.',
      "Discuss which lengths can stay, how corners and window junctions will be matched, and where painting should stop. If an earlier patch has failed again, read [recurring timber rot](/news/why-timber-rot-returns/). Keep water-source work and the replacement board in the same repair plan so a newly painted face does not conceal the unresolved fault."
    ])
  ],
  'loose-timber-stairs':[
    section('stair-safety','Treat movement in a tread or rail as a safety issue',[
      "A loose tread or handrail needs the fixing and the material behind it checked together. Stop relying on the affected part and avoid the unsafe route while professional assessment is arranged. A bracket can look like the only fault even when its timber support is split or decayed; a cosmetic patch or extra screw does not establish safe support.",
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
      "Ask the relevant professionals to confirm building and planning requirements for the proposed repair, especially where supports or fall protection change. The method must suit the actual connections and supporting material. Keep the stair out of use where unsafe until the assessment and necessary work are resolved."
    ],['approval']),
    section('stair-quote-inclusions','Include supports, access and finishing in the quote',[
      'The quote should identify the component, retained supports, replacement material and connection work. Ask how access is managed while the stair is unavailable and whether adjoining finishes or barriers are included. A matching timber tread and a completed usable stair are not necessarily the same scope. Painting or coating should be listed separately from the support repair.',
      'If deterioration appears outdoors, discuss the moisture route and the care information for the selected finish. Where more damage is found during agreed access, request the finding and revised scope before extra work proceeds. Clarify any use restrictions and the handover arrangements after the agreed repair. Avoid treating a new finish as proof that concealed supports were checked.'
    ]),
    section('stair-enquiry','Send observations from a safe position',[
      'For [timber stair and handrail repairs](/services/timber-stair-and-handrail-repairs/), provide your suburb, the affected stair or rail and what you already noticed. Mention whether another route exists, who authorises access and any available plans or repair records. Use existing safe photographs or a description; do not crawl beneath an unstable stair or lean over a loose barrier.',
      "Mention a moving deck or landing connected to the stairs; [deck boards and framing](/news/deck-boards-or-frame/) explains why adjoining supports matter. The repair proposal should connect the visible fault to the parts carrying its load. Agree access during work, any use restrictions and the final finish alongside the repair itself."
    ])
  ],
  'pergola-post-rot':[
    section('post-support','A rotten post belongs to a connected structure',[
      "A rotten pergola or verandah post cannot be considered separately from the beams, connections and roof it may carry. The soft base may be the first visible defect, while decay or poor connections elsewhere change the repair. Local repair and full post replacement both need assessment of the connected structure and a safe support sequence before anything is cut.",
      'Keep clear of a structure showing movement, instability or falling material. Do not cut the post, excavate its footing or improvise props. Even an open pergola can depend on connections that are not apparent from a photograph. Tell the assessor about any roof, screens, attachments or recent changes so the whole arrangement can be considered.'
    ]),
    section('post-moisture','Check water collecting around the post base',[
      'Water collecting beside the post, changed paving levels, debris and repeated wetting are useful observations. The condition of the base connection and footing also affects the option. A new post fitted into the same unresolved water trap may leave a recurrence problem. Describe when water appears and whether drainage or landscaping changed before the deterioration was noticed.',
      'A photo can show the location but cannot establish timber condition below paint or inside a connection. The assessment may need agreed access and qualified structural input to define the boundary. Do not probe the base or expose a footing to obtain more detail. The repair plan should explain the moisture-source work as well as the replacement material.'
    ]),
    section('post-options','Local repair, post replacement or wider timber work?',[
      'A local base repair requires suitable retained timber and a connection that meets its supporting role. Replacing a full post still needs an appropriate connection and footing. If beams or adjoining posts are affected, the scope may extend beyond the first soft area. Ask which components remain and how that decision is supported.',
      'Compare the complete work rather than the cost of a length of timber. Access, support planning, removal, fabrication, connections and finishing can differ between options. A patch that restores the outline is not automatically a structural repair. The [recurring rot guide](/news/why-timber-rot-returns/) explains why sound retained material and the wetting route both matter.'
    ]),
    section('pergola-checks','Check approval requirements for the proposed work',[
      'Adding a roof, changing a footprint or altering supports can change the project from a local repair to an alteration proposal. ACT Planning lists specific criteria for pergolas and shade structures alongside general building-approval conditions. Confirm the requirements for the actual work; a label such as “pergola repair” does not decide them.',
      "Building approval and development approval are separate checks, and property constraints may also apply. Ask the relevant design professional, builder or building certifier to review the proposed work and identify the documents needed. Compare existing drawings with the structure as it stands, including any added roof or screens."
    ],['approval']),
    section('pergola-scope','Define the connections, access and finish in the proposal',[
      'For a repair quote, identify the affected posts and beams, retained components, proposed material and connections. Ask how concealed findings will be handled and which specialist roles are included. Overhead electrical fittings and roof or gutter defects need their relevant qualified pathways. They should not disappear inside a general timber replacement allowance.',
      'Discuss access around planting, paving, stored items and adjoining property. Confirm whether the finish covers repaired areas or a wider visible assembly, and who makes good disturbed surfaces. Matching an aged stain exactly may be difficult. The accepted scope should explain the completed boundary, including disposal and any care information, rather than end at “replace post”.'
    ]),
    section('pergola-enquiry','Prepare the enquiry without approaching a failing support',[
      'Send your suburb, the location of the post and the symptoms already visible. From safe ground, an overview can show the structure and attachments; a base detail is optional only where safely accessible. Include known leaks, drainage changes and available plans. Do not climb, enter beneath an unstable structure or test the post to provide more evidence.',
      "Use [pergola and verandah timber repairs](/services/pergola-timber-repairs/) to arrange an on-site assessment. Include any nearby loose steps or rails; [timber stair safety observations](/news/loose-timber-stairs/) explains those connected concerns. Select replacement timber only after the supporting role, connection and moisture problem have been established."
    ])
  ],
});

Object.assign(expandedGuideBodies,{
  'leaning-paling-fence':[
    section('fence-pattern','Look at the leaning pattern before counting palings',[
      "A timber fence can lean when a post, footing or rail connection fails, even if the palings look serviceable. Notice whether the lean is around one post or continues across several bays. That pattern helps direct the inspection; replacing surface boards alone cannot straighten a failed support. Include a dragging gate if it hangs from the affected run.",
      'Record what changed: a storm, nearby ground work, a gate that now catches or a post base that looks deteriorated. These observations help explain the request but do not identify a single cause. Do not push the fence to test it, remove a paling to inspect behind it or stand beside a section that appears unstable.'
    ]),
    section('fence-components','Which posts, rails or palings need repair?',[
      'Posts support the fence; rails connect the posts and carry the palings. An isolated broken paling may be a straightforward component replacement where the rail can hold a suitable fixing. A deteriorated post changes that conversation because the retained rails and palings need a support and connection plan. The assessor should explain which components are suitable to stay.',
      'Damage near ground level also prompts questions about wetting, surrounding levels and the footing. A new post is not a complete specification on its own. Ask what support detail is proposed and how the rails, gate or adjoining panel will connect. Do not dig around the base or brace a failing fence yourself to establish the extent of decay.'
    ]),
    section('partial-fence-repair','Can a post be replaced while keeping the fence boards?',[
      'Partial repair may be possible when retained rails and palings remain suitable and can be handled without creating further damage. Keeping older material can reduce unnecessary replacement, but dismantling and refitting also involves labour and uncertainty. A section that looks sound from one side may have poor fixing points on the other, so retention should follow assessment.',
      "Compare a longer replacement when several supports are damaged or the old rails and boards cannot be reconnected reliably. Include dismantling and refitting in both options. Keeping old palings saves new material only where their condition and fixing points make reuse practical; it can still require considerable handling."
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
      "For [timber fence repairs](/services/timber-fence-repairs/), ask which posts, rails and palings need work and which can stay. Compare removal, footings, refitting, disposal and finish over the same affected length. Agree how newly exposed damage is handled before work begins, particularly where post bases cannot be fully inspected at the first visit."
    ])
  ],
  'skirting-after-new-flooring':[
    section('new-floor-junction','A new floor changes more than the skirting height',[
      "A changed floor level can leave a gap below existing skirting or alter the door clearance. Possible finishes include refitting suitable boards, replacing the skirting or using a compatible finishing trim. Choose the detail with the flooring system, finished level and adjoining architraves in mind. Removing old skirting can also leave wall damage that needs making good.",
      'Do not fill every visible gap before asking the flooring installer which edge detail applies. Some gaps serve the flooring system’s movement requirements. For example, Quick-Step Bloom instructions keep its floor free to move beneath wall-fixed skirting. That is product-specific guidance, not a universal gap dimension or sealant rule for every timber, laminate or hybrid floor.'
    ],['flooring']),
    section('skirting-sequence','Agree the sequence with the flooring installer',[
      "Settle the floor’s finished height and perimeter requirements before final trim fitting. Old skirting may be reusable if it can be removed without breaking and still suits the new level. Brittle material, thick paint and earlier fixings can make that difficult. Check the boards on site before relying on reuse in the material order.",
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
    section('trim-finish','Confirm whether the quote includes painting',[
      'Quotes can include different stages: removal, supply, cutting and fitting, fixing holes, caulking, priming or final painting. Primed material is not the same as a completed painted finish. Ask which surface the caulking applies to, how wall damage will be handled and where decoration stops. Any treatment beside a floating floor must respect the selected flooring instructions.',
      'Corners, returns, short lengths around cabinets and junctions at architraves can take more attention than a simple perimeter measurement suggests. Access to furniture-covered walls and protection of the new floor also affect the work. Use [skirting and architrave installation](/services/skirting-and-architraves/) to define the measured scope rather than comparing board supply prices with a complete room finish.'
    ]),
    section('trim-enquiry','What to send before the on-site measure',[
      'Include the rooms, your suburb, whether flooring is installed or planned and which trim is staying. Give the flooring product or installer’s edge requirements if available. Optional photos of the wall junction, a corner and a doorway help show the relationship between components. A room perimeter can start the conversation, but it does not replace a measured fitting list.',
      "Ask Ellis to record the profile, supply responsibility, removal, floor protection and painting in the installation plan and quote. Mention rubbing doors as a separate item; the [wet-weather door guide](/news/timber-door-sticks-after-rain/) explains why clearance should be checked before trimming. Fit the trim to the completed floor detail and agree how the new finish meets existing paint."
    ])
  ],
  'why-timber-gates-sag':[
    section('gate-support-path','A latch problem can begin at the post',[
      "A gate’s weight passes through its frame and hinges into the post. Loose hinge fixings, a distorted frame or a moving post can lower the latch side until it drags or misses the catch. Moving the latch may hide the symptom briefly. The repair needs to address the part that changed before final clearance and latch alignment are set.",
      'Note whether the top and bottom gaps have changed, the latch side has dropped or the post appears out of line. These are observations rather than tests of strength. Do not hang on the leaf, lift it while swinging or push the post to see how far it moves. Keep clear if the gate looks unstable or could fall.'
    ]),
    section('hinge-fixing','Loose hinges need a suitable fixing point',[
      'A hinge can be loose because its hardware is damaged or because the timber supporting the screws has split or deteriorated. Replacing screws does not establish that the remaining material can hold them. A post with a sound upper face can still have a problem at its base. Ask the assessment to distinguish hardware work from timber and support repair.',
      "A sound gate frame can sometimes stay while its hinges or post are repaired. A badly distorted frame or decayed fixing timber may need more extensive replacement. New hardware must suit the gate’s weight, dimensions and connection points; fitting a new leaf to a failing post can repeat the original fault."
    ]),
    section('dragging-ground','Dragging can follow rain or a change in the ground',[
      'A gate that drags throughout its swing presents a different pattern from one that catches on a newly raised paving edge. Wet-weather timber movement, soil buildup or a changed ground level can also reduce clearance. Record when it happens and whether the gate becomes easier to use in dry conditions. Avoid forcing it across the obstruction to demonstrate the problem.',
      'Cutting the lower edge before checking alignment can leave an unnecessary gap while the leaf continues to sag. Agree the intended swing, clearance and latch operation together. If the gate supports a particular access or safety function, explain that use before alterations are proposed. Pool barriers, powered gate equipment and access-control systems need their relevant specialist requirements assessed separately.'
    ]),
    section('gate-repair-options','Compare retaining the leaf with replacing the assembly',[
      'Retaining an otherwise suitable leaf can preserve a matching fence appearance. Its size, weight, condition and available hardware still need to suit the repaired supports. A new leaf fitted to a failing post may develop the same symptom. Conversely, replacing a post does not correct every distorted gate frame, so ask which part is driving the proposed scope.',
      'When comparing options, include the post or footing work, leaf repair, hinges, latch, removal and finish. Discuss whether new timber will match the weathered fence closely enough for your needs. A changed opening width or design should be described explicitly. Read [leaning fence repairs](/news/leaning-paling-fence/) if the supporting fence line is moving as well.'
    ]),
    section('gate-site-details','Agree access and who supplies the gate hardware',[
      'A side gate may be the only route to a backyard. Mention pets, security, tenant access and anything that prevents the opening being unavailable during work. Confirm permission for access from either side and who needs to be present. Hardware supplied by the owner needs compatibility checked before installation is agreed; a similar-looking latch may not fit the existing arrangement.',
      'Ask whether priming, painting or staining the repaired areas is included and whether disposal covers the old post or leaf. Ground work and concealed findings can change the scope. Request the process for approving additional work before it begins, rather than treating a photograph as a final price for every part of the assembly.'
    ]),
    section('gate-enquiry','Describe the movement, then arrange the repair assessment',[
      'Send your suburb, the gate location and whether it drags, misses the latch or has loose hinge fixings. Optional safe photos of the whole opening, the hinges and the post base are useful if they can be taken without moving the gate. Include any known change to paving, drainage or the adjoining fence.',
      "For [timber gate repairs](/services/timber-gate-repairs/), discuss the supports, full swing and latch operation together. If the lock or latch mechanism has failed, identify the appropriate locksmith or hardware work separately. The quote should state post and frame repairs, hinges, latch, disposal and finish so each option describes a complete working assembly."
    ])
  ],
  'why-timber-rot-returns':[
    section('recurring-rot','Find why the same timber keeps getting wet',[
      "Rot can return when water still reaches the timber, a joint traps moisture or decay extends beyond the earlier patch. Look at the repair history as well as the new damage: which pieces were replaced, which stayed, and whether a leak or drainage fault was corrected. Another surface patch will not resolve a continuing water source or damaged timber hidden beside it.",
      'Keep the earlier scope, photos and product information if available. A description such as “fixed and painted” may not distinguish timber replacement from filler and finish work. Note whether the same corner failed, a nearby section now looks affected or the defect followed a new leak. This history helps the assessor investigate the pattern without relying on guesswork.'
    ]),
    section('weathering-decay','Weathering, decay and insect damage are different questions',[
      'A grey or worn surface describes appearance; it does not establish the condition of the timber below. Decay can affect material and connections, while insect damage has a separate cause and can occur alongside dampness. A photo is not a reliable way to identify all three. Report the existing symptom without scraping, probing or opening the structure yourself.',
      'If pest activity is suspected, arrange the qualified pest assessment and retain its findings. Treatment of active pests and reinstatement of damaged timber are separate work scopes. A treatment record does not certify that a bearer, jamb or other component remains structurally suitable. Supporting members need the appropriate structural assessment before a replacement plan is agreed.'
    ]),
    section('find-water-route','Look beyond the paint to the wetting route',[
      "Water reaches components in different ways. A fascia may be wetted by a leaking gutter, a sill by a failed opening detail, and a post by soil contact or irrigation. WoodSolutions’ moisture-affected timber resources support checking the exposure and condition together. Describe where and when water appears rather than asking for the same filler or coating at every location.",
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
      "Compare the timber replacement, moisture-source work, access, removal and finish in the proposal. Ask which specialist checks are needed and how extra decay will be documented before more material is removed. Keep the repair and coating records: if damage returns, they help distinguish a new leak from a problem continuing at the original joint."
    ])
  ],
});
Object.assign(expandedGuideBodies,{
  'timber-door-sticks-after-rain':[
    section('wet-weather-movement','Why a door changes after wet weather',[
      "Rain can change the moisture in a timber door or frame and reduce the gaps that let it close. The position of the scrape matters: a swollen edge, loose hinge or thick paint can look similar, while new flooring can reduce only the bottom clearance. Record when the fault appears and whether it eases in dry weather before deciding that the door needs trimming.",
      'A swollen edge, loose hinge and thick paint can produce similar rubbing. Recent flooring can also reduce the bottom gap without changing the sides. Write down when the fault occurs, whether it improves later and what work happened before it started. Hume provides separate care and finishing support for its doors; identify your own manufacturer and construction before agreeing an adjustment.'
    ],['doors']),
    section('read-the-opening','Check hinges, frame and door clearance',[
      'The jamb is the side of the frame where the hinge or closing edge sits. The architrave is the trim covering the junction between frame and wall. A split in the jamb around a hinge affects the fixing point; a mark on the architrave may only affect the finish. Tell the assessor which part is damaged, or send a whole-opening photo if the names are unfamiliar.',
      'Note whether the top corner drops, one edge rubs throughout closing, or the leaf swings freely but the latch misses. A door that closes without latching needs an alignment and hardware check, rather than automatic edge removal. Several changing gaps, a soft lower jamb or fresh wall cracks deserve a wider assessment. Do not push, lift or slam the leaf to demonstrate the problem.'
    ]),
    section('safe-door-observations','What to record without taking the door apart',[
      'From the usual standing position, photograph the full opening, the rubbing location and any existing broken coating. Include both sides if they are safely accessible. Mention an exposed entry, a recently repaired leak, new flooring or a previous adjustment. There is no need to scrape paint, probe soft timber or remove a hinge to make the enquiry useful.',
      'Keep a reliable way in and out of the home. If the door is jammed or cannot secure the property, explain that when contacting the team so the appropriate response can be discussed. A heavy leaf, glazed panel or unsupported hinge can create a handling hazard. Locks, glass and identified fire-rated doors need their relevant specialist pathway and product requirements.'
    ]),
    section('choose-door-repair','Choose between adjustment, jamb repair and replacement',[
      "Adjustment may suit a sound door and frame once the cause is known. A loose hinge needs firm timber at its screws before the door can be aligned. If a jamb section is decayed, local replacement may keep the rest of the opening; damage continuing through connected joints can require a larger repair.",
      'Trimming is a material change, not a diagnostic test. A leaf that is trimmed while wet may have an excessive gap later, and construction can limit what can be removed. Not every internal door has the same edge allowance. The proposal should identify the door type, permitted adjustment and protection of newly exposed edges, rather than applying one cutting rule to every leaf.'
    ]),
    section('water-and-finish','Address the wetting route and the finish together',[
      'If moisture reaches the lower jamb or leaf, replacing a damaged piece alone leaves a separate question about the source. Discuss weather exposure, surrounding junctions and any known leak with the assessor. A coating helps protect suitable timber, but paint is not evidence that the material beneath it is sound. Repeated damage after a patch warrants another look at the cause.',
      'Confirm whether the work includes preparation, priming, painting or staining of the adjusted area, and whether adjoining surfaces are included. A local finish can be visible beside older paint. Our guide to [timber rot returning after repair](/news/why-timber-rot-returns/) explains why the repair boundary and the moisture route belong in the same conversation.'
    ]),
    section('door-quote','What to include in a door repair quote',[
      'Send your suburb, the door location, the closing symptom and its timing. Add safe overview and detail photos if convenient, plus any product label or previous repair record already available. Tell the team whether it is the main access door and whether pets, tenants or restricted entry affect the visit. Do not remove the door to obtain measurements.',
      "Ask the quote to distinguish alignment, timber replacement, door or hardware supply and edge finishing. A large or glazed door also needs suitable handling and any required glazing input. Start with [door and frame repairs](/services/door-and-frame-repairs/) and establish the cause before accepting a trimming-only proposal, then agree the closing and latch operation the repair should restore."
    ])
  ],
  'deck-boards-or-frame':[
    section('surface-or-support','Begin with the surface and the support system',[
      "Deck boards form the walking surface. Joists sit directly beneath them, bearers carry the joists, and posts and connections support the assembly. A worn board and a moving deck therefore need different checks. Board replacement is suitable only where the supports can hold the new boards and fixings; a tidy surface cannot demonstrate that concealed framing is sound.",
      'A split around a screw, worn coating or raised edge tells you about the visible area. Softness or movement already noticed underfoot raises a safety question that cleaning cannot answer. Do not walk back over the spot to compare it with another board. Keep an unstable or visibly damaged area out of use while the assessment is arranged.'
    ]),
    section('loose-fixings','Check raised fixings and the timber holding them',[
      'A fixing can move because of the board, the fastener, the timber holding it or movement elsewhere in the assembly. Hammering it down may hide the symptom without establishing that it will hold. Several fixings lifting in one line give different information from one damaged board end. Describe that pattern and any earlier repair rather than adding more fixings before the visit.',
      "A replacement fixing needs sound timber beneath it. Inspection may require underside access or agreed board removal, because a top view cannot show every connection. If joists or other supports are damaged, repair them before fitting the new surface. Record any added work and price before extending the repair."
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
      "For [deck repairs and board replacement](/services/deck-repairs/), compare the boards, support repairs, fixings, removal, access and finish listed in the quote. Identify any supports that could not be inspected initially and how later findings will be handled. A board-only price should be based on assessed supports, not an assumption that all concealed timber can stay."
    ])
  ],
  'rotten-window-sill':[
    section('sill-repair-boundary','A soft corner does not define the whole repair',[
      "A rotten sill can sometimes be repaired with a fitted replacement section, also called a splice, where the surrounding timber can support the joint. Decay through the sill or into the side frame may require a longer replacement. Peeling paint and staining show where to investigate, but their edges are not reliable boundaries for cutting away damaged timber.",
      'Record what is already visible: cracked coatings, open joints, staining or a change in window operation. Do not dig into the sill to find the edge of the damage. The on-site assessment should establish the component condition, the likely moisture route and any inspection access required before deciding between a splice, sill replacement or wider frame work.'
    ]),
    section('window-water','Why the sill shape and water route matter',[
      'A sill is more than a horizontal piece of timber under glass. Its profile, projection and junctions affect how the opening sheds water. Ends meet the side frames and may be concealed by other trim. A replacement that looks similar from indoors can still change an outside detail, so discuss function as well as appearance when choosing the repair.',
      'WoodSolutions describes timber-window durability as a combination of exposure, materials and maintenance, with resistance to water entry also relevant. If dampness follows rain, the leak needs attention alongside timber work. Repainting alone cannot establish that the wetting route has been corrected. Tell the team about previous sealing or leak work and which side becomes wet.'
    ],['windows']),
    section('splice-or-sill','Compare a splice with replacing the sill',[
      'A local splice replaces a defined damaged section while retaining suitable timber around it. This may preserve the existing opening and its character, but it relies on a viable join and a compatible profile. Longer sill replacement can be more practical where damage is continuous or the retained ends cannot provide suitable connections. Neither option follows a universal percentage rule.',
      "The replacement needs an agreed profile, material and protection for exposed edges. Surface filler may finish an appropriate repair but cannot substitute for sound timber at the connection. If the adjoining jamb or sash is damaged, include that work when comparing local repair with replacement of more of the opening."
    ]),
    section('glass-and-sash','Separate glazing, sash operation and timber work',[
      'A sash is the frame holding the glass within the opening. A sash that drops, sticks or appears painted shut has an operating problem that is distinct from the sill repair. If it will not stay open, stop relying on it to support itself. Do not wedge it open, force it free or dismantle balances and cords to diagnose the fault.',
      'Keeping the outer frame does not automatically mean glass can remain untouched. Access, the glass condition and retention details may require a glazier. Ask which specialist arrangements are needed and who coordinates them. Replacing glass, improving glazing performance and repairing timber are different scopes; [timber window repairs](/services/timber-window-repairs/) is the starting point for defining the timber work.'
    ]),
    section('profile-and-finish','Match the profile and agree the painted boundary',[
      'Photographs of the whole window and the affected corner help discuss a match. A measured section or supplier profile may still be needed before ordering. Species, dimensions, existing finishes and access around the opening affect the proposal. A visually close profile should also preserve the intended drainage detail, rather than merely reproducing an indoor edge.',
      'Confirm whether preparation, priming and final painting include the entire sill, the repaired area or surrounding frame. Local paint can stand out beside an aged coating. On a property with heritage controls or specific consent conditions, flag those records before alterations are planned and confirm the relevant professional advice. This guide does not decide what changes a particular property permits.'
    ]),
    section('window-enquiry','Details to send about a damaged sill',[
      'Include your suburb, the window type if known, the affected corner and whether water appears during rain. Mention earlier repairs, an unreliable sash and any difficulty accessing the outside. Optional photos should come from safe ground or a normal indoor position. Do not lean out, climb or remove paint to make the damage clearer.',
      "Ask the quote to distinguish timber, leak investigation, glazing, access, removal and painting. If more decay is found after agreed opening-up, review the finding and proposed change before extra work begins. For an earlier patch that has failed again, [why timber rot returns](/news/why-timber-rot-returns/) explains how the water source and adjoining timber affect the next repair."
    ])
  ],
  'fascia-bargeboard-eaves':[
    section('name-roof-edge','Identify the roof-edge component from the ground',[
      "Fascia runs along the lower roof edge beside the gutter; bargeboard follows a sloping gable edge. Eaves lining closes the underside of the overhang and may be a sheet material instead of timber. These parts meet at roof corners but require different repairs. Describe the position of the defect or use a ground-level overview if the name is unfamiliar.",
      'Describe whether the defect sits behind a gutter, on a sloping roof edge or underneath the overhang. Note a split, peeling coating, stain or sag already visible from safe ground. Do not climb onto the roof or lean a ladder against a deteriorated board for a closer view. The assessment must establish the material and fixing condition rather than rely on the component name alone.'
    ]),
    section('roof-water-route','Check water reaching the timber behind the gutter',[
      'A timber board behind a gutter can be repeatedly wetted by overflow, leaks or an adjoining roof-edge detail. Replacing the board without considering that route can leave the cause in place. Tell the assessor whether water spills during rain, whether a leak was repaired recently and whether the damage recurs at the same corner.',
      "The timber repair, leak correction and gutter removal or refitting should have named responsibilities. A roofing or guttering professional may be needed to stop the water before the board is finished. Nearby electrical fittings need the appropriate electrical work as well. Include these dependencies when comparing a full roof-edge repair with timber replacement alone."
    ]),
    section('unknown-eaves-material','Identify unknown eaves lining before disturbance',[
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
      "Arrange the on-site assessment and identification of unknown lining before any disturbance. If the same board has failed again, read [recurring timber rot](/news/why-timber-rot-returns/); if damage continues down the wall, see [weatherboard damage](/news/timber-weatherboard-damage/). The repair should address the affected timber and the leak or wetting detail beside it."
    ])
  ],
});
