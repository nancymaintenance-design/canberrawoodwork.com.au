import {readFileSync,writeFileSync,copyFileSync} from 'node:fs';
import {join} from 'node:path';
import {navigationMap} from './navigation-paths.mts';
import {applyServiceIntent} from './service-intent-candidate.mts';
import {validateSite} from '../admin/validate.mts';
export function applyServiceIntentRelease(out:string):void{
 const pages=new Map(navigationMap.map(row=>[row.url,applyServiceIntent(row.url,readFileSync(join(out,row.url.slice(1),'index.html'),'utf8'))]));
 copyFileSync(new URL('../content/service-intent-candidate.css',import.meta.url),join(out,'assets/service-intent-candidate.css'));
 for(const[url,html]of pages)writeFileSync(join(out,url.slice(1),'index.html'),html);
 validateSite(out,pages);
 console.log('Applied approved service intent navigation to six bilingual pages.');
}
