import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

/** Apply only the approved bilingual FAQ layout. All answers/runtime stay intact. */
export function applyFaqDesignRelease(out:string):void {
 for(const route of ['faq/index.html','zh/faq/index.html']){
  const file=join(out,route),html=readFileSync(file,'utf8');
  const hero=html.match(/<section class="page-hero shell">([\s\S]*?)<\/section>/);
  const breadcrumb=hero?.[1]?.match(/<nav\b[\s\S]*?<\/nav>/)?.[0];
  if(!hero||!breadcrumb||!hero[1]?.includes('<h1>'))throw Error('FAQ source structure changed: '+route);
  const copy=hero[1].replace(breadcrumb,'');
  const replacement=`<section class="page-hero shell cw-hero"><div class="cw-hero-breadcrumb">${breadcrumb}</div><div class="cw-hero-grid"><div class="cw-hero-copy">${copy}</div><div class="cw-hero-media" aria-hidden="true" style="background-image:url('/assets/measuring-timber-work-canberra.webp')"></div></div></section>`;
  let result=html.replace(hero[0],replacement);
  result=result.replace(/<body([^>]*)>/,(_match,attrs:string)=>`<body${attrs.includes('class="')?attrs.replace(/class="([^"]*)"/,'class="$1 cw-page cw-faq"'):attrs+' class="cw-page cw-faq"'}>`);
  result=result.replace('</head>','<link rel="stylesheet" href="/assets/faq-design.css"></head>');
  writeFileSync(file,result);
 }
}
