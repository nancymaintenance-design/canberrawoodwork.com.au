import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
/** Only the two approved privacy pages receive the selected carpentry design. */
export function applyPrivacyDesignRelease(out:string):void {
 for(const locale of ['en','zh']){
  const file=join(out,locale==='zh'?'zh/privacy/index.html':'privacy/index.html');
  const html=readFileSync(file,'utf8');
  const main=html.match(/<main id="main">([\s\S]*?)<\/main>/)?.[0];
  if(!main)throw Error('Privacy layout source missing: '+locale);
  const hero=main.match(/<section class="page-hero shell">([\s\S]*?)<\/section>/)?.[1];
  const breadcrumb=hero?.match(/<nav\b[\s\S]*?<\/nav>/)?.[0];
  const eyebrow=hero?.match(/<p class="eyebrow">([\s\S]*?)<\/p>/)?.[1];
  const title=hero?.match(/<h1>([\s\S]*?)<\/h1>/)?.[1];
  const intro=hero?.match(/<\/h1><p>([\s\S]*?)<\/p>/)?.[1];
  const sections=[...main.matchAll(/<div class="detail-block"><h2>([\s\S]*?)<\/h2>([\s\S]*?)<\/div>/g)];
  if(!breadcrumb||!eyebrow||!title||!intro||sections.length!==4)throw Error('Privacy content structure changed: '+locale);
  const index=sections.map((s,i)=>`<a href="#policy-${i+1}"${i===0?' class="is-active" aria-current="location"':''}><span class="craft-index-number" aria-hidden="true">0${i+1}</span><span>${s[1]}</span></a>`).join('');
  const copy=sections.map((s,i)=>`<section class="craft-section" id="policy-${i+1}" aria-labelledby="policy-${i+1}-title"><div class="craft-section-heading"><span class="craft-section-number" aria-hidden="true">0${i+1}</span><h2 id="policy-${i+1}-title">${s[1]}</h2></div><div class="craft-paragraphs">${s[2]}</div></section>`).join('');
  const replacement=`<main id="main" class="craft-policy"><section class="craft-hero" aria-labelledby="policy-title"><div class="craft-hero-inner"><p class="craft-eyebrow">${eyebrow}</p><h1 id="policy-title">${title}</h1><p class="craft-intro">${intro}</p></div></section><div class="craft-breadcrumb shell">${breadcrumb}</div><div class="craft-document"><aside class="craft-sidebar"><nav class="craft-index" aria-label="${locale==='zh'?'隐私政策目录':'Privacy policy contents'}">${index}</nav></aside><div class="craft-copy" id="policy-content" tabindex="-1">${copy}</div></div></main>`;
  let result=html.replace(main,replacement).replace('</head>','<link rel="stylesheet" href="/assets/privacy-design.css"><script defer src="/assets/privacy-design.js"></script></head>');
  result=result.replace(/<body([^>]*)>/,(_match,attrs:string)=>`<body${attrs.includes('class="')?attrs.replace(/class="([^"]*)"/,'class="$1 craft-page"'):attrs+' class="craft-page"'}><a class="craft-skip" href="#policy-content">${locale==='zh'?'跳至隐私政策正文':'Skip to privacy policy'}</a>`);
  writeFileSync(file,result);
 }
}
