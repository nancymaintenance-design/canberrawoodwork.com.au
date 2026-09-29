const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
const dist=path.join(root,'dist');
const keywordMap=JSON.parse(fs.readFileSync(path.join(root,'src','keyword-map.json'),'utf8'));
const escapeHtml=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const prohibitedClaim=/melbourne|lorem ipsum|aggregateRating|reviewCount|five.star|fully insured|licensed and insured|same.day service|\b\d+\+? (?:reviews|completed jobs)\b|(?:lifetime|\d+[- ]year) warranty|(?<!no )(?<!not )\bfully licen[cs]ed\b|\bwe are licen[cs]ed\b|(?<!no )(?<!not )\b(?:fixed|guaranteed) (?:price|pricing|quote)\b|(?<!no )(?<!not )\bguaranteed approval\b|\b(?:from|starting at) \$\d+(?:\.\d{2})?\b/i;
for(const claim of ['Fully licensed Canberra carpenters','We are fully licenced','We are licensed carpenters','Fixed price repairs','Guaranteed quote for every job','Repairs from $99','Guaranteed approval for your deck']){
  assert.match(claim,prohibitedClaim,`unverified claim must be rejected: ${claim}`);
}
for(const boundary of ['The appropriate licensed practitioner must assess the work.','An ABN does not establish an ACT construction occupation licence.','The price depends on the component and access.','Approval checks may be required.','No fixed price is promised.','No guaranteed approval is offered.','We are not fully licensed for this work.']){
  assert.doesNotMatch(boundary,prohibitedClaim,`scope boundary must remain allowed: ${boundary}`);
}
execFileSync(process.execPath,['build.mjs'],{cwd:root});
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else if(entry.name==='index.html')files.push(p)}}
walk(dist);
assert.equal(files.length,39,'38 public routes plus 404');
const titles=new Set();
const descriptions=new Set();
const pageSchemas=new Map();
for(const file of files){
  const html=fs.readFileSync(file,'utf8');
  const route='/'+path.relative(dist,path.dirname(file)).replaceAll('\\','/').replace(/^\.$/,'').replace(/\/?$/,'/');
  const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description=html.match(/<meta name="description" content="([^"]+)">/)?.[1];
  assert.ok(title,`${route}: title`);
  assert.ok(!titles.has(title),`${route}: unique title`);
  titles.add(title);
  assert.ok(description,`${route}: meta description`);
  assert.ok(!descriptions.has(description),`${route}: unique meta description`);
  descriptions.add(description);
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length,1,`${route}: one visible H1`);
  assert.match(html,/<html lang="en-AU">/,`${route}: Australian English language`);
  assert.match(html,/href="\/about\/"/);
  assert.match(html,/href="\/contact\/"/);
  assert.match(html,/0405 878 406/);
  assert.match(html,/brian@elliservices.com.au/);
  assert.doesNotMatch(html,prohibitedClaim,`${route}: no irrelevant or fabricated claims`);
  for(const raw of html.matchAll(/href="(\/[^"]*)"/g)){
    const href=raw[1].split('#')[0].split('?')[0];
    if(!href)continue;
    const target=href.startsWith('/assets/')?path.join(dist,href.slice(1)):path.join(dist,href.slice(1),'index.html');
    assert.ok(fs.existsSync(target),`${route}: broken link ${href}`);
  }
  const schemas=[];
  for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)){
    let schema;
    assert.doesNotThrow(()=>{schema=JSON.parse(match[1])},`${route}: JSON-LD valid`);
    schemas.push(schema);
  }
  assert.ok(schemas.length,`${route}: JSON-LD present`);
  pageSchemas.set(route,schemas);
}
const home=fs.readFileSync(path.join(dist,'index.html'),'utf8');assert.match(home,/home work better/);assert.match(home,/Small Carpentry Jobs/);
const faq=fs.readFileSync(path.join(dist,'faq','index.html'),'utf8');assert.match(faq,/FAQPage/);
const news=fs.readFileSync(path.join(dist,'news','timber-door-sticks-after-rain','index.html'),'utf8');assert.match(news,/"@type":"Article"/);
const newsIndex=fs.readFileSync(path.join(dist,'news','index.html'),'utf8');
const servicesIndex=fs.readFileSync(path.join(dist,'services','index.html'),'utf8');
const about=fs.readFileSync(path.join(dist,'about','index.html'),'utf8');
const areaPage=fs.readFileSync(path.join(dist,'service-areas','index.html'),'utf8');
const contactPage=fs.readFileSync(path.join(dist,'contact','index.html'),'utf8');
assert.match(home,/class="google-map"/);assert.match(home,/www\.google\.com\/maps\?q=/);assert.match(home,/maps\.app\.goo\.gl\/cvWgzfMPhPrDPZnE7/);
assert.match(home,/121 Marcus Clarke St, Canberra, ACT 2600/,'home map section publishes the office address');
assert.match(home,/class="work-carousel"/,'home page publishes a work-photo carousel');
assert.equal([...home.matchAll(/class="work-carousel-slide/g)].length,6,'home work carousel presents six supplied work photos');
assert.match(home,/data-carousel-next/,'home work carousel has a next control');
assert.match(home,/data-carousel-prev/,'home work carousel has a previous control');
for(const [name,html] of [['about',about],['contact',contactPage],['areas',areaPage],['services',servicesIndex],['news',newsIndex]]){
  assert.doesNotMatch(html,/maps\.app\.goo\.gl|www\.google\.com\/maps/,
    `${name}: Google Maps links stay exclusive to the home map section`);
}
assert.match(contactPage,/121 Marcus Clarke St, Canberra, ACT 2600/,'contact page displays the office address');
assert.doesNotMatch(contactPage,/View on Google Maps/,'contact page does not use a Google Maps location link');
assert.match(about,/121 Marcus Clarke St, Canberra, ACT 2600/,'footer address is present on supporting pages');
assert.match(about,/96 645 821 745/);assert.match(about,/645 821 745/);assert.match(about,/accesscanberra\.act\.gov\.au\/business-and-work\/public-registers/);
assert.match(home,/wood-theme\.css/);assert.match(home,/View all 17 services/);
for(const item of keywordMap.categories.intent)assert.ok(faq.includes(escapeHtml(item.term)),`missing intent ${item.id}`);
for(const item of keywordMap.categories.distilled)assert.ok(servicesIndex.includes(escapeHtml(item.term)),`missing internal-link anchor ${item.id}`);
for(const item of keywordMap.categories.scenario)assert.ok(newsIndex.includes(escapeHtml(item.term)),`missing news scenario ${item.id}`);
for(const item of keywordMap.categories.question)assert.ok(faq.includes(escapeHtml(item.term))||newsIndex.includes(escapeHtml(item.term)),`missing knowledge question ${item.id}`);
for(const item of keywordMap.categories.core){
  if(item.owner==='/service-areas'||/near me|cost|hourly rate/i.test(item.term))continue;
  const owner=item.owner==='/'?'small-carpentry-jobs':item.owner.split('/').filter(Boolean).at(-1);
  const html=fs.readFileSync(path.join(dist,'services',owner,'index.html'),'utf8');
  const main=html.match(/<main id="main">([\s\S]*?)<\/main>/)?.[1]||'';
  assert.ok(main.includes(escapeHtml(item.term.replace(/ canberra$/i,''))),`missing visible owner phrase ${item.id} on ${owner}`);
}
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
assert.match(fs.readFileSync(path.join(dist,'robots.txt'),'utf8'),/(?:Disallow|Allow): \//,'robots permits either a local-preview block or a production crawl allowance');
import('../src/content.mjs').then(async ({services})=>{
  assert.equal(services.length,17,'all 17 service routes remain present');
  const buildingFabricPhrases={
    'door-and-frame-repairs':['hinge-side and latch-side gaps','floor-to-door clearance'],
    'timber-window-repairs':['sill fall and drip edge','matching the existing profile'],
    'rotten-timber-repairs':['moisture source before replacement','sound timber at the repair joint'],
    'fascia-and-eaves-repairs':['gutter brackets and roof-edge fixings','roofing or guttering trade'],
    'timber-weatherboard-repairs':['board profile and lap','water path behind the cladding'],
  };
  const outdoorScopePhrases={
    'deck-repairs':['walking boards do not show whether the joists are sound','underside access'],
    'deck-building':['new footing locations and deck set-out','repairing an existing deck'],
    'timber-fence-repairs':['post and rail repair','boundary position and owner agreement'],
    'timber-gate-repairs':['hinge and latch alignment','motorised drive or wiring'],
    'pergola-timber-repairs':['repairing an existing pergola','a new roof or changed footprint may raise approval questions'],
    'timber-stair-and-handrail-repairs':['tread support and handrail anchorage','safety-critical components'],
  };
  const interiorAndStructuralPhrases={
    'small-carpentry-jobs':['one task per line','larger work can be assessed separately'],
    'skirting-and-architraves':['profile, height and finish','flooring edge and wall finish'],
    'cabinet-door-and-drawer-repairs':['hinge and runner compatibility','part availability'],
    'interior-carpentry':['on-site fitting and finishing','structural or wet-area work'],
    'custom-joinery':['measure at several points','material, edge treatment and finish'],
    'structural-timber-repairs':['practitioner and approval checks','does not establish an act construction occupation licence'],
  };
  for(const service of services){
    const file=path.join(dist,'services',service.slug,'index.html');
    const html=fs.readFileSync(file,'utf8');
    const route=`/services/${service.slug}/`;
    assert.ok(html.includes(`<h1>${escapeHtml(service.title)}</h1>`),`${service.slug}: service-specific H1`);
    const serviceSchemas=pageSchemas.get(route)?.filter(schema=>schema['@type']==='Service')||[];
    assert.equal(serviceSchemas.length,1,`${service.slug}: one Service JSON-LD object`);
    assert.equal(serviceSchemas[0].name,service.title,`${service.slug}: schema name matches visible heading`);
    assert.equal(serviceSchemas[0].description,service.intro,`${service.slug}: schema description matches visible intro`);
    assert.equal(new URL(serviceSchemas[0].url).pathname,route,`${service.slug}: schema URL matches route`);
    assert.equal(serviceSchemas[0].provider.name,'Ellis Services Group',`${service.slug}: schema provider`);
    const section=html.match(/<section class="service-deep-content shell">([\s\S]*?)<\/section>/)?.[1];
    assert.ok(section,`${service.slug}: visible deep-content section`);
    for(const heading of ['What the work can include','What homeowners commonly notice','How the scope is assessed','Where this repair may stop','Canberra conditions to mention','Prepare your enquiry','Related work']){
      assert.ok(section.includes(`<h2>${heading}</h2>`),`${service.slug}: visible ${heading} heading`);
    }
    assert.match(section,/<div class="related-work-links">[\s\S]*?<\/div>/,`${service.slug}: grouped related links`);
    assert.match(section,/attach photos to the enquiry/i,`${service.slug}: optional photo attachment guidance`);
    assert.match(section,/further material can be shared later if requested/i,`${service.slug}: follow-up material guidance`);
    const deepLinks=[...section.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match=>match[1]);
    assert.ok(deepLinks.length>=2&&deepLinks.length<=4,`${service.slug}: two to four related links`);
    for(const phrase of buildingFabricPhrases[service.slug]||[])assert.ok(section.toLowerCase().includes(phrase),`${service.slug}: missing scope detail "${phrase}"`);
    for(const phrase of outdoorScopePhrases[service.slug]||[])assert.ok(section.toLowerCase().includes(phrase),`${service.slug}: missing outdoor scope detail "${phrase}"`);
    for(const phrase of interiorAndStructuralPhrases[service.slug]||[])assert.ok(section.toLowerCase().includes(phrase),`${service.slug}: missing interior or structural scope detail "${phrase}"`);
    for(const href of deepLinks){
      const pathname=href.split('#')[0].split('?')[0];
      assert.ok(pathname.startsWith('/'),`${service.slug}: deep-content link must be internal (${href})`);
      const target=path.join(dist,pathname.slice(1),'index.html');
      assert.ok(fs.existsSync(target),`${service.slug}: unresolved deep-content link ${href}`);
    }
    const main=html.match(/<main id="main">([\s\S]*?)<\/main>/)?.[1]||'';
    const words=main.replace(/<[^>]*>/g,' ').replace(/&[^;]+;/g,' ').trim().split(/\s+/).filter(Boolean);
    assert.ok(words.length>=650,`${service.slug}: ${words.length} visible page words (minimum 650)`);
  }
  const {serviceDeepContent}=await import('../src/service-deep-content.mjs');
  const {serviceCaseMedia,homeCaseMedia}=await import('../src/service-case-media.mjs');
  assert.equal(homeCaseMedia.hero.src,'/assets/carpenter-at-work-canberra.webp','homepage hero uses the supplied Canberra work image');
  assert.equal(homeCaseMedia.deck.src,'/assets/completed-timber-deck-canberra.webp','homepage deck feature uses the supplied completed-deck image');
  assert.equal(homeCaseMedia.arrival.src,'/assets/carpenter-arrival-canberra.webp','homepage carousel includes the supplied on-site arrival image');
  assert.equal(Object.keys(serviceCaseMedia).length,17,'all seventeen service routes have supplied-image placements');
  assert.match(about,/measuring-timber-work-canberra\.webp/,'about page uses the supplied measurement work image');
  const themeCss=fs.readFileSync(path.join(dist,'assets','wood-theme.css'),'utf8');
  assert.match(themeCss,/\.about-visual img\{[^}]*height:clamp\(300px,30vw,460px\)[^}]*object-fit:cover/,'about work image has a bounded half-height desktop layout');
  for(const [slug,media] of Object.entries(serviceCaseMedia)){
    const service=services.find(item=>item.slug===slug);
    assert.ok(service,`${slug}: configured media belongs to a real service`);
    const html=fs.readFileSync(path.join(dist,'services',slug,'index.html'),'utf8');
    assert.match(html,/class="[^"]*\bservice-case-study\b[^"]*"/,`${slug}: renders a visible case-image section`);
    for(const image of media.images){
      assert.ok(html.includes(`src="${image.src}"`),`${slug}: renders ${image.src}`);
      assert.ok(fs.existsSync(path.join(dist,image.src)),`${slug}: publishes ${image.src}`);
    }
  }
  const suppliedMediaExpectations={
    'timber-window-repairs':'/assets/water-damaged-window-sill-before.webp',
    'rotten-timber-repairs':'/assets/deteriorated-timber-frame-before.webp',
    'small-carpentry-jobs':'/assets/small-carpentry-gate-before-after.webp',
    'interior-carpentry':'/assets/interior-joinery-canberra.webp',
    'structural-timber-repairs':'/assets/under-deck-timber-assessment.webp',
    'deck-building':'/assets/new-deck-framing-canberra.webp',
  };
  for(const [slug,src] of Object.entries(suppliedMediaExpectations)){
    const html=fs.readFileSync(path.join(dist,'services',slug,'index.html'),'utf8');
    assert.ok(html.includes(`src="${src}"`),`${slug}: renders its new supplied work image`);
  }
  const deckBuildHtml=fs.readFileSync(path.join(dist,'services','deck-building','index.html'),'utf8');
  assert.ok(deckBuildHtml.includes('src="/assets/new-deck-completed-canberra.webp"'),'deck building: renders the supplied completed deck image');
  for(const image of Object.values(homeCaseMedia)){
    assert.ok(fs.existsSync(path.join(dist,image.src)),`home: publishes ${image.src}`);
  }
  for(const service of services){
    const entry=serviceDeepContent[service.slug];
    assert.ok(entry,`${service.slug}: deep-content data entry`);
    for(const key of ['scope','observations','assessment','boundary','canberraContext','enquiry'])assert.ok(typeof entry[key]==='string'&&entry[key].trim(),`${service.slug}: ${key} copy`);
    assert.ok(Array.isArray(entry.relatedSlugs),`${service.slug}: relatedSlugs`);
  }
  console.log(`Validated ${files.length} pages, internal links, metadata, JSON-LD and deep service content`);
}).catch(error=>{console.error(error);process.exitCode=1});
