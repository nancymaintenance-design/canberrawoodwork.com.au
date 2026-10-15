// Three decision-led additions. Product links are evidence, not endorsements or
// a promise that Ellis supplies or installs every material discussed.
const timberGuide=['https://www.woodsolutions.com.au/sites/default/files/2025-10/WS%20TDG%2021%20-%20Domestic%20Timber%20Deck%20Design.pdf','WoodSolutions: Domestic Timber Deck Design — maintenance guidance'];
const compositeGuide=['https://www.modwood.com.au/technical-documentation/','ModWood: product-specific installation and care documents'];
const heatGuide=['https://www.trex.com/deck-ideas/composite-decking-myths/','Trex: composite decking care and surface-heat qualifications'];
const quoteRoute='/news/carpentry-quote-cost-factors/';
const materialsRoute='/news/timber-vs-composite-decking-canberra/';
const careRoute='/news/timber-deck-maintenance-canberra/';

export const gapGuides={
  'carpentry-quote-cost-factors':{
    title:'Carpentry Quotes: What Affects the Cost?',category:'Booking & quotes',owner:'small-carpentry-jobs',
    published:'2026-10-12',updated:'2026-10-12',
    metaDescription:'Compare carpentry quotes by labour, materials, access, finishing and visit charges. Understand hourly-rate questions without assuming a standard price.',
    lead:'A carpentry quote depends on the work, the condition of the timber and what is included. An hourly rate alone does not describe the cost of a completed repair. Compare materials, removal, access and the finished result on the same basis before accepting a price.',
    faqs:[
      {q:'Can I get the final repair price from a photograph?',a:'A safe photo can help explain the request, but it does not establish concealed timber condition, fixing access or the complete repair extent. Ellis confirms the proposed work and quote after assessment.'},
      {q:'Does an enquiry include a free visit?',a:'Do not assume that it does. Ask the team to confirm any assessment, call-out or minimum booking charge before accepting the appointment.'},
      {q:'What should I send for several small jobs?',a:'Send one task per line, the room or outdoor location, your suburb and access details. Optional safe photos can be emailed separately; a clear description is enough to start the enquiry.'}
    ],
    reading:['carpentry-jobs-before-selling','repair-or-rebuild-a-deck'],
    relatedLinks:[{url:'/services/small-carpentry-jobs/',label:'Arrange several small carpentry tasks'},{url:'/services/deck-building/',label:'Define a new deck or extension quote'},{url:'/services/',label:'Choose the carpentry service for your work'},{url:'/contact/',label:'Discuss your quote enquiry'}]
  },
  'timber-vs-composite-decking-canberra':{
    title:'Timber vs Composite Decking: What to Compare',category:'Deck materials',owner:'deck-building',
    published:'2026-10-12',updated:'2026-10-13',
    metaDescription:'Compare timber and composite decking for a Canberra project: care, surface heat, product instructions and quote inclusions, without assuming one material suits every site.',
    lead:'Timber and composite decking should be compared as specified products, not just two labels. For your project, consider the proposed finish, care requirements, sun exposure, installation system and complete construction scope. Material choice does not establish whether an existing deck frame can be retained.',
    comparison:{caption:'Timber and composite product specifications',columns:['Decision','Timber proposal','Composite proposal'],rows:[
      ['Identity','Record the timber species, dimensions and finish.','Record the manufacturer, range and board system.'],
      ['Care','Check the selected coating and timber-care instructions.','Check product-specific cleaning and care instructions; do not assume no maintenance.'],
      ['Sun exposure','Discuss the exposed location and intended use.','Check the exact range and heat qualifications; composite can still become hot.'],
      ['Existing frame','Assess supports and connections before retaining them.','Assess supports and confirm compatibility with the specified board system.'],
      ['Price comparison','Include supply, framing work, finishing and access.','Include the complete specified system and installation arrangements.']
    ]},
    sources:[timberGuide,compositeGuide,heatGuide],
    faqs:[{q:'Is composite decking maintenance-free?',a:'Do not assume that it is. Use the care instructions for the exact product, and keep cleaning requirements separate from assessment of supports and connections.'},{q:'Can composite boards be fitted to my existing timber frame?',a:'That cannot be decided from the board type alone. The existing frame needs assessment and the proposed system’s support and fixing requirements need confirmation before retention is agreed.'},{q:'Does Ellis offer every decking material described here?',a:'Ellis installs timber and composite decks. Ask about the exact board product you are considering and agree supply, compatible fixings and installation details before ordering.'}],
    reading:['repair-or-rebuild-a-deck','timber-deck-maintenance-canberra'],
    relatedLinks:[{url:'/services/deck-building/',label:'Plan a new timber deck or extension'},{url:'/services/deck-repairs/',label:'Assess an existing deck before changing boards'},{url:quoteRoute,label:'Compare the inclusions in a carpentry quote'},{url:'/services/',label:'Explore the carpentry service directory'}]
  },
  'timber-deck-maintenance-canberra':{
    title:'Timber Deck Maintenance: Care or Repair?',category:'Deck care',owner:'deck-repairs',
    published:'2026-10-12',updated:'2026-10-13',
    metaDescription:'Plan timber deck maintenance. Separate cleaning and coating care from loose boards, damaged supports and repair decisions before booking work.',
    lead:'Timber deck maintenance and deck repair are different decisions. Cleaning and renewing a finish concern the surface; loose boards, movement or deteriorated supports need assessment. For your deck, start with safe observations and the care information for the timber and coating already in place.',
    sources:[timberGuide],
    faqs:[{q:'How often should my timber deck be oiled?',a:'Use the guidance for the actual coating, timber and exposure rather than a universal interval. Identify the existing finish before selecting a care product or agreeing a recoating scope.'},{q:'Can a new finish make a loose deck safe?',a:'No. Coating work does not establish the condition of supporting timber or connections. Avoid the unsafe area and arrange assessment of the movement or damage.'},{q:'Does a deck repair quote automatically include sanding and oiling?',a:'No. The quote must identify any preparation, coating products and areas included. Ask Ellis to confirm the finishing scope; it is separate from deciding which timber needs repair.'}],
    reading:['deck-boards-or-frame','timber-vs-composite-decking-canberra'],
    relatedLinks:[{url:'/services/deck-repairs/',label:'Arrange deck board and support assessment'},{url:'/news/repair-or-rebuild-a-deck/',label:'Compare repair with rebuilding an existing deck'},{url:quoteRoute,label:'Understand the scope behind a carpentry quote'},{url:materialsRoute,label:'Compare timber and composite material decisions'},{url:'/services/',label:'Find the relevant carpentry service'}]
  }
};
