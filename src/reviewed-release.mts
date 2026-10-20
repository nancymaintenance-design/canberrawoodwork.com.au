import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {getCatalog} from '../admin/catalog.mts';
import {writeManaged} from '../admin/render.mts';
import type {State} from '../admin/model.mts';
import {alignServiceDetail} from './service-layout-candidate.mts';
import {updateContactLayout} from './contact-layout-candidate.mts';
import {removeTeamPhoto} from './team-gallery-candidate.mts';

/** The bilingual candidate explicitly approved for production on 20 October 2026. */
export function applyReviewedRelease(out:string,root:string):void{
 const release=JSON.parse(readFileSync(join(root,'content/reviewed-2026-10-20.json'),'utf8')) as {stages:State[]};
 for(const state of release.stages)writeManaged(out,getCatalog(out),state,'release');
 const routes=[...readFileSync(join(out,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]!).pathname);
 for(const route of routes){
  const file=join(out,route.slice(1),'index.html'),before=readFileSync(file,'utf8');
  const after=removeTeamPhoto(updateContactLayout(route,alignServiceDetail(route,before)));
  if(after!==before)writeFileSync(file,after);
 }
}
