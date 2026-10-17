import type {TemplateData,FeedNode,FeedItem,Service,FAQ,Article} from './types.mjs';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {bilingualPages,translationSources,localePath} from './localization.mjs';
import {buildKnowledgeFeeds} from './chinese-feed.mjs';

// Runs after the unchanged English builder and its original article feed.
export function addChineseInterface({out,origin,routes}:{out:string;origin:string;routes:string[]}){
  const originals=new Map([...routes,'/404/'].map(route=>[route,readFileSync(join(out,route.slice(1),'index.html'),'utf8')]));
  if(process.argv.includes('--translations-inventory')){
    process.stdout.write(JSON.stringify(translationSources(originals)));return;
  }
  const catalog=JSON.parse(readFileSync(new URL('./locales/zh-Hans.json',import.meta.url),'utf8'));
  const localized=bilingualPages(originals,catalog,{origin});
  // English embedded JSON remains byte-for-byte intact. Chinese feed is
  // independently extracted from the corresponding translated article prose.
  for(const [route,html] of localized){
    if(route.startsWith('/zh/'))localized.set(route,html.replace(/<script id="llm-knowledge-feed" type="application\/json">[\s\S]*?<\/script>/g,'').replace(/<link rel="alternate" type="application\/feed\+json"[^>]*>/g,''));
  }
  const chinese=buildKnowledgeFeeds(localized,{name:'Ellis Services Group',prefix:'/zh',language:'zh-Hans'});
  for(const[route,html]of chinese.pages){
    const path=join(out,route.slice(1),'index.html');mkdirSync(dirname(path),{recursive:true});writeFileSync(path,html);
  }
  mkdirSync(join(out,'zh','feeds'),{recursive:true});
  writeFileSync(join(out,'zh','feeds','llm-knowledge.json'),JSON.stringify(chinese.feed,null,2)+'\n');
  const sitemap=join(out,'sitemap.xml');
  writeFileSync(sitemap,readFileSync(sitemap,'utf8').replace('</urlset>',routes.map((route: any)=>`<url><loc>${origin+localePath(route)}</loc></url>`).join('')+'</urlset>'));
  // Preserve every English runtime byte; localize a separate Chinese copy.
  let runtime=readFileSync(join(out,'assets','site.js'),'utf8');
  const messages={
    'No photos selected':'未选择照片',
    'Sending enquiry…':'正在提交…',
    'Sending your enquiry…':'正在提交您的咨询…',
    'We could not send your enquiry.':'暂时无法提交咨询。',
    'Thanks — your enquiry has been sent. We will be in touch soon.':'感谢您的咨询，信息已提交。我们会与您联系。',
    'We could not send your enquiry. Please call 0405 878 406.':'暂时无法提交咨询，请致电 0405 878 406。'
  };
  for(const[en,zh]of Object.entries(messages))runtime=runtime.replaceAll(JSON.stringify(en),JSON.stringify(zh)).replaceAll("'"+en+"'",JSON.stringify(zh));
  runtime=runtime.replace("`${count} photo${count===1?'':'s'} selected`",'`已选择 ${count} 张照片`').replace('`Showing ${current+1} of ${slides.length} work photos`','`施工照片 ${current+1} / ${slides.length}`').replace("throw new Error(result.error||",'throw new Error(({"Please provide your name, a valid email address and a description of the work.":"请填写姓名、有效邮箱和施工需求。","The enquiry service is not configured yet. Please call 0405 878 406.":"在线咨询服务暂不可用，请致电 0405 878 406。","We could not send your enquiry. Please call 0405 878 406.":"暂时无法提交咨询，请致电 0405 878 406。"}[result.error])||');
  writeFileSync(join(out,'assets','site-zh.js'),runtime);
  console.log(`Added ${routes.length} Chinese pages from the restored English version.`);
}
