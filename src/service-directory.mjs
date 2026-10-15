import { services } from './content.mjs';
import { confirmedServices } from './verified-projects.mjs';

// Discovery metadata only: legacy repair pages and confirmed installation pages
// keep their own detailed content, while every directory consumes this list.
export const serviceDirectory=[...services,...confirmedServices].map(({slug,title,intro})=>({slug,title,intro}));
const groups=[
  {id:'doors-and-windows',title:'Doors & windows',description:'Timber doors, frames, windows and sills.',image:'door-and-frame-repairs',slugs:['door-and-frame-repairs','timber-window-repairs']},
  {id:'decks-and-outdoor-timber',title:'Decks & outdoor timber',description:'New decks, repairs, surface care, fences, gates and pergolas.',image:'deck-repairs',slugs:['deck-repairs','deck-building','composite-decking','deck-cleaning-and-oiling','timber-fence-repairs','timber-gate-repairs','pergola-timber-repairs']},
  {id:'timber-repairs-and-small-jobs',title:'Timber repairs & small jobs',description:'Local repairs, exterior boards, stairs and supporting timber.',image:'rotten-timber-repairs',slugs:['small-carpentry-jobs','rotten-timber-repairs','fascia-and-eaves-repairs','timber-weatherboard-repairs','timber-stair-and-handrail-repairs','structural-timber-repairs']},
  {id:'interiors-and-storage',title:'Interiors & storage',description:'Interior finishing, existing cabinet repairs and fitted storage.',image:'skirting-and-architraves',slugs:['skirting-and-architraves','cabinet-door-and-drawer-repairs','interior-carpentry','custom-joinery','built-in-wardrobes','under-stair-storage']},
];
export const serviceGroups=groups.map(group=>({...group,services:group.slugs.map(slug=>{
  const service=serviceDirectory.find(item=>item.slug===slug);
  if(!service)throw Error(`Unknown directory service: ${slug}`);
  return service;
})}));
if(new Set(groups.flatMap(group=>group.slugs)).size!==serviceDirectory.length||groups.reduce((n,group)=>n+group.slugs.length,0)!==serviceDirectory.length)throw Error('Every service must belong to exactly one directory group');
