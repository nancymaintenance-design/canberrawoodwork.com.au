import {parse,type DefaultTreeAdapterMap} from 'parse5';
type Node=DefaultTreeAdapterMap['node'];
type Element=DefaultTreeAdapterMap['element'];
export function simplifyServicesHub(route:string,html:string):string{
 if(!['/services/','/zh/services/'].includes(route)||html.includes('services-hub-extra'))return html;
 const doc=parse(html,{sourceCodeLocationInfo:true}),nodes:Element[]=[];
 function visit(n:Node){if('tagName'in n)nodes.push(n);if('childNodes'in n)for(const c of n.childNodes)visit(c);}visit(doc);
 const has=(n:Element,c:string)=>(n.attrs.find(a=>a.name==='class')?.value||'').split(/\s+/).includes(c);
 const raw=(n:Element)=>html.slice(n.sourceCodeLocation!.startOffset,n.sourceCodeLocation!.endOffset);
 const text=(n:Node):string=>n.nodeName==='#text'&&'value'in n?n.value:'childNodes'in n?n.childNodes.map(text).join(''):'';
 const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 const grid=nodes.find(n=>has(n,'index-grid'));
 const article=nodes.find(n=>n.tagName==='article'&&raw(n).includes('/services/composite-decking/'));
 const extra=nodes.find(n=>n.tagName==='section'&&has(n,'verified-project'));
 const remove=nodes.filter(n=>n.tagName==='section'&&(has(n,'pathways')||has(n,'content-gap-notes')));
 if(!grid||!article||!extra||remove.length!==2)throw Error('Unexpected service hub structure: '+route);
 const descendants:Element[]=[];function collect(n:Node){if('tagName'in n)descendants.push(n);if('childNodes'in n)for(const c of n.childNodes)collect(c);}collect(article);
 const img=descendants.find(n=>n.tagName==='img')!,title=descendants.find(n=>n.tagName==='h3')!,copy=descendants.find(n=>n.tagName==='p')!;
 const zh=route.startsWith('/zh/'),href=(zh?'/zh':'')+'/services/composite-decking/';
 const card=`<a class="index-card" href="${href}">${raw(img).replace('<img ','<img class="service-card-photo" ')}<span>18 / ${zh?'户外木作':'Outdoor carpentry'}</span><h2>${escape(text(title))}</h2><p>${escape(text(copy))}</p><strong>${zh?'查看服务':'View service'} ↗</strong></a>`;
 const changes=[...remove.map(n=>({start:n.sourceCodeLocation!.startOffset,end:n.sourceCodeLocation!.endOffset,value:''})),
  {start:article.sourceCodeLocation!.startOffset,end:article.sourceCodeLocation!.endOffset,value:''},
  {start:grid.sourceCodeLocation!.endTag!.startOffset,end:grid.sourceCodeLocation!.endTag!.startOffset,value:card},
  {start:extra.sourceCodeLocation!.startTag!.startOffset,end:extra.sourceCodeLocation!.startTag!.endOffset,value:raw(extra).slice(0,extra.sourceCodeLocation!.startTag!.endOffset-extra.sourceCodeLocation!.startOffset).replace('verified-project shell','verified-project shell services-hub-extra')}
 ].sort((a,b)=>b.start-a.start);
 for(const c of changes)html=html.slice(0,c.start)+c.value+html.slice(c.end);
 html=html.replace('<h2>Deck installation, care and fitted storage</h2>','<h2>Deck care and fitted storage</h2>').replace('<h2>露台安装、保养和内置储物柜</h2>','<h2>露台保养和内置储物柜</h2>');
 return html.replace('</head>','<link rel="stylesheet" href="/assets/services-hub.css"></head>');
}
