import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {getCatalog} from '../admin/catalog.mts';
import {writeManaged} from '../admin/render.mts';
import {validateSite} from '../admin/validate.mts';
import type {State} from '../admin/model.mts';
/** Customer-reviewed bilingual copy, approved for release on 21 October 2026. */
export function applyCustomerCopyRelease(out:string,root:string):void {
const candidate=JSON.parse(readFileSync(join(root,'content/customer-first-copy-release.json'),'utf8')) as State;
const routes=[...readFileSync(join(out,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]!).pathname);
const catalog=getCatalog(out);
writeManaged(out,catalog,candidate,'release');
const pages=new Map<string,string>();
for(const route of routes){
 const file=join(out,route.slice(1),'index.html');let html=readFileSync(file,'utf8');
 const language=route.startsWith('/zh/')?'zh':'en',map=new Map<string,string>();
 for(const[id,edit]of Object.entries(candidate.edits))if(catalog.fields[id]!.occurrences.some(o=>route===(language==='zh'?'/zh':'')+o.route))map.set(language==='zh'?edit.originalZh:edit.originalEn,edit[language]);
 const update=(value:any):any=>typeof value==='string'?map.get(value)??value:Array.isArray(value)?value.map(update):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,update(v)])):value;
 // FAQ acceptedAnswer.text is also prose: keep it equivalent to the visible FAQ.
 html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(_,a,b,c)=>a+JSON.stringify(update(JSON.parse(b))).replaceAll('<','\\u003c')+c);
 writeFileSync(file,html);pages.set(route,html);
}
const runtime=[
 ['site.js','Thanks — your enquiry has been sent. We will be in touch soon.','Thanks — your enquiry has been sent. Our team will contact you to discuss the work. An appointment still needs to be confirmed.'],
 ['site-zh.js','感谢您的咨询，信息已提交。我们会与您联系。','感谢您的咨询，信息已提交。团队会与您沟通施工需求，预约仍需双方确认。']
];
for(const[name,before,after]of runtime){const file=join(out,'assets',name!),beforeScript=readFileSync(file,'utf8');if(!beforeScript.includes(before!))throw Error('Runtime message changed: '+name);writeFileSync(file,beforeScript.replace(before!,after!));}
validateSite(out,pages);

}
