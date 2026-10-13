import { oldPhotos } from './image-delivery.mjs';

const existingPhoto=src=>oldPhotos.find(photo=>photo.src===`/assets/${src}.webp`);
const illustration=(src,alt,context)=>{
  const photo=existingPhoto(src);
  return {src:photo.src,width:photo.width,height:photo.height,alt,caption:`Illustrative detail: ${context} This existing service image is not a documented project record.`};
};

// Shared by final head metadata and visible guide figures. Keys are full routes.
// Legacy illustrations deliberately carry no client, suburb or completion date.
export const editorialMedia={
  '/news/timber-door-sticks-after-rain/':illustration('door-hinge-frame-detail-canberra','Close view of a timber door hinge and the adjoining painted frame','the hinge and frame are among the areas checked when a timber door sticks.'),
  '/news/deck-boards-or-frame/':illustration('under-deck-timber-assessment','Inspection of timber bearers, joists and connections below a deck','the supports beneath the boards require a separate assessment from the walking surface.'),
  '/news/rotten-window-sill/':illustration('deteriorated-timber-frame-before','Decayed timber and peeling paint at a window sill and lower frame','damage at the sill-to-frame junction helps explain why the extent and moisture source need checking.'),
  '/news/fascia-bargeboard-eaves/':illustration('fascia-eaves-repair-process','Carpenter examining deteriorated painted timber at the roof edge','roof-edge timber and the adjacent eaves form different parts of the repair scope.'),
  '/news/leaning-paling-fence/':illustration('timber-fence-before-repair','Leaning timber paling fence with weathered rails and damaged lower boards','posts, rails and palings are assessed together when a fence leans.'),
  '/news/skirting-after-new-flooring/':illustration('skirting-architrave-detail-canberra','White skirting and door architrave beside a timber floor transition','the trim profile and floor junction need to be considered together.'),
  '/news/why-timber-gates-sag/':illustration('fence-gate-hardware-detail-canberra','Timber gate hinge, latch and adjoining support post','hinges, latch alignment and the support post are checked as one gate assembly.'),
  '/news/why-timber-rot-returns/':illustration('deteriorated-timber-frame-before','Deteriorated painted timber at a window sill and frame junction','visible decay illustrates the need to investigate the water path as well as the affected timber.'),
  '/news/cabinet-hinges-and-drawer-runners/':illustration('cabinet-hardware-detail-canberra','Cabinet door hinge and its fixing points inside a cupboard','hinge compatibility and sound fixing material matter when planning a local hardware repair.'),
  '/news/timber-weatherboard-damage/':illustration('weatherboard-window-detail-canberra','Painted weatherboards meeting a window sill and exterior trim','board laps and adjoining openings affect how a local replacement is scoped.'),
  '/news/loose-timber-stairs/':illustration('handrail-stair-detail-canberra','Timber stair treads and a handrail bracket fixed to the wall','stair supports and handrail anchorage need assessment when movement is reported.'),
  '/news/pergola-post-rot/':illustration('pergola-post-base-repair','Renewed lower timber section at an outdoor post base','the lower post and surrounding junctions are considered when planning a post repair.'),
  '/news/repair-or-rebuild-a-deck/':illustration('under-deck-timber-assessment','Timber deck bearers and joists being examined from below','the condition of supports and connections informs a repair-or-rebuild decision.'),
  '/news/carpentry-jobs-before-selling/':illustration('measuring-timber-work-canberra','Carpenter measuring an upright timber member beside a workbench','measuring and defining each task helps prioritise a list of carpentry repairs.'),
  '/news/carpentry-quote-cost-factors/':illustration('measuring-timber-work-canberra','Carpenter using a tape measure on an upright timber member','dimensions, access and the extent of work contribute to a measured quote.'),
  '/news/timber-vs-composite-decking-canberra/':{
    src:'/assets/projects/mitchell-composite-deck-completed.webp',width:1448,height:1086,
    alt:'Completed grey composite deck beside the home in Mitchell',
    caption:'Confirmed Ellis project: the completed composite deck in Mitchell, August 2025. This photograph shows the installed surface; it is not a performance comparison between materials.',
    projectHref:'/projects/mitchell-composite-deck/',
  },
  '/news/timber-deck-maintenance-canberra/':{
    src:'/assets/projects/melba-deck-oiled.webp',width:1448,height:1086,
    alt:'Timber deck surface after the recorded repairs, cleaning and oiling in Melba',
    caption:'Confirmed Ellis project: the Melba timber deck following repairs, cleaning and oiling in May 2025. The surface photograph does not establish the condition of concealed supports.',
    projectHref:'/projects/melba-deck-care/',
  },
};
