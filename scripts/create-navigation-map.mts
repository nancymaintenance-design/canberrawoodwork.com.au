import {readFileSync} from 'node:fs';
import {parse,type DefaultTreeAdapterMap} from 'parse5';
import {services,articles} from '../src/content.mts';
import {verifiedPages} from '../src/verified-projects.mts';
type Node=DefaultTreeAdapterMap['node'];
const origin='https://www.canberrawoodwork.com.au';
const serviceRoutes=new Set([...services.map(s=>'/services/'+s.slug+'/'),...verifiedPages().filter(p=>p.type==='Service').map(p=>p.route)]);
const mixed:Record<string,string[]>={
 '/news/repair-or-rebuild-a-deck/':['/services/deck-repairs/','/services/deck-building/'],
 '/news/carpentry-jobs-before-selling/':['/services/small-carpentry-jobs/','/services/interior-carpentry/','/services/door-and-frame-repairs/','/services/skirting-and-architraves/','/services/cabinet-door-and-drawer-repairs/'],
 '/news/carpentry-quote-cost-factors/':['/services/small-carpentry-jobs/','/services/door-and-frame-repairs/','/services/cabinet-door-and-drawer-repairs/'],
 '/news/timber-deck-maintenance-canberra/':['/services/deck-cleaning-and-oiling/','/services/deck-repairs/']
};
const cases:Record<string,string>={'/projects/mitchell-composite-deck/':'/services/composite-decking/','/projects/melba-deck-care/':'/services/deck-cleaning-and-oiling/','/projects/pearce-wardrobe-installation/':'/services/built-in-wardrobes/','/projects/under-stair-storage-gallery/':'/services/under-stair-storage/'};
const guides=Object.fromEntries(articles.map(a=>['/news/'+a.slug+'/',{owner:'/services/'+a.owner+'/'}]));
const priority=new Set(['/services/small-carpentry-jobs/','/services/door-and-frame-repairs/','/services/timber-window-repairs/','/services/cabinet-door-and-drawer-repairs/','/services/deck-repairs/','/services/interior-carpentry/']);
const text=(n:Node):string=>n.nodeName==='#text'&&'value'in n?n.value:'childNodes'in n?n.childNodes.map(text).join(''):'';
const routes=[...readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]!).pathname);
const rows=routes.map(url=>{
 const zh=url.startsWith('/zh/'),base=zh?url.replace(/^\/zh/,''):url,prefix=zh?'/zh':'',local=(p:string)=>prefix+p;
 const html=readFileSync('dist'+url+'index.html','utf8');let label='';
 function walk(n:Node){if('tagName'in n&&n.tagName==='span'&&n.attrs.some(a=>a.name==='aria-current'&&a.value==='page'))label=text(n);if('childNodes'in n)for(const c of n.childNodes)walk(c);}walk(parse(html));
 if(base==='/')label=zh?'首页':'Home';
 let type='company',parent:string|null='/',owner:string|null=null,support:string[]=[],basis='Existing company page or useful navigation index.';
 if(base==='/'){type='homepage';parent=null;owner='/';basis='Existing keyword-map keeps city-wide carpentry queries on Home.';}
 else if(serviceRoutes.has(base)){type='service-owner';owner=base;basis='Existing published service scope; retain its commercial URL.';}
 else if(guides[base]){type='guide';support=mixed[base]||[guides[base].owner];owner=mixed[base]?null:guides[base].owner;parent=owner||'/news/';basis=mixed[base]?'Article covers several services; retain News parent.':'src/content.mts article.owner and actual single-service subject.';if(base==='/news/timber-vs-composite-decking-canberra/')support.push('/services/composite-decking/');}
 else if(cases[base]){type='case-study';owner=cases[base];support=[owner];parent=owner;basis='Authorised project scope and materials in src/verified-projects.mts.';if(base==='/projects/melba-deck-care/')support.push('/services/deck-repairs/');}
 else if(base==='/service-areas/'){type='location';support=['/services/door-and-frame-repairs/','/services/deck-repairs/','/services/timber-fence-repairs/','/services/small-carpentry-jobs/'];basis='Actual ACT district hub; no separate suburb pages are invented.';}
 else if(['/news/','/projects/','/services/','/faq/'].includes(base))type='index';
 const canonical=html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
 return{page_id:(base==='/'?'home':base.slice(1,-1).replaceAll('/','--'))+(zh?'--zh':'--en'),url,locale:zh?'zh-Hans':'en-AU',page_type:type,service_group:owner||support.join('|')||'company',commercial_owner_url:owner?local(owner):null,supported_owner_urls:support.map(local),primary_parent_url:parent?local(parent):null,breadcrumb_label:label.trim(),alternate_url:zh?base:'/zh'+base,canonical,robots:html.match(/<meta name="robots" content="([^"]+)"/)?.[1]||'index,follow (default)',priority:priority.has(base),selection_basis:basis};
});
const data={schemaVersion:1,origin,brand:'Ellis Services Group',reviewedAt:'2026-10-20',queryOwnerSource:'src/keyword-map.json (unchanged)',rows};
console.log('*** Begin Patch\n*** Add File: E:/Ellis-Services/Canberra Woodwork/source/content/navigation-map.json\n+'+JSON.stringify(data)+'\n*** End Patch');
