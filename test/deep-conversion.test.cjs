const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

test('rendered enquiry channels and FAQ answers match the service customers request', () => {
  const read = route => fs.readFileSync(path.join(root, 'dist', route, 'index.html'), 'utf8');
  for (const route of ['contact', 'service-areas', 'services/deck-repairs']) {
    const html = read(route);
    assert.doesNotMatch(html, /type="file"|attach photos to the enquiry|Selected photos are not uploaded/i, route);
    assert.match(html, /mailto:brian@elliservices\.com\.au/, route);
    assert.match(html, /optional|if you have/i, route);
    if (route === 'contact' || route === 'service-areas') {
      assert.match(html, /name="message"[\s\S]*required/, route);
      assert.match(html, /action="\/api\/contact"/, route);
    } else {
      assert.match(html, /href="\/contact\/"/, route);
    }
  }
  const faq = read('faq');
  const schema = [...faq.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
    .map(match => JSON.parse(match[1])).find(item => item['@type'] === 'FAQPage');
  assert.equal(schema, undefined, 'FAQPage JSON-LD is absent');
  const visibleFaqs = [...faq.matchAll(/<details class="faq-item"><summary>(.*?)<\/summary><p>(.*?)<\/p>/g)]
    .map(match => ({ name: match[1], acceptedAnswer: { text: match[2] } }));
  assert.equal(visibleFaqs.length, 9, 'consolidated general questions and answers remain visible');
  const answers = visibleFaqs.map(item => item.acceptedAnswer.text);
  assert.equal(new Set(answers).size, answers.length, 'FAQ questions receive individual answers, not one generic service paragraph');
  // Service-specific answers now live on their service page, not general FAQ.
  const allAnswers = [...visibleFaqs, ...['door-and-frame-repairs','deck-building','small-carpentry-jobs'].flatMap(slug=>
    [...read('services/'+slug).matchAll(/<details class="faq-item"><summary>(.*?)<\/summary><p>(.*?)<\/p>/g)].map(m=>({name:m[1],acceptedAnswer:{text:m[2]}})))];
  const answer = term => allAnswers.find(item => item.name === term)?.acceptedAnswer.text || '';
  assert.match(answer('Do carpenters charge a call-out fee or a minimum booking fee?'), /confirm.*(?:fee|charge).*before/i);
  assert.match(answer('Can every internal door be trimmed at the bottom?'), /^No\./);
  assert.match(answer('Do development approval and building approval mean the same thing for a deck?'), /^No\./);
  assert.match(answer('What qualifications, insurance and licences should I check for my carpentry project?'), /licen[cs]e.*insurance|insurance.*licen[cs]e/i);
  assert.doesNotMatch(read('services/structural-timber-repairs'), /This page helps a homeowner gather useful information/i);
  assert.doesNotMatch(read('news/repair-or-rebuild-a-deck'), /It should also state what still needs confirmation/);
  for (const slug of ['deck-building','custom-joinery','interior-carpentry','skirting-and-architraves']) {
    const html = read('services/' + slug);
    const core = html.match(/<section class="keyword-scope shell">([\s\S]*?)<\/section>/)?.[1];
    assert.ok(core, slug);
    assert.doesNotMatch(core, /identify the cause|repair you need/i, slug);
    assert.match(core, /installation plan and quote/, slug);
    assert.match(html, /: installation method<\/h2>/);
    assert.match(html, /Booking .* in Canberra<\/h2>/);
    assert.doesNotMatch(html, /Discuss made-to-fit shelves|confirm your repair plan and quote/);
  }
  const installationGuide = read('news/skirting-after-new-flooring');
  assert.doesNotMatch(installationGuide, /identify the cause|repair plan and quote/i);
  assert.match(installationGuide, /installation plan and quote/);
});
