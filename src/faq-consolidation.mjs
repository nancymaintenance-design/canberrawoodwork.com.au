// Explicit editorial merges: retain distinct advice, not repeated keyword variants.
export const faqMerges = [
  {
    owner:'small-carpentry-jobs',
    questions:['Do you take on small carpentry jobs in Canberra?','Who takes on small carpentry jobs in Canberra?','Should I hire a carpenter or a handyman for a small timber repair?'],
    answer:'Yes. Ellis Services Group handles small Canberra carpentry jobs, including timber doors, trim, cupboard fittings and local timber repairs. Contact us with your task list and suburb; optional photos help us prepare. We assess the components and access, confirm the carpentry and qualified work needed, and provide one clear repair plan and quote.'
  },
  {
    owner:'small-carpentry-jobs',
    questions:['Can several small repairs be quoted together?','Can a carpenter quote for several small repairs in one visit?'],
    answer:'Yes. Describe each repair and send optional safe photos. We assess the listed tasks together and itemise the agreed work. The appointment plan accounts for access, materials and the time needed for each task.'
  },
  {
    owner:'small-carpentry-jobs',
    questions:['How is a carpentry repair quote prepared?','Can you provide an itemised carpentry quote including materials and rubbish removal?','What should be included in a carpentry repair quote?'],
    title:'How is your itemised carpentry repair quote prepared?',
    answer:'We inspect the affected components and prepare a written quote identifying the repair extent, retained and replaced parts, labour, supplied materials, access, removal and waste disposal, finishing, price and agreed project requirements. Additional findings are documented, and changes are agreed with you before extra work proceeds.'
  },
  {
    owner:'small-carpentry-jobs',
    questions:['Can I send photos before booking?','Can I send photos before booking a carpenter?'],
    answer:'Yes. Email optional safe photos to brian@elliservices.com.au before booking. You can also contact Ellis with a description alone; our team checks the timber and cause on site and confirms the repair plan and quote.'
  },
  {
    owner:'door-and-frame-repairs',
    questions:['Can a timber door be adjusted after new flooring?','Can you trim a door after new flooring has been installed?'],
    answer:'Yes. We check the finished floor level, door construction, permitted trimming allowance and required clearance before specifying the adjustment. Your quote includes the suitable trimming and edge finishing for the door.'
  },
  {
    owner:'door-and-frame-repairs',
    questions:['Should I call a carpenter or locksmith if a door will not latch?','Can Ellis Services Group repair a door that will not latch?'],
    title:'Can Ellis Services Group repair a door that will not latch?',
    answer:'Yes. Contact Ellis for an on-site assessment. We check door movement, hinge support, the timber frame, strike and latch, identify the fault and confirm the timber repair and any qualified hardware service arrangements in your work plan and quote.'
  },
  {
    owner:'deck-repairs',
    questions:['Can deck boards be replaced without rebuilding the frame?','Can you replace a few rotten deck boards rather than the whole deck?'],
    answer:'We inspect the damaged boards and supporting joists, bearers, posts and fixings together. The quote specifies individual board replacement where the retained support is sound, or the support repairs needed first, rather than treating every damaged board as a full rebuild.'
  },
  {
    owner:'deck-repairs',
    questions:['Do I need deck repairs or just sanding and oiling?','What signs suggest a deck needs more than sanding and oiling?'],
    answer:'Sanding and oiling renew the surface finish; loose or damaged boards, movement, soft supports and failing connections need repair. Ellis checks the walking surface and frame and specifies the repairs before the finishing stage.'
  },
  {
    owner:'deck-repairs',
    questions:['Can you match the existing timber on my deck?','Can new deck boards match the appearance of old timber?'],
    answer:'We compare the existing timber dimensions, profile and finish with available materials and finish samples. Existing weathering affects the appearance of a match, so you approve the proposed timber and finishing approach before replacement boards are ordered.'
  },
  {
    owner:'timber-fence-repairs',
    questions:['Should a leaning timber fence be repaired or replaced?','Can a leaning timber fence be repaired without replacing it all?','Is it better to repair a leaning fence or replace it?'],
    answer:'Ellis checks the posts, rails, palings, fixings and affected fence length on site. We compare local support repairs with replacement and identify sound sections to retain. Your quote explains the support work, materials and access included in each option so you can choose the scope.'
  },
  {
    owner:'timber-window-repairs',
    questions:['Can a rotten timber window sill be repaired locally?','Can a rotten timber window sill be repaired instead of replacing the window?'],
    answer:'We inspect the sill, adjoining frame and surrounding timber, trace the moisture source and define the damaged area. Your quote identifies local timber replacement and any wider window repairs needed to reach sound material. Contact Ellis for your Canberra assessment and repair quote.'
  },
  {
    owner:'timber-weatherboard-repairs',
    questions:['Can you replace a few damaged weatherboards and match the existing profile?','Can damaged weatherboards be replaced individually?'],
    answer:'Yes. Ellis measures the board profile and lap and checks surrounding timber, fixings and water entry. Your quote identifies the individual board lengths to replace, the proposed matching profile, backing checks and finish.'
  },
  {
    owner:'structural-timber-repairs',
    questions:['Can you quote for timber repairs after the termites have been treated?','Who should assess timber damage after termite treatment?'],
    answer:'Yes. Share the completed termite-treatment report and existing pest records if available. Ellis assesses the affected timber and supports, arranges the required qualified structural checks, and confirms sound retained components, replacement requirements and the repair quote.'
  },
  {
    owner:'fascia-and-eaves-repairs',
    questions:['Can you check the old eaves lining before quoting for replacement?','What should be checked before disturbing old eaves lining in the ACT?'],
    title:'How do you assess old eaves lining before replacement?',
    answer:'We identify the lining material, check its condition and plan safe access before quoting. Suspected asbestos is assessed through the qualified pathway before disturbance. Material handling and replacement are defined in the work plan; do not cut or sample unknown lining yourself.'
  },
  {
    owner:'pergola-timber-repairs',
    questions:['Can a rotten pergola post be replaced without rebuilding the whole structure?','Can a pergola post be replaced without checking the beams and connections?'],
    answer:'We assess the pergola post together with its beams, connections, supports and load path before disturbance. Your repair plan defines safe temporary support, sound components to retain, replacement timber and the required structural or approval checks before the post is removed.'
  },
  {
    owner:'timber-gate-repairs',
    questions:['What usually causes a timber gate to sag?','Can hinge adjustment solve every gate alignment problem?'],
    title:'How do you repair a sagging or misaligned timber gate?',
    answer:'Ellis checks the whole gate assembly, including the post, footing, hinges, fixings, frame, latch and clearance. A moving post, loose hinge or distorted frame needs a cause-based repair, not hinge adjustment alone. We confirm the support, hardware or alignment work in your quote.'
  },
  {
    owner:'rotten-timber-repairs',
    questions:['Why does repaired timber sometimes rot again?','Who checks why timber keeps rotting before repairing it?'],
    title:'How do you address the cause of recurring timber rot?',
    answer:'Ellis checks recurring wetting, joints, coatings and nearby water paths on site. Moisture that continues to reach timber can cause repeat damage, so we identify the cause and include the timber repair and associated moisture-source work in your repair plan and quote.'
  }
];

export const canonicalFaqQuestion = question => {
  const merge = faqMerges.find(item=>item.questions.includes(question));
  return merge ? merge.title || merge.questions[0] : question;
};

export function consolidateFaqs(items) {
  const used = new Set();
  return items.flatMap(item=>{
    const merge = faqMerges.find(group=>group.owner===item.owner && group.questions.includes(item.q));
    if (!merge) return [{...item}];
    if (used.has(merge)) return [];
    // Fail loudly if a source question is renamed: never silently discard advice.
    for (const question of merge.questions) {
      if (!items.some(source=>source.owner===merge.owner && source.q===question))
        throw new Error(`Missing FAQ merge source: ${question}`);
    }
    used.add(merge);
    return [{...item,q:merge.title || merge.questions[0],a:merge.answer}];
  });
}
