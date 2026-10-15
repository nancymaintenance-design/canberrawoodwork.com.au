const introductions = {
  '/services/':'Choose the timber item or installation to compare the work involved. For a mixed repair list, start with small carpentry jobs.',
  '/about/':'Ellis Services Group’s Canberra carpentry team repairs timber components and fits decks, interior trim and storage for homes across the ACT.',
  '/faq/':'Browse answers about booking, quotes, doors, windows, decks, fences and interior or exterior timber. Choose a topic or search for the affected item to find repair options and any specialist work needed.',
  '/news/':'Find a repair question, compare deck options or prepare your quote enquiry. These guides explain likely causes, safe observations and work to discuss with the team.',
  '/service-areas/':'Find your Canberra district below. The suburb lists help locate the work; the team arranges site visits from its Canberra office.',
  '/contact/':'Tell us your suburb and what needs attention. A description is enough to begin; safe photos can be emailed separately.',
  '/privacy/':'This policy explains the enquiry details Ellis Services Group receives, how those details are used and how to contact the company about them.'
};
const metas = {
  '/':'Canberra carpentry and timber repairs from Ellis Services Group. Explore doors, windows, outdoor timber and interior work, then arrange an on-site assessment.',
  '/services/':'Find the Ellis carpentry service for your timber item: doors, windows, decks, fences, trim and storage. Compare scopes and prepare your Canberra enquiry.',
  '/about/':'Identify Ellis Services Group, view company and Canberra contact details, and understand how assessment, repair scope and written quote are agreed.',
  '/faq/':'Canberra carpentry FAQ: booking, quotes, doors, windows, decks, fences, trim, storage and timber repairs. Compare options and specialist requirements.',
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
    output=output.replace(/<p class="hero-lead">[\s\S]*?<\/p>/,'<p class="hero-lead">Carpentry and timber repairs for Canberra homes, from doors and windows to decks and fitted storage.</p>');
    output=output.replace(/<p class="intro-large">[\s\S]*?<\/p>/,'<p class="intro-large">Choose a service by the timber item or the work you want done. Repairing an existing component starts with its condition and cause; a new installation starts with measurements, intended use and materials. Ellis confirms the proposed work and quote after the site visit.</p>');
    output=output.replace('Looking for a carpenter near me? Our Canberra office and carpentry team provide timber repairs, outdoor carpentry and interior installation across the ACT districts below. Tell us your suburb and the work you need to arrange an on-site assessment.','Browse the Canberra districts below and include your suburb when enquiring. Tell us about property access as well as the timber work, so the team can confirm the visit arrangements.');
  }
  if(route==='/services/'){
    output=output.replace('Tell us the work you need through the enquiry form or by phone. We identify the service and arrange an assessment; optional photos can be emailed separately.','Start with the affected component. The individual service explains what is checked, which repair or installation decisions matter and what to confirm in the quote. A mixed list can be assessed together through the small-jobs service.');
  }
  if(route==='/about/'){
    output=output.replace(/<p>Ellis Services Group has an independent Canberra office[\s\S]*?<div class="about-links">/,'<p>ELLIS SERVICES GROUP PTY LTD operates this website as Ellis Services Group. Our Canberra carpentry team handles enquiries, inspects or measures the requested work and prepares the proposed carpentry work and written quote.</p><p>For repairs, we check the damaged component and its connections before choosing adjustment or replacement. For a new deck or fitted storage, we measure the site and discuss the layout, materials and finish. The project records show composite deck construction, timber deck repairs and care, IKEA wardrobe fitting and separate under-stair installations.</p><p>An on-site assessment or measure establishes what to include in the quote: materials, replacement parts, fitting, finishing, access and disposal. Glazing, electrical, pest, asbestos and structural matters need the relevant qualified professionals. Their responsibilities must be agreed for the project, and additional findings are discussed before extra work proceeds.</p><div class="about-links">');
    output=output.replace('Our company details and Canberra office are shown here so you can identify who you are dealing with before a scope is agreed.','The official ABN record identifies the company. Ask for current qualifications, relevant licences and insurance evidence for the people carrying out your proposed work.');
    output=output.replace('Every project receives a clear written scope that sets out the repair work, materials, access and next steps before booking.','Confirm the qualifications, applicable licence requirements and insurance for the people carrying out the agreed work. These project checks sit alongside the written scope and company identity.');
    output=output.replace('<div class="about-links"><a href="/contact/">','<div class="about-links"><a href="/services/">Browse carpentry services ↗</a> · <a href="/faq/">Read booking and quote answers ↗</a> · <a href="/contact/">');
  }
  if(route==='/service-areas/'){
    output=output.replace('Find local carpentry services near you','Find your district');
    output=output.replace(/<h2>Book a carpenter in your suburb<\/h2><p>[\s\S]*?<\/p>/,'<h2>Confirm the suburb, task and access</h2><p>Include your suburb even if it is not listed. Describe the timber item or installation, parking and building entry, narrow side access and any permission needed to enter adjoining property. For tenanted or shared properties, name the authorised access contact. Arrange an on-site assessment or measure before agreeing the work and quote.</p>');
    output=output.replace('<p>Send the job details and your suburb to arrange your assessment. Our Canberra office is at 121 Marcus Clarke St, Canberra, ACT 2600.</p>','<p><a href="/contact/">Contact details</a> · <a href="/services/">Browse all services</a></p>');
  }
  if(route==='/contact/'){
    output=output.replace('<h2>Let’s make a start.</h2>','<h2>What happens after you enquire?</h2>');
    output=output.replace('Ellis provides timber repairs, door and window repairs, decks, fences, gates and interior finishing. Contact our team to arrange an assessment and quote.','The team discusses the task and access, arranges an on-site assessment or measure, then prepares the proposed work and quote. Confirm any visit charges before accepting an appointment.');
  }
  if(route==='/privacy/'){
    output=output.replace(/<h1>[\s\S]*?<\/h1>/,'<h1>Privacy Policy</h1>');
    output=output.replace('When you send an enquiry, we may collect your name, email address, phone number, property address, Canberra area, service request and the details you provide about the work.','The enquiry form asks for your name, email address and description of the work, together with your consent to be contacted about the request. You may also provide a phone number, property address, Canberra area and service of interest. We receive the details you choose to include in your message.');
    output=output.replace('The enquiry form collects text details. Photos are optional and can be emailed separately to our team; we use supplied photos and other material to assess and scope the requested work.','The form collects text details. Photos are optional and can be emailed separately; we use supplied photos and other material to discuss, assess and scope the requested work. Include only material relevant to your enquiry and avoid unnecessary personal information in photographs.');
    output=output.replace('call 0405 878 406','call <a href="tel:+611300838722">0405 878 406</a>');
  }
  // Keep page-schema descriptions aligned with the final rendered metadata.
  return output.replace(/<script type="application\/ld\+json">(.*?)<\/script>/gs,(match,json)=>{
    const schema=JSON.parse(json);
    if(!['WebPage','AboutPage','ContactPage','CollectionPage'].includes(schema['@type']))return match;
    schema.description=metas[route];
    return `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`;
  });
}
