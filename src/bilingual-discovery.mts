import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {parse} from 'parse5';

const origin='https://www.canberrawoodwork.com.au';
type Node={nodeName:string;value?:string;attrs?:{name:string;value:string}[];childNodes?:Node[]};
const attr=(n:Node,key:string)=>n.attrs?.find(a=>a.name===key)?.value;
const all=(n:Node,test:(n:Node)=>boolean):Node[]=>[...(test(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,test))];
const text=(n:Node):string=>n.nodeName==='#text'?n.value??'':(n.childNodes??[]).map(text).join(' ');
const inline=(s:string)=>s.replace(/\s+/g,' ').trim().replaceAll('[','\\[').replaceAll(']','\\]');
const languageSection=`\n## Languages\nChinese version: ${origin}/zh/llms.txt\n`;

/** Mirror the English route selection using final published Chinese metadata. */
export function applyBilingualDiscovery(out:string):void {
 const file=join(out,'llms.txt');
 const english=readFileSync(file,'utf8').replace(languageSection,'');
 const chineseHome=join(out,'zh/index.html');
 // This addition is identical in English-only verification and bilingual builds.
 writeFileSync(file,english+languageSection,'utf8');
 if(!existsSync(chineseHome))return;
 const sections:Record<string,string>={'## Core pages':'## 核心页面','## Services':'## 木工服务','## Articles':'## 文章与指南'};
 const lines=english.split('\n').map(line=>{
  if(line.startsWith('# '))return line;
  if(line.startsWith('> '))return '> 我们在堪培拉提供木工与木结构维修服务。';
  if(line.startsWith('Phone: '))return line.replace('Phone: ','电话：');
  if(line.startsWith('Email: '))return line.replace('Email: ','邮箱：');
  if(line.startsWith('Last updated: '))return line.replace('Last updated: ','最近更新：');
  if(sections[line])return sections[line];
  if(!line.startsWith('- ['))return line;
  const match=line.match(/^- \[.*\]\((https:\/\/[^\s)]+)\): .+$/);
  if(!match)throw Error('Unsupported English discovery entry: '+line);
  const url=new URL(match[1]);
  if(url.origin!==origin||url.search||url.hash||url.pathname.startsWith('/zh/')||!url.pathname.endsWith('/'))throw Error('Invalid English discovery URL');
  const route='/zh'+url.pathname,canonical=origin+route;
  const doc=parse(readFileSync(join(out,route.slice(1),'index.html'),'utf8')) as unknown as Node;
  if(attr(all(doc,n=>n.nodeName==='html')[0],'lang')!=='zh-Hans')throw Error('Missing Chinese language: '+route);
  if(!all(doc,n=>n.nodeName==='link'&&attr(n,'rel')==='canonical'&&attr(n,'href')===canonical).length)throw Error('Chinese canonical mismatch: '+route);
  if(all(doc,n=>n.nodeName==='meta'&&attr(n,'name')==='robots'&&/noindex/i.test(attr(n,'content')??'')).length)throw Error('Non-public Chinese page: '+route);
  const headings=all(doc,n=>n.nodeName==='h1');
  const description=attr(all(doc,n=>n.nodeName==='meta'&&attr(n,'name')==='description')[0]??{nodeName:''},'content');
  if(headings.length!==1||!description?.trim())throw Error('Missing final Chinese metadata: '+route);
  return `- [${inline(text(headings[0]))}](${canonical}): ${inline(description)}`;
 });
 writeFileSync(join(out,'zh/llms.txt'),lines.join('\n')+`\n## 语言版本\n英文版本：${origin}/llms.txt\n`,'utf8');
}
