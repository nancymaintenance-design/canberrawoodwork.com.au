import { gapGuides } from './gap-guides.mjs';
import { expandedGuideBodies, guideSources } from './expanded-guides.mjs';
// Informational copy for existing guides and approved decision-led additions.
// Publication dates retain the existing record; modified dates reflect this edit.
const approval = ['https://www.planning.act.gov.au/applications-and-assessments/building-approvals/check-if-you-need-a-ba','ACT guidance: check if you need building approval'];
const asbestos = ['https://www.accesscanberra.act.gov.au/business-and-work/building-and-construction/asbestos-assessor-and-removal-licensing','Access Canberra: asbestos assessor and removal licensing'];

export const guideEditorial = {
  'timber-door-sticks-after-rain': {
    title:'Why does a timber door stick after rain?', category:'Doors & windows', owner:'door-and-frame-repairs',
    metaDescription:'Why timber doors stick after rain, what the rubbing point can tell you, and why hinges, clearance and moisture need checking before trimming.',
    lead:'A timber door can stick after rain because moisture changes its dimensions or those of the frame. Loose hinges, coating build-up and water entry can produce similar symptoms, so trimming the edge is not always the right first repair.',
    faqs:[{q:'Will the door free up when the weather dries?',a:'It may if seasonal timber movement is the cause. Repeated rubbing, water damage or an unreliable latch still warrants assessment; drying does not repair soft timber or loose hinge fixings.'},{q:'Should I sand the edge that catches?',a:'First establish the cause, door construction and permitted adjustment. Sanding or planing can remove useful material and coatings without correcting a moving hinge or frame.'}],
    reading:['rotten-window-sill','skirting-after-new-flooring']
  },
  'deck-boards-or-frame': {
    updated:'2026-10-12',
    title:'Deck boards or framing: what needs repair?',category:'Deck care',owner:'deck-repairs',
    metaDescription:'Separate worn deck boards from support problems. Learn what joists, bearers, posts and connections mean for a board-only repair or wider deck scope.',
    lead:'Deck boards form the walking surface; joists, bearers, posts and connections support it. A damaged board can be a local repair only when the retained supports are suitable. A fresh surface does not establish that the frame is sound.',
    faqs:[{q:'Can good-looking boards hide a damaged frame?',a:'Yes. The condition of the exposed surface does not establish the condition of concealed supports or connections. Board and frame assessment are separate parts of the decision.'},{q:'Does replacing boards include sanding and oiling?',a:'Only if the quote includes that work. Confirm the area, preparation, coating and treatment of retained boards alongside the replacement scope.'}],
    reading:['repair-or-rebuild-a-deck','why-timber-rot-returns']
  },
  'rotten-window-sill': {
    title:'Can a rotten timber window sill be repaired?',category:'Window repairs',owner:'timber-window-repairs',
    metaDescription:'Understand when a rotten window sill may suit a local timber repair, what affects replacement scope, and why adjoining frames and drainage matter.',
    lead:'A rotten timber sill may suit a local repair when the remaining timber and adjoining frame can support a suitable replacement section. Decay across the sill, at joints or into the frame can require a wider repair. The visible soft spot alone does not define the boundary.',
    faqs:[{q:'Can a repair match the existing sill profile?',a:'Measurements and available materials establish the proposed match. Profile and drainage function matter together; confirm the sample or dimensions and finishing scope before replacement timber is ordered.'},{q:'Will painting stop the sill rotting again?',a:'A suitable coating helps protect sound timber, but recurring water entry or trapped moisture also needs attention. Painting over deterioration does not establish a sound repair.'}],
    reading:['why-timber-rot-returns','timber-door-sticks-after-rain']
  },
  'fascia-bargeboard-eaves': {
    title:'Fascia, bargeboard and eaves: what is the difference?',category:'Exterior timber',owner:'fascia-and-eaves-repairs',
    metaDescription:'Identify fascia at the gutter edge, bargeboard at a gable and eaves lining underneath. Learn why material, moisture and safe access change the repair.',
    lead:'Fascia follows the lower roof edge, often beside the gutter. Bargeboard follows the sloping edge of a gable. Eaves lining closes the underside of an overhang and may be a different material. The material and its position determine which connections and water paths need checking.',
    faqs:[{q:'Is every damaged eaves panel timber?',a:'No. Eaves linings can use different materials. Identify unknown lining before disturbance and use the qualified assessment pathway if asbestos is suspected.'},{q:'Should the gutter be checked when fascia rots?',a:'Yes. The water path near the gutter is relevant to the cause. The quote should distinguish timber repair from any required gutter or roof work.'}],
    reading:['why-timber-rot-returns','timber-weatherboard-damage'],sources:[asbestos]
  },
  'leaning-paling-fence': {
    title:'Why is a timber paling fence leaning?',category:'Fences & gates',owner:'timber-fence-repairs',
    metaDescription:'A leaning fence may involve posts, rails or fixings. Learn how the affected length and support condition guide repair versus replacement decisions.',
    lead:'A timber fence can lean because a post, footing, rail or connection has moved or deteriorated. Replacing loose palings alone will not correct a failing support. The affected length and condition of the retained sections guide repair or replacement.',
    faqs:[{q:'Can new palings straighten a leaning fence?',a:'Not when the lean comes from a post, footing or rail connection. Supporting components need assessment before the paling work is defined.'},{q:'Does the repair quote decide who pays for a shared fence?',a:'No. Confirm property and shared-owner arrangements separately. The quote identifies the physical work and access assumptions.'}],
    reading:['why-timber-gates-sag','why-timber-rot-returns']
  },
  'skirting-after-new-flooring': {
    title:'How should skirting be planned after new flooring?',category:'Interior finishes',owner:'skirting-and-architraves',
    metaDescription:'Plan skirting after new flooring by checking profile, thickness, floor levels and adjoining trim. Clarify removal, caulking and painting in the quote.',
    lead:'New flooring changes the wall-to-floor junction. Skirting needs to suit the finished level, the flooring detail and adjoining trim. Matching board height alone can leave a poor junction at door architraves or existing skirting.',
    faqs:[{q:'Should new skirting match only the old board height?',a:'No. Thickness and the shaped profile also affect the join to retained trim. Compare a sample or measured profile and agree the material and finish.'},{q:'Is painting included with skirting installation?',a:'Confirm it in the quote. Removal, supply, fitting, caulking, priming and final painting are separate inclusions to agree.'}],
    reading:['timber-door-sticks-after-rain','carpentry-jobs-before-selling']
  },
  'why-timber-gates-sag': {
    title:'Why does a timber gate sag or stop latching?',category:'Fences & gates',owner:'timber-gate-repairs',
    metaDescription:'Understand how posts, hinges, a gate frame and ground clearance affect sagging. Identify useful observations before a timber gate repair assessment.',
    lead:'A sagging gate can involve loose hinge fixings, a distorted gate frame or movement in the supporting post. The latch is often where the symptom appears. Adjusting it alone can leave the cause unresolved.',
    faqs:[{q:'Can moving the latch fix a sagging gate?',a:'It may allow temporary closure but will not restore a loose hinge fixing, distorted leaf or moving post. Identify the support problem before final latch alignment.'},{q:'Does a timber gate repair include its motor?',a:'Powered drives and electrical or access-control faults need their relevant qualified service. Confirm the timber, hardware and powered-system responsibilities separately.'}],
    reading:['leaning-paling-fence','why-timber-rot-returns']
  },
  'why-timber-rot-returns': {
    title:'Why does timber rot return after a repair?',category:'Timber care',owner:'rotten-timber-repairs',
    metaDescription:'Recurring timber rot can point to continuing moisture, hidden decay or a poor junction. Learn what needs checking before another patch or paint finish.',
    lead:'Timber rot can return when moisture keeps reaching the component, decay remains beyond the earlier repair or the replacement detail traps water. A new painted surface alone does not show that the cause and damaged material were addressed.',
    faqs:[{q:'Will filler and paint prevent recurring rot?',a:'They do not remove a continuing moisture source or establish sound supporting timber. The component condition and water path determine the repair.'},{q:'What should I keep from an earlier repair?',a:'Keep the quote, photographs, material and coating details and any leak or pest reports. They help compare what was repaired with the location of new damage.'}],
    reading:['rotten-window-sill','pergola-post-rot']
  },
  'cabinet-hinges-and-drawer-runners': {
    title:'Can one cupboard hinge or drawer runner be repaired?',category:'Cabinet repairs',owner:'cabinet-door-and-drawer-repairs',
    metaDescription:'One faulty cabinet door or drawer can have a local repair. Check hardware compatibility, panel condition and fixing points before replacing the fitting.',
    lead:'One faulty cupboard door or drawer does not automatically require new cabinetry. A local repair depends on compatible hardware and sound fixing points. Damaged panels may need replacement, and older fittings may need a compatible alternative.',
    faqs:[{q:'Should I order a runner with the same visible length?',a:'Length is only one compatibility check. Mounting arrangement, clearances, load and fixing locations also need to suit the existing drawer and cabinet.'},{q:'Does a pulled-out hinge mean the whole cabinet is finished?',a:'Not necessarily. The panel condition and available repair method determine whether a sound fixing can be restored locally or a panel needs replacement.'}],
    reading:['carpentry-jobs-before-selling','skirting-after-new-flooring']
  },
  'timber-weatherboard-damage': {
    title:'Can a few damaged timber weatherboards be replaced?',category:'Exterior timber',owner:'timber-weatherboard-repairs',
    metaDescription:'Local weatherboard replacement depends on the timber profile, overlap and condition behind the board. Learn what affects matching and repair extent.',
    lead:'Individual timber weatherboards may be replaced when suitable adjoining boards and backing can be retained. The board profile, overlap and water-entry detail determine more than the appearance of the repair.',
    faqs:[{q:'Can I match a board using only its face width?',a:'No. Thickness, edge profile and overlap also determine how it joins the wall. Measure the existing profile and confirm the proposed material.'},{q:'Does one cracked board mean the entire wall needs replacing?',a:'Not automatically. The damage pattern, adjoining boards, backing and water entry determine whether a local repair is suitable.'}],
    reading:['fascia-bargeboard-eaves','why-timber-rot-returns']
  },
  'loose-timber-stairs': {
    title:'What should you do about a loose timber stair or handrail?',category:'Stairs & handrails',owner:'timber-stair-and-handrail-repairs',
    metaDescription:'Loose timber steps and handrails need their supports checked. Learn what to record safely and why a new screw or cosmetic repair may be insufficient.',
    lead:'Stop relying on a loose timber tread or handrail and arrange an assessment of its supports and connections. Movement can come from the component, its fixing or the material holding it. A cosmetic repair does not establish that it is safe to use.',
    faqs:[{q:'Is it safe to test a loose step with extra weight?',a:'No. Do not add weight or keep moving it to test stability. Avoid the affected area and arrange assessment of the component and supports.'},{q:'Can a handrail problem be just a bracket?',a:'It can involve a bracket, but the joint and fixing substrate also matter. The retained fixing material must be suitable for the repair.'}],
    reading:['deck-boards-or-frame','pergola-post-rot'],sources:[approval]
  },
  'pergola-post-rot': {
    title:'Does a rotten pergola post need repair or replacement?',category:'Outdoor timber',owner:'pergola-timber-repairs',
    metaDescription:'A rotten pergola post affects connected supports. Learn why base condition, beams, footings and moisture need assessment before post repair or replacement.',
    lead:'A rotten pergola or verandah post must be assessed with the beams, connections and supports it carries. The post base may be the visible defect, but its supporting role determines whether a local repair, post replacement or wider work is appropriate.',
    faqs:[{q:'Can the post be replaced without checking the beams?',a:'The connected structure and load path need assessment first. A new post does not resolve damaged beams, connections or an unsuitable footing.'},{q:'Does a replacement post automatically avoid approval checks?',a:'No. Confirm the actual repair or alteration and applicable ACT requirements rather than assuming that every replacement has the same status.'}],
    reading:['why-timber-rot-returns','loose-timber-stairs'],sources:[approval]
  },
  'repair-or-rebuild-a-deck': {
    updated:'2026-10-12',
    title:'Should you repair an existing deck or rebuild it?',category:'Deck planning',owner:'deck-building',
    metaDescription:'Compare deck board repairs, frame repairs and rebuilding. Condition, retained supports and proposed layout guide the scope, quote and ACT checks.',
    lead:'Repair suits an existing deck when the affected components can be defined and suitable boards, supports and connections retained. Widespread connected damage or a changed layout can lead to rebuilding. The proportion of worn boards alone cannot decide between them.',
    options:[{option:'Local board repair',assessment:'Defined board damage with supports assessed as suitable for retention.',scope:'Specified boards, fixings, adjoining details and finish.'},{option:'Frame and connection repairs',assessment:'Defined supporting-member or connection damage with a suitable repair option.',scope:'Support components, safe sequence, inspection access and moisture source.'},{option:'Rebuild',assessment:'Connected defects or a changed layout requiring a new construction scope.',scope:'Removal, new deck system, materials, access and applicable ACT checks.'}],
    faqs:[{q:'Can new boards solve a damaged frame?',a:'No. Supporting timber and connections need assessment and repair where affected before board replacement is agreed.'},{q:'Can I decide from the percentage of damaged boards?',a:'No. Board count does not establish the condition of the supports, connections or retained timber. Compare the assessed repair options.'},{q:'What happens if more damage is found?',a:'The finding should be documented and explained. A written variation confirms added work, the pricing basis and scheduling effect before that work proceeds.'},{q:'Does a low deck automatically avoid approval checks?',a:'No. The actual repair, new construction or extension needs the applicable ACT building and planning checks.'}],
    reading:['deck-boards-or-frame','why-timber-rot-returns'],sources:[approval],
    relatedLinks:[{url:'/services/deck-repairs/',label:'Deck repair and board replacement'},{url:'/services/deck-building/',label:'New deck construction and extensions'},{url:'/contact/',label:'Ask Ellis about your deck'}]
  },
  'carpentry-jobs-before-selling': {
    title:'How should you prioritise carpentry repairs before selling?',category:'Interior carpentry',owner:'interior-carpentry',
    metaDescription:'Plan pre-sale carpentry repairs by separating safety, operation and finish. Group the task list, confirm access and compare itemised repair inclusions.',
    lead:'Start a pre-sale carpentry list with safety and operation, then consider visible finishing. List doors, trim and cupboard faults by room so necessary repairs can be separated from optional upgrades. The effect on sale price is uncertain.',
    faqs:[{q:'Can several repairs be assessed together?',a:'Provide one list with each item and location. The team can assess the requested tasks together and confirm the grouped scope, access and quote.'},{q:'Should every cupboard be replaced before a sale?',a:'A local hinge, runner or panel fault should be assessed before assuming full replacement. New cabinetry is a separate measured scope and decision.'}],
    reading:['cabinet-hinges-and-drawer-runners','skirting-after-new-flooring'],
    relatedLinks:[{url:'/services/small-carpentry-jobs/',label:'Group several small carpentry jobs'},{url:'/services/custom-joinery/',label:'Understand custom joinery and built-in storage'}]
  },
  ...gapGuides
};

export const editorialArticles = Object.entries(guideEditorial).map(([slug,item])=>{
  const completeBody=expandedGuideBodies[slug];
  const sources=[...new Map([...(item.sources||[]),...(completeBody||[]).flatMap(s=>s.sources.map(key=>guideSources[key]))].map(source=>[source[0],source])).values()];
  return {slug,...item,sections:completeBody?.map(s=>[s.heading,s.paragraphs.join(' ')])||item.sections,completeBody,sources,published:item.published||'2026-09-28',updated:completeBody?'2026-10-15':item.updated||'2026-10-10'};
});
