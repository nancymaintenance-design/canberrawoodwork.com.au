import { business, services, faqs, articles, areas } from './content.mjs';
import { enhanceSearchContent } from './search-content.mjs';
import { serviceCaseMedia } from './service-case-media.mjs';
import { footerSocial } from './footer-social.mjs';
import { serviceDeepContent } from './service-deep-content.mjs';

const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const articleDescriptions = {
  'rotten-window-sill':'Learn how Ellis assesses rotten window sills, traces moisture entry and repairs damaged timber. Arrange a timber window repair assessment in Canberra.',
  'leaning-paling-fence':'Understand why a timber fence leans and how posts, rails and palings are repaired. Contact Ellis Services Group for a Canberra fence assessment.'
};
const captions = {
  'timber-fence-completed.webp':['Completed fence','The finished fence run with renewed posts, rails and timber palings.'],
  'timber-fence-before-repair.webp':['Before repair','Leaning fence sections and damaged lower palings before the repair work.'],
  'timber-fence-repair-process.webp':['Repair in progress','New timber rails are fitted and fixed to the fence posts.'],
  'timber-fence-connection-detail.webp':['Connection detail','A close view of the renewed rail-to-post connections and fixings.'],
  'water-damaged-window-sill-before.webp':['Before repair','Deteriorated paint and timber at an exposed opening.'],
  'deteriorated-timber-frame-before.webp':['Timber condition','Decay at the lower frame and sill junction.'],
  'timber-window-frame-repair-process.webp':['Repair in progress','Replacement timber is fitted and secured at the damaged opening.'],
  'completed-timber-door-frame-detail.webp':['Finished detail','Painted frame and threshold after timber repair.'],
  'timber-rot-removal-canberra.webp':['Repair in progress','Damaged exterior timber is removed to prepare the repair.'],
  'repaired-timber-detail-canberra.webp':['Finished detail','A repaired timber junction with a protective painted finish.'],
  'new-deck-framing-canberra.webp':['Construction','Deck framing and joists before the walking surface is installed.'],
  'new-deck-completed-canberra.webp':['Finished deck','Timber boards, edges and steps in the completed outdoor space.'],
  'fascia-eaves-repair-process.webp':['Repair in progress','Deteriorated timber at the roof edge is prepared for repair.'],
  'pergola-post-base-repair.webp':['Post repair detail','Renewed timber at the lower section of an outdoor post.'],
  'timber-fence-installation-canberra.webp':['Installation','Posts, fence panels and gate hardware being fitted on site.'],
  'small-carpentry-gate-before-after.webp':['Repair detail','Weathered and renewed sections of a timber side gate.'],
  'under-deck-timber-assessment.webp':['Structural inspection','Bearers, joists and connections below a timber deck.']
};
const picture = (item, className='service-card-photo') => `<img class="${className}" src="${item.src}" alt="${escape(item.alt)}" width="${item.width}" height="${item.height}" loading="lazy" decoding="async">`;
const questionMarkup = item => `<details class="faq-item"><summary>${escape(item.q)}</summary><p>${escape(item.a)}</p></details>`;

export function enhanceSite(route, html) {
  let output = html.replace('</head>','<link rel="stylesheet" href="/assets/craft-details.css"></head>');
  output = output.replaceAll('/assets/instagram.png','/assets/instagram-small.png');
  output = output.replace(/<a class="footer-instagram"[\s\S]*?<\/a>/, '');
  output = output.replace('<a href="/contact/">Request a quote</a></div></div><div class="shell footer-bottom">', `<a href="/contact/">Request a quote</a>${footerSocial()}</div></div><div class="shell footer-bottom">`);
  output = output.replaceAll('Canberra%20ACT%202601','Canberra%20ACT%202600');
  const id = route.split('/').filter(Boolean).at(-1);
  const description = route.startsWith('/services/') ? serviceDeepContent[id]?.meta : articleDescriptions[id];
  if (description) output = output.replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(description)}">`);

  if (route === '/') {
    output = output.replace('Practical timber repairs, outdoor carpentry and interior finishing—with a clear scope from the start.', 'Your local Canberra team for timber repairs, outdoor carpentry and interior finishing. Work planned carefully. Details finished properly.');
    const team = `<div class="team-signature"><span>Canberra office &amp; carpentry team</span><span>${escape(business.address)}</span><a href="${business.googleReviews}" target="_blank" rel="noopener noreferrer">Read our Google reviews ↗</a></div>`;
    output = output.replace('<span class="hero-orbit orbit-one"',`${team}<span class="hero-orbit orbit-one"`);
    output = output.replace('Good repairs begin<br>with the right questions.','Timber repairs.<br>Outdoor builds.<br>Interior details.');
    output = output.replace(/<p class="intro-large">[\s\S]*?<\/p>/, '<p class="intro-large">From restoring a timber window to building a deck, Ellis brings a dedicated Canberra carpentry team to your home. We assess the work, select the materials and finish the details that make the result work for you.</p>');
    const photos = ['door-and-frame-repairs','deck-repairs','skirting-and-architraves'].map(slug=>serviceCaseMedia[slug].images[0]);
    let index = 0;
    output = output.replace(/<span class="feature-icon"[^>]*>.*?<\/span>/g,()=>picture(photos[index++],'feature-photo'));
  }

  if (route === '/services/') {
    output = output.replace(/<a class="index-card" href="\/services\/([^/]+)\/">/g,(match,slug)=>match+picture(serviceCaseMedia[slug].images[0]));
  }

  const service = services.find(item=>route===`/services/${item.slug}/`);
  if (service) {
    // Keep every distinct source paragraph once, grouped into readable narratives.
    const content = serviceDeepContent[service.slug];
    const seen = new Set();
    const paragraphs = values => values.filter(value=>{
      const key=value.trim().replace(/\s+/g,' ');
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(value=>`<p>${escape(value)}</p>`).join('');
    const scope = paragraphs([content.scope,content.observations]);
    const plan = paragraphs([content.assessment,content.boundary]);
    const local = paragraphs([content.canberraContext,content.enquiry]);
    const main = `<div class="detail-main service-narrative"><div class="service-reading-block"><p class="eyebrow">SERVICE SCOPE</p><h2>${escape(content.headings[0])}</h2>${scope}<ul class="sign-list">${service.symptoms.map(value=>`<li>${escape(value)}</li>`).join('')}</ul></div><div class="service-reading-block"><h2>${escape(content.headings[1])}</h2>${plan}</div></div>`;
    output = output.replace(/<div class="detail-main">[\s\S]*?<\/div><aside class="detail-aside">/,`${main}<aside class="detail-aside">`);
    // Consolidation still chooses the visible questions; service edits can refine
    // the resulting merged answer without changing the shared FAQ hub.
    const questions = faqs.filter(item=>item.owner===service.slug).map(item=>({...item,a:content.faqAnswers?.[item.q] || item.a}));
    output = output.replace(/<div class="detail-block"><p class="eyebrow">COMMON QUESTIONS<\/p>[\s\S]*?<\/div>/,'');
    const installing = ['deck-building','custom-joinery','interior-carpentry','skirting-and-architraves'].includes(service.slug);
    const faqSection = `<section class="service-questions shell" id="service-questions"><p class="eyebrow">YOUR QUESTIONS ANSWERED</p><h2>${installing?'Installation':'Repair'} and quote questions</h2>${questions.map(questionMarkup).join('')}</section>`;
    const caseSection = output.match(/<section class="service-case-study shell"[\s\S]*?<\/section>/)?.[0] || '';
    const deepSection = output.match(/<section class="service-deep-content shell">[\s\S]*?<\/section>/)?.[0] || '';
    const relatedLinks = deepSection.match(/<div class="related-work-links">[\s\S]*?<\/div>/)?.[0] || '';
    const guides = content.guides.map(([slug,label])=>`<a class="text-link" href="/news/${slug}/">${escape(label)} ↗</a>`).join(' · ');
    const sources = (content.sources || []).map(([url,label])=>`<a href="${escape(url)}">${escape(label)}</a>`).join(' · ');
    const consolidated = `<section class="service-local-notes shell"><div class="service-reading-block"><h2>${escape(content.headings[2])}</h2>${local}</div><p>${guides}</p>${sources?`<p>${sources}</p>`:''}<nav aria-label="Related carpentry services">${relatedLinks}</nav></section>`;
    if (caseSection && deepSection) output = output.replace(caseSection+deepSection,consolidated+caseSection+faqSection);
    output = output.replace('<h2>Relevant timber details</h2>','<h2>Timber and connection details</h2>');
    if(installing) output = output.replace('<h2>Arrange your on-site assessment.</h2>','<h2>Arrange your on-site measure.</h2>');
    output = output.replace(`<p>${escape(service.intro)}</p>`,`<p>${escape(content.intro)}</p>`);
    output = output.replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(content.meta)}">`);
    output = output.replace(/<script type="application\/ld\+json">(.*?)<\/script>/gs,(match,json)=>{
      const schema=JSON.parse(json);
      if(!['Service','WebPage'].includes(schema['@type'])) return match;
      schema.description=schema['@type']==='Service'?content.intro:content.meta;
      return `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`;
    });
    // Research synonyms remain in the map, not an exhaustive public keyword list.
    output = output.replace(/<section class="keyword-scope shell">[\s\S]*?<\/section>/,'');
    output = output.replace(/<figure class="case-study-image ([^"]+)">(<img[^>]+>)<\/figure>/g,(match,cls,img)=>{
      const filename = img.match(/src="[^"/]+(?:\/[^"/]+)*\/([^"/]+)"/)?.[1] || img.match(/src=".*\/([^"/]+)"/)?.[1];
      const item = serviceCaseMedia[service.slug].images.find(image=>image.src.endsWith(filename));
      const [label,copy] = captions[filename] || ['Work detail',item?.alt || service.title];
      return `<figure class="case-study-image ${cls}">${img}<figcaption><span>${escape(label)}</span><p>${escape(copy)}</p></figcaption></figure>`;
    });
  }

  if (route === '/faq/') {
    const general = faqs.filter(item=>item.group==='Booking & quotes');
    const directory = `<section class="faq-service-directory shell"><p class="eyebrow">SERVICE QUESTIONS</p><h2>Answers for the work you need</h2><p>Find detailed repair and installation answers on the relevant service page.</p><div class="faq-service-links">${services.map(item=>`<a href="/services/${item.slug}/#service-questions">${escape(item.title)} <span aria-hidden="true">↗</span></a>`).join('')}</div></section>`;
    output = output.replace(/<section class="faq-layout shell">[\s\S]*?<\/section><section class="cta-panel">/,`<section class="general-questions shell"><p class="eyebrow">BOOKING &amp; QUOTES</p><h2>Working with Ellis Services Group</h2>${general.map(questionMarkup).join('')}</section>${directory}<section class="cta-panel">`);
    output = output.replace(/<script type="application\/ld\+json">(.*?)<\/script>/g,(match,json)=>{
      const schema = JSON.parse(json);
      if(schema['@type']!=='FAQPage') return match;
      schema.mainEntity = general.map(item=>({'@type':'Question',name:item.q,acceptedAnswer:{'@type':'Answer',text:item.a}}));
      return `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`;
    });
  }
  return enhanceSearchContent(route, output, { services, articles, areas });
}
