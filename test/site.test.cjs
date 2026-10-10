const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
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
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else if(entry.name==='index.html')files.push(p)}}
walk(dist);
assert.equal(files.length,40,'39 public routes plus 404');
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
  assert.match(html,/<a class="footer-social-link" href="https:\/\/www\.instagram\.com\/elliservices_group\/"/,
    `${route}: footer links to the Ellis Services Group Instagram profile`);
  assert.match(html,/src="\/assets\/instagram-small\.png" alt=""/,
    `${route}: footer displays the supplied Instagram icon`);
  for(const destination of ['https://share.google/tU1c5vEAlELqXCifu','https://share.google/Z4tImXHToPi9H4LmH','https://share.google/y50AZRJwjOdVOlj5o']){
    assert.ok(html.includes(`<a class="footer-social-link" href="${destination}" target="_blank" rel="noopener noreferrer">`),`${route}: shared footer social destination ${destination}`);
  }
  assert.equal((html.match(/class="footer-social-link"/g)||[]).length,4,`${route}: exactly four footer social links`);
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
  assert.ok(schemas.every(schema=>schema['@type']!=='FAQPage'),`${route}: no FAQPage JSON-LD`);
  pageSchemas.set(route,schemas);
}
const home=fs.readFileSync(path.join(dist,'index.html'),'utf8');assert.match(home,/<h1>Canberra Carpentry & Timber Repairs<\/h1>/,'home page H1 states the core Canberra service theme directly');assert.match(home,/Small Carpentry Jobs/);
const faq=fs.readFileSync(path.join(dist,'faq','index.html'),'utf8');assert.match(faq,/<h1>Canberra Carpentry Questions & Answers<\/h1>/,'FAQ H1 states the Canberra carpentry question intent directly');assert.doesNotMatch(faq,/"@type":"FAQPage"/);
const news=fs.readFileSync(path.join(dist,'news','timber-door-sticks-after-rain','index.html'),'utf8');assert.match(news,/"@type":"Article"/);
const newsIndex=fs.readFileSync(path.join(dist,'news','index.html'),'utf8');
const servicesIndex=fs.readFileSync(path.join(dist,'services','index.html'),'utf8');
const about=fs.readFileSync(path.join(dist,'about','index.html'),'utf8');
const areaPage=fs.readFileSync(path.join(dist,'service-areas','index.html'),'utf8');
const contactPage=fs.readFileSync(path.join(dist,'contact','index.html'),'utf8');
const privacyPage=fs.readFileSync(path.join(dist,'privacy','index.html'),'utf8');
const rottenTimberPage=fs.readFileSync(path.join(dist,'services','rotten-timber-repairs','index.html'),'utf8');
const serviceAndAdviceCopy=files.filter(file=>file.includes(`${path.sep}services${path.sep}`)||file.includes(`${path.sep}news${path.sep}`)).map(file=>fs.readFileSync(file,'utf8')).join('\n');
const customerFacingCopy=files.filter(file=>!file.includes(`${path.sep}privacy${path.sep}`)).map(file=>fs.readFileSync(file,'utf8')).join('\n');
assert.match(about,/<h1>About Our Canberra Carpentry Team<\/h1>/,'about H1 states the local team theme directly');
assert.match(servicesIndex,/<h1>Canberra Carpentry & Timber Repair Services<\/h1>/,'services H1 states the service cluster directly');
assert.match(areaPage,/<h1>Carpentry Services Across Canberra ACT<\/h1>/,'service-area H1 states the local service-area theme directly');
assert.match(contactPage,/<h1>Request a Canberra Carpentry Quote<\/h1>/,'contact H1 states the quote intent directly');
assert.match(newsIndex,/<h1>Canberra Carpentry Advice & Repair Guides<\/h1>/,'news H1 states the advice and repair-guide theme directly');
assert.match(rottenTimberPage,/<h2>Rotten Timber Repairs: repair method<\/h2>/,'rotten timber repairs present Ellis Services Group\'s positive repair approach');
assert.match(rottenTimberPage,/on-site assessment[\s\S]*identify the cause[\s\S]*repair plan and quote/i,'rotten timber repairs explain the assessment, cause and quoted repair path');
assert.doesNotMatch(serviceAndAdviceCopy,/Where this repair may stop|(?:contact|consult|speak with|seek) (?:an? |the )?(?:external specialist|another trade|locksmith|another company)/i,'repair pages do not send visitors to another company; qualified project checks remain accurate');
assert.doesNotMatch(customerFacingCopy,/may need a separate trade|needs a separate assessment|not an automatic quote|does not confirm a booking/i,'customer-facing repair copy avoids hand-off and booking-deflection language without banning material-matching facts');
assert.match(home,/class="google-map"/);assert.match(home,/www\.google\.com\/maps\?q=/);assert.match(home,/maps\.app\.goo\.gl\/cvWgzfMPhPrDPZnE7/);
assert.match(home,/121 Marcus Clarke St, Canberra, ACT 2600/,'home map section publishes the office address');
assert.match(home,/class="work-carousel"/,'home page publishes a work-photo carousel');
assert.equal([...home.matchAll(/class="work-carousel-slide/g)].length,7,'home work carousel presents seven supplied work photos');
assert.match(home,/data-carousel-next/,'home work carousel has a next control');
assert.match(home,/data-carousel-prev/,'home work carousel has a previous control');
for(const [name,html] of [['about',about],['contact',contactPage],['areas',areaPage],['services',servicesIndex],['news',newsIndex]]){
  assert.doesNotMatch(html,/maps\.app\.goo\.gl|www\.google\.com\/maps/,
    `${name}: Google Maps links stay exclusive to the home map section`);
}
assert.match(contactPage,/121 Marcus Clarke St, Canberra, ACT 2600/,'contact page displays the office address');
assert.doesNotMatch(contactPage,/View on Google Maps/,'contact page does not use a Google Maps location link');
assert.match(about,/121 Marcus Clarke St, Canberra, ACT 2600/,'footer address is present on supporting pages');
assert.match(about,/Canberra office and carpentry team/,'about page establishes the local Canberra operation');
assert.doesNotMatch(about,/VIC 3030|construction occupation licence/i,'about page does not undermine Canberra location or service trust');
assert.match(about,/class="business-registration-section"/,'about page publishes the business and registration section');
assert.match(about,/Ellis Services Group company details\./,'about page gives the registration panel a direct company-details heading');
assert.match(about,/ELLIS SERVICES GROUP PTY LTD/,'about page identifies the legal entity');
assert.match(about,/96 645 821 745/,'about page publishes the ABN');
assert.match(about,/https:\/\/abr\.business\.gov\.au\/ABN\/View\?id=645821745/,'about page links to the official ABN record');
assert.match(about,/https:\/\/share\.google\/9J93sm3qIx44KCDtj/,'about page links to the Google Business Profile reviews');
assert.match(privacyPage,/Privacy Policy/,'privacy policy page is published');
assert.match(privacyPage,/121 Marcus Clarke St, Canberra, ACT 2600/,'privacy policy identifies the business contact address');
assert.match(home,/wood-theme\.css/);assert.match(home,/View all 17 services/);
const serviceQuestionPages=files.filter(file=>file.includes(`${path.sep}services${path.sep}`)).map(file=>fs.readFileSync(file,'utf8')).join('\n');
for(const item of keywordMap.categories.distilled)assert.ok(servicesIndex.includes(escapeHtml(item.term)),`missing internal-link anchor ${item.id}`);
// Scenarios remain in the editorial map; the public hub links every guide
// rather than exposing an exhaustive keyword/question spreadsheet.
for(const entry of fs.readdirSync(path.join(dist,'news'),{withFileTypes:true}).filter(item=>item.isDirectory()))assert.ok(newsIndex.includes(`/news/${entry.name}/`),`missing news guide ${entry.name}`);
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
  assert.doesNotMatch(html,/type="file"/,`${name}: no non-functional photo picker`);
  assert.match(html,/Photos are optional[\s\S]*mailto:brian@elliservices\.com\.au/,`${name}: optional photos use the existing email channel`);
  assert.match(html,/name="consent" type="checkbox" required/,`${name}: required consent`);
  assert.match(html,/href="\/privacy\/"/,`${name}: consent links to the privacy policy`);
  assert.match(html,/Send enquiry/,`${name}: enquiry action`);
}
const browserScript=fs.readFileSync(path.join(dist,'assets','site.js'),'utf8');
assert.match(browserScript,/fetch\('\/api\/contact'/,'Resend contact API request');
assert.doesNotMatch(browserScript,/location\.href=.*mailto/,'no mail-client redirect');
const discovery=fs.readFileSync(path.join(dist,'llms.txt'),'utf8');
assert.match(discovery,/Ellis Services Group/);
assert.doesNotMatch(discovery,/127\.0\.0\.1/);
assert.match(discovery,/\[Contact\]\(https:\/\/www\.canberrawoodwork\.com\.au\/contact\/\)/);
assert.match(fs.readFileSync(path.join(dist,'robots.txt'),'utf8'),/(?:Disallow|Allow): \//,'robots permits either a local-preview block or a production crawl allowance');
const robots=fs.readFileSync(path.join(dist,'robots.txt'),'utf8');
const sitemap=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');
assert.match(home,/<link rel="canonical" href="https:\/\/www\.canberrawoodwork\.com\.au\/">/,'production homepage canonical uses the public URL');
assert.match(robots,/^Allow: \/$/m,'production robots permits crawling');
assert.doesNotMatch(robots,/127\.0\.0\.1/,'production robots never names a local host');
assert.match(sitemap,/https:\/\/www\.canberrawoodwork\.com\.au\//,'production sitemap uses the public URL');
assert.doesNotMatch(sitemap,/127\.0\.0\.1/,'production sitemap never names a local host');
import('../src/content.mjs').then(async ({services})=>{
  const {canonicalFaqQuestion}=await import('../src/faq-consolidation.mjs');
  for(const item of keywordMap.categories.intent){
    const question=escapeHtml(canonicalFaqQuestion(item.term));
    assert.ok(faq.includes(question)||serviceQuestionPages.includes(question),`missing intent or consolidated topic ${item.id}`);
  }
  for(const item of keywordMap.categories.question){
    const question=escapeHtml(canonicalFaqQuestion(item.term));
    assert.ok(faq.includes(question)||serviceQuestionPages.includes(question)||serviceAndAdviceCopy.includes(escapeHtml(item.term)),`missing knowledge question or consolidated topic ${item.id}`);
  }
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
    'structural-timber-repairs':['practitioner and approval checks','structural repairs may need engineering'],
  };
  for(const service of services){
    const file=path.join(dist,'services',service.slug,'index.html');
    const html=fs.readFileSync(file,'utf8');
    const route=`/services/${service.slug}/`;
    assert.ok(html.includes(`<h1>${escapeHtml(service.title)} in Canberra</h1>`),`${service.slug}: service-specific H1`);
    const serviceSchemas=pageSchemas.get(route)?.filter(schema=>schema['@type']==='Service')||[];
    assert.equal(serviceSchemas.length,1,`${service.slug}: one Service JSON-LD object`);
    assert.equal(serviceSchemas[0].name,`${service.title} in Canberra`,`${service.slug}: schema name matches visible heading`);
    assert.equal(serviceSchemas[0].description,service.intro,`${service.slug}: schema description matches visible intro`);
    assert.equal(new URL(serviceSchemas[0].url).pathname,route,`${service.slug}: schema URL matches route`);
    assert.deepEqual(serviceSchemas[0].provider,{'@id':'https://www.canberrawoodwork.com.au/#business'},`${service.slug}: schema provider references the canonical business`);
    const narrative=html.match(/<div class="detail-main service-narrative">([\s\S]*?)<aside class="detail-aside">/)?.[1]||'';
    const localNotes=html.match(/<section class="service-local-notes shell">([\s\S]*?)<\/section>/)?.[1]||'';
    const section=narrative+localNotes;
    assert.ok(section,`${service.slug}: visible deep-content section`);
    const installing=['deck-building','custom-joinery','interior-carpentry','skirting-and-architraves'].includes(service.slug);
    for(const heading of [`${escapeHtml(service.title)} in Canberra`,`${escapeHtml(service.title)}: ${installing?'installation':'repair'} method`,`Booking ${escapeHtml(service.title.toLowerCase())} in Canberra`]){
      assert.ok(section.includes(`<h2>${heading}</h2>`),`${service.slug}: visible ${heading} heading`);
    }
    assert.equal((section.match(/<h2>/g)||[]).length,3,`${service.slug}: three coherent narrative headings, not fragmented micro-sections`);
    assert.match(section,/<div class="related-work-links">[\s\S]*?<\/div>/,`${service.slug}: grouped related links`);
    assert.match(section,/optional[\s\S]*brian@elliservices\.com\.au/i,`${service.slug}: optional photos use the functioning email channel`);
    assert.doesNotMatch(section,/attach photos to the enquiry/i,`${service.slug}: no unsupported form attachment promise`);
    const deepLinks=[...section.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match=>match[1]);
    const relatedGroup=section.match(/<div class="related-work-links">([\s\S]*?)<\/div>/)?.[1]||'';
    const relatedServiceLinks=[...relatedGroup.matchAll(/<a\b[^>]*href="([^"]+)"/g)];
    assert.ok(relatedServiceLinks.length>=2&&relatedServiceLinks.length<=4,`${service.slug}: two to four related service links`);
    assert.ok(deepLinks.length>=2&&deepLinks.length<=7,`${service.slug}: bounded service, guide and area links`);
    assert.ok(section.length>1600,`${service.slug}: maintains substantial service-specific repair guidance`);
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
  const structural=fs.readFileSync(path.join(dist,'services','structural-timber-repairs','index.html'),'utf8');
  const deckBuilding=fs.readFileSync(path.join(dist,'services','deck-building','index.html'),'utf8');
  assert.doesNotMatch(structural,/does not define a repair design|does not claim a specific act construction licence|an ABN or general carpentry description does not establish/i,'structural page avoids discouraging licence disclaimers');
  assert.match(structural,/on-site assessment[\s\S]*identify the cause[\s\S]*repair plan and quote/i,'structural page explains Ellis Services Group\'s repair process positively');
  assert.doesNotMatch(deckBuilding,/does not state that a particular deck is exempt from approval|does not claim those permissions or a specific licence/i,'deck-building page avoids discouraging licence disclaimers');
  assert.match(deckBuilding,/New decks and extensions are planned around the site, intended use and any required ACT checks\./,'deck-building page states the service clearly');
  const {serviceDeepContent}=await import('../src/service-deep-content.mjs');
  const {serviceCaseMedia,homeCaseMedia}=await import('../src/service-case-media.mjs');
  assert.equal(homeCaseMedia.hero.src,'/assets/carpenter-at-work-canberra.webp','homepage hero uses the supplied Canberra work image');
  assert.equal(homeCaseMedia.deck.src,'/assets/completed-timber-deck-canberra.webp','homepage deck feature uses the supplied completed-deck image');
  assert.equal(homeCaseMedia.arrival.src,'/assets/carpenter-arrival-canberra.webp','homepage carousel includes the supplied on-site arrival image');
  assert.equal(homeCaseMedia.preparation.src,'/assets/carpenter-timber-preparation-canberra.webp','homepage carousel includes the supplied timber preparation image');
  assert.equal(Object.keys(serviceCaseMedia).length,17,'all seventeen service routes have supplied-image placements');
  assert.match(about,/measuring-timber-work-canberra\.webp/,'about page uses the supplied measurement work image');
  const themeCss=fs.readFileSync(path.join(dist,'assets','wood-theme.css'),'utf8');
  assert.match(themeCss,/\.about-visual img\{[^}]*height:clamp\(300px,30vw,460px\)[^}]*object-fit:cover/,'about work image has a bounded half-height desktop layout');
assert.match(themeCss,/\.business-registration-section\{[^}]*background:#fffdf9[^}]*border-top:3px solid #b56837/,'about registration panel uses the site warm-white and timber colour treatment');
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
    'timber-window-repairs':'/assets/timber-window-frame-repair-process.webp',
    'door-and-frame-repairs':'/assets/completed-timber-door-frame-detail.webp',
    'timber-fence-repairs':'/assets/timber-fence-completed.webp',
    'timber-gate-repairs':'/assets/timber-fence-installation-canberra.webp',
    'pergola-timber-repairs':'/assets/pergola-post-base-repair.webp',
    'fascia-and-eaves-repairs':'/assets/fascia-eaves-repair-process.webp',
  };
  for(const [slug,src] of Object.entries(suppliedMediaExpectations)){
    const html=fs.readFileSync(path.join(dist,'services',slug,'index.html'),'utf8');
    assert.ok(html.includes(`src="${src}"`),`${slug}: renders its new supplied work image`);
  }
  const fencePage=fs.readFileSync(path.join(dist,'services','timber-fence-repairs','index.html'),'utf8');
  assert.doesNotMatch(fencePage,/src="\/assets\/timber-fence-gate-canberra.webp"/,'fence gallery no longer repeats the gate cover');
  const gateCard=servicesIndex.match(/<a class="index-card" href="\/services\/timber-gate-repairs\/">[\s\S]*?<\/a>/)?.[0]||'';
  const fenceCard=servicesIndex.match(/<a class="index-card" href="\/services\/timber-fence-repairs\/">[\s\S]*?<\/a>/)?.[0]||'';
  assert.ok(gateCard.includes('/assets/timber-fence-gate-canberra.webp'),'gate card keeps its original cover');
  assert.ok(fenceCard.includes('/assets/timber-fence-completed.webp'),'fence card uses the supplied completed fence image');
  const deckBuildHtml=fs.readFileSync(path.join(dist,'services','deck-building','index.html'),'utf8');
  assert.ok(deckBuildHtml.includes('src="/assets/new-deck-completed-canberra.webp"'),'deck building: renders the supplied completed deck image');
  for(const image of Object.values(homeCaseMedia)){
    assert.ok(fs.existsSync(path.join(dist,image.src)),`home: publishes ${image.src}`);
  }
  for(const service of services){
    const serviceHtml=fs.readFileSync(path.join(dist,'services',service.slug,'index.html'),'utf8');
    assert.ok(serviceHtml.includes(escapeHtml(service.approach)),`${service.slug}: preserves original introductory approach copy`);
    assert.ok(serviceHtml.includes(escapeHtml(service.boundary)),`${service.slug}: preserves original scope note copy`);
    const entry=serviceDeepContent[service.slug];
    assert.ok(entry,`${service.slug}: deep-content data entry`);
    for(const key of ['scope','observations','assessment','boundary','canberraContext','enquiry'])assert.ok(typeof entry[key]==='string'&&entry[key].trim(),`${service.slug}: ${key} copy`);
    const uniqueCopy=new Set([service.approach,service.boundary,...['scope','observations','assessment','boundary','canberraContext','enquiry'].map(key=>entry[key])]);
    for(const copy of uniqueCopy){
      const count=serviceHtml.split(`<p>${escapeHtml(copy)}</p>`).length-1;
      assert.equal(count,1,`${service.slug}: each distinct service paragraph appears exactly once`);
    }
    assert.ok(Array.isArray(entry.relatedSlugs),`${service.slug}: relatedSlugs`);
  }
  const craftCss=fs.readFileSync(path.join(dist,'assets','craft-details.css'),'utf8');
  assert.doesNotMatch(craftCss,/\.home-hero\s+\.hero-orbit\s*\{[^}]*display\s*:\s*none/,'keeps original circular hero decoration visible');
  console.log(`Validated ${files.length} pages, internal links, metadata, JSON-LD and deep service content`);
}).catch(error=>{console.error(error);process.exitCode=1});
