import {readFileSync,writeFileSync,cpSync} from 'node:fs';
import {join} from 'node:path';
import {parse,type DefaultTreeAdapterMap} from 'parse5';
import {getCatalog} from '../admin/catalog.mts';
import {writeManaged} from '../admin/render.mts';
import {validateSite} from '../admin/validate.mts';
import {buildKnowledgeFeeds} from '../src/chinese-feed.mjs';
import type {State} from '../admin/model.mts';
import {simplifyServicesHub} from './services-hub-candidate.mts';
type Node=DefaultTreeAdapterMap['node'];
type Element=DefaultTreeAdapterMap['element'];

export function applyCustomerVoiceRelease(out:string,root:string):void{
const catalog=getCatalog(out),state:State={schemaVersion:1,version:1,edits:{},history:[]};
const replacements=[
 ['Look for relevant timber repair experience and suitable skills for the task',
  'We repair timber doors, trim, cupboard fittings and other small carpentry items. Tell us your task list and suburb. We will arrange a visit, check the affected components and give you a clear repair plan and quote.',
  '我们承接木门、收边线条、橱柜配件及其他小型木作维修。告诉我们项目清单和所在城区，我们会安排上门，检查需要处理的部件，为您提供清楚的维修方案和报价。'],
 ['A timber quote should identify relevant specialist responsibilities',
  'We set out the carpentry work, materials and finishing in your quote. Where glazing, locks, electrical, plumbing or other specialist work is involved, we explain how it fits into the work sequence before scheduling.',
  '我们会在报价中说明木作施工、材料和收尾内容。涉及玻璃、门锁、电气、管道或其他专业配合时，会在安排施工前与您说明衔接和施工顺序。'],
 ['Request current documents relevant to the accepted scope',
  'You can discuss the proposed work directly with our team. We confirm the agreed inclusions, price and next steps with you before work begins.',
  '您可以直接与我们的团队沟通施工需求。开工前，我们会与您确认约定内容、价格和下一步安排。']
];
for(const f of Object.values(catalog.fields)){
 if(f.shared||f.kind!=='text')continue;
 const rule=replacements.find(([needle])=>f.en.includes(needle!));if(!rule)continue;
 state.edits[f.id]={originalEn:f.en,originalZh:f.zh,en:rule[1]!,zh:rule[2]!,enRevision:1,zhRevision:1};
}
if(Object.keys(state.edits).length!==4)throw Error('Unexpected voice-edit match count');
writeManaged(out,catalog,state,'release');
const question='What qualifications, insurance and licences should I check for my carpentry project?';
const zhQuestion='我应该为我的木工项目检查哪些资格、保险和许可证？';
const removalText=[
 'Confirm the qualifications, applicable licence requirements and insurance for the people carrying out the agreed work.',
 '确认执行约定工作的人员的资格、适用的许可证要求和保险。',
 'Use the company details below and the official ABN link to check the business handling your enquiry.',
 '下方列有公司资料及官方 ABN 登记链接，方便您查询和了解承接咨询的 Ellis 团队。'
];
const text=(n:Node):string=>n.nodeName==='#text'&&'value'in n?n.value:'childNodes'in n?n.childNodes.map(text).join(''):'';
let removedBlocks=0;const changedRoutes:string[]=[];
for(const route of ['/about/','/zh/about/','/faq/','/zh/faq/','/services/small-carpentry-jobs/','/zh/services/small-carpentry-jobs/']){
 const path=join(out,route.slice(1),'index.html');let html=readFileSync(path,'utf8');const doc=parse(html,{sourceCodeLocationInfo:true}),remove:Element[]=[];
 function visit(n:Node){if('tagName'in n){const value=text(n).trim();if((['aside','p'].includes(n.tagName)&&removalText.some(s=>value.startsWith(s)))||(n.tagName==='details'&&(value.includes(question)||value.includes(zhQuestion)))){remove.push(n);return;}}if('childNodes'in n)for(const c of n.childNodes)visit(c);}
 visit(doc);for(const n of remove.sort((a,b)=>b.sourceCodeLocation!.startOffset-a.sourceCodeLocation!.startOffset)){const l=n.sourceCodeLocation!;html=html.slice(0,l.startOffset)+html.slice(l.endOffset);removedBlocks++;}
 const filter=(v:unknown):unknown=>Array.isArray(v)?v.filter(x=>!(x&&typeof x==='object'&&'name'in x&&[question,zhQuestion].includes(String(x.name)))).map(filter):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,filter(x)])):v;
 html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(_,a,b,c)=>a+JSON.stringify(filter(JSON.parse(b))).replaceAll('<','\\u003c')+c);
 writeFileSync(path,html);if(remove.length)changedRoutes.push(route);
}
if(removedBlocks!==8)throw Error('Expected two About blocks per language and one FAQ per language in two places; got '+removedBlocks);
for(const route of ['/services/','/zh/services/']){
 const file=join(out,route.slice(1),'index.html');const html=simplifyServicesHub(route,readFileSync(file,'utf8'));
 if((html.match(/class="index-card"/g)||[]).length!==18)throw Error('Service hub must have 18 main cards');
 if((html.match(/<article>/g)||[]).length!==3)throw Error('Three additional services must remain');
 writeFileSync(file,html);
}
const routes=[...readFileSync(join(out,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]!).pathname);
const original=new Map(routes.map(route=>[route,readFileSync(join(out,route.slice(1),'index.html'),'utf8')]));
const en=buildKnowledgeFeeds(original,{name:'Ellis Services Group'}),zh=buildKnowledgeFeeds(en.pages,{name:'Ellis Services Group',prefix:'/zh',language:'zh-Hans'});
const block=/<script id="llm-knowledge-feed" type="application\/json">[\s\S]*?<\/script>/;
const final=new Map<string,string>();for(const[route,html]of original){const feed=zh.pages.get(route)?.match(block)?.[0];const result=feed?html.replace(block,()=>feed):html;writeFileSync(join(out,route.slice(1),'index.html'),result);final.set(route,result);}
for(const[prefix,feed]of [['',en.feed],['zh/',zh.feed]] as const)writeFileSync(join(out,prefix,'feeds/llm-knowledge.json'),JSON.stringify(feed,null,2)+'\n');
validateSite(out,final);
for(const[route,html]of final)if(/Confirm the qualifications, applicable licence requirements|Ask Ellis for the qualifications|Check qualifications and licences where|This article does not assert a universal licence category/.test(html))throw Error('Removed copy remains: '+route);
console.log(JSON.stringify({checkedPages:routes.length,rewrittenBilingualFields:Object.keys(state.edits).length,removedBlocks,changedRoutes,productionApplied:true},null,2));

}
