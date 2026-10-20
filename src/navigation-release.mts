import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {navigationMap,validateMap,applyNavigation} from './navigation-paths.mts';
import {removeThirdPartyLinks} from './customer-links.mts';
import {buildKnowledgeFeeds} from './chinese-feed.mts';
import {validateSite} from '../admin/validate.mts';
export function applyNavigationRelease(out:string):void{
 const errors=validateMap(navigationMap);if(errors.length)throw Error(errors.join('\n'));
 const pages=new Map(navigationMap.map(row=>[row.url,removeThirdPartyLinks(applyNavigation(row.url,readFileSync(join(out,row.url.slice(1),'index.html'),'utf8')))]));
 const en=buildKnowledgeFeeds(pages,{name:'Ellis Services Group'}),zh=buildKnowledgeFeeds(en.pages,{name:'Ellis Services Group',prefix:'/zh',language:'zh-Hans'});
 const block=/<script id="llm-knowledge-feed" type="application\/json">[\s\S]*?<\/script>/;
 for(const[url,html]of pages){const feed=zh.pages.get(url)?.match(block)?.[0];const final=feed?html.replace(block,()=>feed):html;pages.set(url,final);writeFileSync(join(out,url.slice(1),'index.html'),final);}
 for(const[prefix,feed]of [['',en.feed],['zh/',zh.feed]]as const)writeFileSync(join(out,prefix,'feeds/llm-knowledge.json'),JSON.stringify(feed,null,2)+'\n');
 validateSite(out,pages);
 console.log('Applied approved bilingual navigation and customer link policy to '+pages.size+' pages.');
}
