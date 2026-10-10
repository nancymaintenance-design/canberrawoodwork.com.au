const introductions = {
  '/services/':'Choose the timber component or installation below to find its scope, assessment questions and related advice. If several items need attention, start with small carpentry jobs and describe the full list for an on-site assessment.',
  '/about/':'Ellis Services Group provides carpentry and timber repair services for Canberra homes. Find our company identity, contact channels and the process for agreeing work below.',
  '/faq/':'Find answers about enquiries, assessment, quote inclusions and appointments, then follow the relevant service for component-specific repair and installation questions.',
  '/news/':'Understand a timber problem before deciding on work. These guides explain likely causes, safe observations and repair choices; an on-site assessment establishes the condition and scope for your property.',
  '/service-areas/':'Use the district list to locate your Canberra suburb, then describe the timber item, requested work and access. Confirm the location and visit arrangements with the team when arranging an on-site assessment.',
  '/contact/':'Tell us the timber item, what needs attention and your Canberra suburb. Our team will discuss the request, arrange an on-site assessment or measure and confirm the proposed work and quote.',
  '/privacy/':'This policy explains the enquiry details Ellis Services Group receives, how those details are used and how to contact the company about them.'
};
const metas = {
  '/':'Canberra carpentry and timber repairs from Ellis Services Group. Explore doors, windows, outdoor timber and interior work, then arrange an on-site assessment.',
  '/services/':'Find the Ellis carpentry service for your timber item: doors, windows, decks, fences, trim and storage. Compare scopes and prepare your Canberra enquiry.',
  '/about/':'Identify Ellis Services Group, view company and Canberra contact details, and understand how assessment, repair scope and written quote are agreed.',
  '/faq/':'Answers about Canberra carpentry enquiries, photos, materials, quote inclusions and appointments, with links to detailed timber repair and installation questions.',
  '/news/':'Practical timber repair guides: understand door movement, deck supports, sill decay, fences, gates and interior finishes before planning the work.',
  '/service-areas/':'Find Canberra districts and suburb examples for your carpentry enquiry. Confirm the timber task, property access and visit arrangements with Ellis.',
  '/contact/':'Contact Ellis Services Group about Canberra carpentry. Describe the work, send optional photos by email and arrange assessment before a written quote.',
  '/privacy/':'How Ellis Services Group collects and uses enquiry details and optional emailed photos, with contact information for questions about your information.'
};
const escape = value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

export function enhanceHubEditorial(route,html){
  if(!metas[route])return html;
  let output=html.replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(metas[route])}">`);
  if(introductions[route])output=output.replace(/(<section class="page-hero shell">[\s\S]*?<h1>[\s\S]*?<\/h1>)<p>[\s\S]*?<\/p>/,`$1<p>${escape(introductions[route])}</p>`);
  if(route==='/'){
    output=output.replace(/<p class="hero-lead">[\s\S]*?<\/p>/,'<p class="hero-lead">Carpentry and timber repairs for Canberra homes: doors and windows, outdoor timber and interior finishing. Tell us what needs attention so the work starts with a clear scope.</p>');
    output=output.replace(/<p class="intro-large">[\s\S]*?<\/p>/,'<p class="intro-large">Choose a service by the timber item or the work you want done. Repairing an existing component starts with its condition and cause; a new installation starts with measurements, intended use and materials. Ellis confirms the proposed work and quote after the site visit.</p>');
    output=output.replace('Looking for a carpenter near me? Our Canberra office and carpentry team provide timber repairs, outdoor carpentry and interior installation across the ACT districts below. Tell us your suburb and the work you need to arrange an on-site assessment.','Browse the Canberra districts below and include your suburb when enquiring. Tell us about property access as well as the timber work, so the team can confirm the visit arrangements.');
  }
  if(route==='/services/'){
    output=output.replace('Tell us the work you need through the enquiry form or by phone. We identify the service and arrange an assessment; optional photos can be emailed separately.','Start with the affected component. The individual service explains what is checked, which repair or installation decisions matter and what to confirm in the quote. A mixed list can be assessed together through the small-jobs service.');
  }
  if(route==='/about/'){
    output=output.replace(/<p>Ellis Services Group has an independent Canberra office[\s\S]*?<div class="about-links">/,'<p>Ellis Services Group is the trading name shown on this website for ELLIS SERVICES GROUP PTY LTD. Our Canberra office and carpentry team contact details appear below, alongside the company registration information.</p><p>A repair begins with the component, its condition and the cause of the problem. A new installation begins with the space, intended use and material choices. We arrange an on-site assessment or measure and confirm the proposed work, access and written quote before work is agreed.</p><p>Ask the scope to identify supplied materials, retained and replaced parts, finishing and disposal. Where glazing, electrical, pest, asbestos or structural matters affect the job, the required qualified checks and responsibilities must be established for that project. Changes arising from additional findings are discussed before extra work proceeds.</p><div class="about-links">');
    output=output.replace('Our company details and Canberra office are shown here so you can identify who you are dealing with before a scope is agreed.','Use these details to identify the company handling your enquiry. The official ABN record is linked below; registration information alone does not establish qualifications for every type of building work.');
    output=output.replace('Every project receives a clear written scope that sets out the repair work, materials, access and next steps before booking.','Confirm the qualifications, applicable licence requirements and insurance for the people carrying out the agreed work. These project checks sit alongside the written scope and company identity.');
    output=output.replace('<div class="about-links"><a href="/contact/">','<div class="about-links"><a href="/services/">Find the service scope ↗</a> · <a href="/faq/">Read booking and quote answers ↗</a> · <a href="/contact/">');
  }
  if(route==='/faq/'){
    const choice='<section class="service-local-notes shell"><h2>Materials and repair choices</h2><h3>Can existing material or supplied items be used?</h3><p>The condition, dimensions, fixing points and available matching material determine what can be retained. Confirm supplied-item compatibility before ordering; see <a href="/services/skirting-and-architraves/">trim profile and finishing choices</a> and <a href="/services/cabinet-door-and-drawer-repairs/">cabinet hardware compatibility</a>.</p><h3>How do repair and replacement compare?</h3><p>A local repair retains suitable surrounding material. Connected damage or a changed layout can lead to a wider scope. Compare the retained parts, replacement extent, finish and access rather than a headline price alone. Read <a href="/news/repair-or-rebuild-a-deck/">how deck repair and rebuilding differ</a> or <a href="/services/timber-window-repairs/">what determines a timber window repair</a>.</p></section>';
    output=output.replace('<section class="faq-service-directory shell">',choice+'<section class="faq-service-directory shell">');
  }
  if(route==='/news/'){
    output=output.replace('<section class="news-index shell">','<section class="news-index shell"><h2>Choose a repair question</h2>');
    output=output.replace('Explore timber repair methods, replacement options and installation preparation. Each guide explains the affected components and links to the Ellis service for your work.','Use the topic groups to compare related questions. For assessment and quotation, follow the owner-service link in each guide or browse the <a href="/services/">carpentry service directory</a>.');
  }
  if(route==='/service-areas/'){
    output=output.replace('Find local carpentry services near you','Find your Canberra district');
    output=output.replace(/<h2>Book a carpenter in your Canberra suburb<\/h2><p>[\s\S]*?<\/p>/,'<h2>Confirm the suburb, task and access</h2><p>Include the suburb even if it is not one of the examples above. Describe the item, access restrictions, parking and any authorised property contact so the team can confirm the location and visit arrangements.</p>');
    output=output.replace('Send the job details and your Canberra suburb to arrange your assessment. Our Canberra office is at 121 Marcus Clarke St, Canberra, ACT 2600.','Use the form below or <a href="/contact/">contact Ellis directly</a>. If you are deciding which service fits, start with the <a href="/services/">component-based service directory</a>. The district list groups suburb examples; it does not list separate offices.');
  }
  if(route==='/contact/'){
    output=output.replace('<h2>Let’s make a start.</h2>','<h2>What happens after you enquire?</h2>');
    output=output.replace('Ellis provides timber repairs, door and window repairs, decks, fences, gates and interior finishing. Contact our team to arrange an assessment and quote.','The team reviews your description and contact details, discusses the task and access, then arranges the site visit. The written quote defines the proposed work, materials, finishing and price for you to review. Confirm any visit charges and appointment arrangements with the team.');
    output=output.replace('</p></div><form class="enquiry-form"','</p><p>Not sure how to name the job? Describe the item and what has changed, or use the <a href="/services/">service directory</a>. The <a href="/faq/">booking and quote answers</a> explain photos, scope and charges.</p></div><form class="enquiry-form"');
  }
  if(route==='/privacy/'){
    output=output.replace(/<h1>[\s\S]*?<\/h1>/,'<h1>Privacy Policy</h1>');
    output=output.replace('When you send an enquiry, we may collect your name, email address, phone number, property address, Canberra area, service request and the details you provide about the work.','The enquiry form asks for your name, email address and description of the work, together with your consent to be contacted about the request. You may also provide a phone number, property address, Canberra area and service of interest. We receive the details you choose to include in your message.');
    output=output.replace('The enquiry form collects text details. Photos are optional and can be emailed separately to our team; we use supplied photos and other material to assess and scope the requested work.','The form collects text details. Photos are optional and can be emailed separately; we use supplied photos and other material to discuss, assess and scope the requested work. Include only material relevant to your enquiry and avoid unnecessary personal information in photographs.');
    output=output.replace('call 0405 878 406','call <a href="tel:+61405878406">0405 878 406</a>');
  }
  // Keep page-schema descriptions aligned with the final rendered metadata.
  return output.replace(/<script type="application\/ld\+json">(.*?)<\/script>/gs,(match,json)=>{
    const schema=JSON.parse(json);
    if(!['WebPage','AboutPage','ContactPage','CollectionPage'].includes(schema['@type']))return match;
    schema.description=metas[route];
    return `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`;
  });
}
