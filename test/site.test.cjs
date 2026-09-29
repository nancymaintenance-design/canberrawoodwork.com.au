const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
const dist=path.join(root,'dist');
const measurementId='G-BXD1MSBJC9';
const keywordMap=JSON.parse(fs.readFileSync(path.join(root,'src','keyword-map.json'),'utf8'));
const escapeHtml=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
execFileSync(process.execPath,['build.mjs'],{cwd:root});
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else if(entry.name==='index.html')files.push(p)}}
walk(dist);
assert.equal(files.length,39,'38 public routes plus 404');
const titles=new Set();
for(const file of files){const html=fs.readFileSync(file,'utf8');const route='/'+path.relative(dist,path.dirname(file)).replaceAll('\\','/').replace(/^\.$/,'').replace(/\/?$/,'/');const title=html.match(/<title>([^<]+)<\/title>/)?.[1];assert.ok(title,`${file}: title`);assert.ok(!titles.has(title),`${file}: unique title`);titles.add(title);assert.match(html,/<meta name="description" content="[^"]+">/);assert.match(html,/<h1[ >]/);assert.match(html,/href="\/about\/"/);assert.match(html,/href="\/contact\/"/);assert.match(html,/0405 878 406/);assert.match(html,/brian@elliservices.com.au/);assert.match(html,/application\/ld\+json/);assert.ok(!/melbourne|lorem ipsum|aggregateRating|reviewCount|five.star/i.test(html),`${file}: no irrelevant or fabricated claims`);for(const raw of html.matchAll(/href="(\/[^"]*)"/g)){const href=raw[1].split('#')[0].split('?')[0];if(!href)continue;const target=href.startsWith('/assets/')?path.join(dist,href.slice(1)):path.join(dist,href.slice(1),'index.html');assert.ok(fs.existsSync(target),`${file}: broken link ${href}`)}for(const x of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))assert.doesNotThrow(()=>JSON.parse(x[1]),`${file}: JSON-LD valid`)}
for(const file of files){const html=fs.readFileSync(file,'utf8');assert.match(html,new RegExp(`https://www\\.googletagmanager\\.com/gtag/js\\?id=${measurementId}`),`${file}: GA4 loader`);assert.equal((html.match(new RegExp(`gtag\\('config','${measurementId}'\\)`,'g'))||[]).length,1,`${file}: one GA4 config`)}
const home=fs.readFileSync(path.join(dist,'index.html'),'utf8');assert.match(home,/home work better/);assert.match(home,/Small Carpentry Jobs/);
const faq=fs.readFileSync(path.join(dist,'faq','index.html'),'utf8');assert.match(faq,/FAQPage/);
const news=fs.readFileSync(path.join(dist,'news','timber-door-sticks-after-rain','index.html'),'utf8');assert.match(news,/"@type":"Article"/);
const newsIndex=fs.readFileSync(path.join(dist,'news','index.html'),'utf8');
const servicesIndex=fs.readFileSync(path.join(dist,'services','index.html'),'utf8');
const about=fs.readFileSync(path.join(dist,'about','index.html'),'utf8');
assert.match(home,/class="google-map"/);assert.match(home,/www\.google\.com\/maps\?q=/);assert.match(home,/maps\.app\.goo\.gl\/cvWgzfMPhPrDPZnE7/);
assert.match(about,/96 645 821 745/);assert.match(about,/645 821 745/);assert.match(about,/accesscanberra\.act\.gov\.au\/business-and-work\/public-registers/);
assert.match(home,/wood-theme\.css/);assert.match(home,/View all 17 services/);
for(const item of keywordMap.categories.intent)assert.ok(faq.includes(escapeHtml(item.term)),`missing intent ${item.id}`);
for(const item of keywordMap.categories.distilled)assert.ok(servicesIndex.includes(escapeHtml(item.term)),`missing internal-link anchor ${item.id}`);
for(const item of keywordMap.categories.scenario)assert.ok(newsIndex.includes(escapeHtml(item.term)),`missing news scenario ${item.id}`);
for(const item of keywordMap.categories.question)assert.ok(faq.includes(escapeHtml(item.term))||newsIndex.includes(escapeHtml(item.term)),`missing knowledge question ${item.id}`);
for(const item of keywordMap.categories.core){if(item.owner==='/service-areas'||/near me|cost|hourly rate/i.test(item.term))continue;const owner=item.owner==='/'?'small-carpentry-jobs':item.owner.split('/').filter(Boolean).at(-1);const html=fs.readFileSync(path.join(dist,'services',owner,'index.html'),'utf8');assert.ok(html.includes(escapeHtml(item.term.replace(/ canberra$/i,''))),`missing service phrase ${item.id}`)}
const areas=fs.readFileSync(path.join(dist,'service-areas','index.html'),'utf8');assert.match(areas,/Denman Prospect/);assert.match(areas,/class="enquiry-form"/);
const contact=fs.readFileSync(path.join(dist,'contact','index.html'),'utf8');
for(const [name,html] of [['contact',contact],['service areas',areas]]){
  assert.match(html,/Canberra district or area/,`${name}: area selector`);
  assert.match(html,/Service of interest/,`${name}: service selector`);
  assert.match(html,/type="file"/,`${name}: optional photo field`);
  assert.match(html,/name="consent" type="checkbox" required/,`${name}: required consent`);
  assert.match(html,/Send enquiry/,`${name}: enquiry action`);
}
const browserScript=fs.readFileSync(path.join(dist,'assets','site.js'),'utf8');
assert.match(browserScript,/fetch\('\/api\/contact'/,'Resend contact API request');
assert.doesNotMatch(browserScript,/location\.href=.*mailto/,'no mail-client redirect');
assert.match(fs.readFileSync(path.join(dist,'llms.txt'),'utf8'),/Ellis Services Group/);
assert.match(fs.readFileSync(path.join(dist,'robots.txt'),'utf8'),/Disallow: \/|Allow: \/\n/);
const robots=fs.readFileSync(path.join(dist,'robots.txt'),'utf8');
const sitemap=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');
assert.match(home,/<link rel="canonical" href="https:\/\/www\.canberrawoodwork\.com\.au\/">/,'default build canonical uses production origin');
assert.match(robots,/Allow: \/\n/,'default build allows search-engine crawling');
assert.match(robots,/Sitemap: https:\/\/www\.canberrawoodwork\.com\.au\/sitemap\.xml/,'default build sitemap uses production origin');
assert.match(sitemap,/https:\/\/www\.canberrawoodwork\.com\.au\//,'default build sitemap contains production URLs');
assert.doesNotMatch(`${home}\n${robots}\n${sitemap}`,/127\.0\.0\.1:4174/,'default build has no local URLs');
console.log(`Validated ${files.length} pages, internal links, metadata and JSON-LD`);
