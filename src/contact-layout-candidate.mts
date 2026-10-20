import {parse,type DefaultTreeAdapterMap} from 'parse5';
type Node=DefaultTreeAdapterMap['node'];
type Element=DefaultTreeAdapterMap['element'];

/** Local approval candidate: remove the specified advice block and reuse an existing team photo. */
export function updateContactLayout(route:string,html:string):string{
 if(!['/contact/','/zh/contact/'].includes(route)||html.includes('class="contact-team-photo"'))return html;
 const doc=parse(html,{sourceCodeLocationInfo:true});let notes:Element|undefined,info:Element|undefined;
 function visit(n:Node){if('tagName'in n){const classes=(n.attrs.find(a=>a.name==='class')?.value||'').split(/\s+/);if(n.tagName==='section'&&classes.includes('content-gap-notes'))notes=n;if(classes.includes('contact-info'))info=n;}if('childNodes'in n)for(const c of n.childNodes)visit(c);}visit(doc);
 if(!notes?.sourceCodeLocation||!info?.sourceCodeLocation?.endTag)throw Error('Contact layout anchors missing: '+route);
 const zh=route.startsWith('/zh/');
 const photo=`<figure class="contact-team-photo"><img src="/assets/projects/oxley-outdoor-deck-work-800.webp" srcset="/assets/projects/oxley-outdoor-deck-work-400.webp 400w, /assets/projects/oxley-outdoor-deck-work-800.webp 800w" sizes="(max-width: 900px) 100vw, 460px" width="800" height="600" loading="lazy" decoding="async" alt="${zh?'Ellis 团队进行户外木作施工':'Ellis carpenter fitting boards on an outdoor timber deck'}"><figcaption>${zh?'Ellis 团队 · 户外木作施工':'Ellis team · Outdoor carpentry at work'}</figcaption></figure>`;
 const changes=[{start:notes.sourceCodeLocation.startOffset,end:notes.sourceCodeLocation.endOffset,text:''},{start:info.sourceCodeLocation.endTag.startOffset,end:info.sourceCodeLocation.endTag.startOffset,text:photo}].sort((a,b)=>b.start-a.start);
 for(const change of changes)html=html.slice(0,change.start)+change.text+html.slice(change.end);
 return html.replace('</head>','<link rel="stylesheet" href="/assets/contact-layout.css"></head>');
}
