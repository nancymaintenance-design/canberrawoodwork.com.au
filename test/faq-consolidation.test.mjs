import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { consolidateFaqs, faqMerges } from '../src/faq-consolidation.mjs';

const read = route => readFileSync(`dist/${route}/index.html`, 'utf8');
const questions = html => [...html.matchAll(/<details class="faq-item"><summary>(.*?)<\/summary><p>(.*?)<\/p>/g)];
const faq = read('faq');
assert.equal(questions(faq).length, 9, '15 general questions consolidate into nine distinct topics');
assert.ok(!faq.includes('<summary>Who takes on small carpentry jobs in Canberra?</summary>'));
assert.ok(faq.includes('waste disposal') && faq.includes('Additional findings') && faq.includes('before-and-after'));
for (const [slug,count] of Object.entries({
  'door-and-frame-repairs':9, 'deck-repairs':6, 'timber-fence-repairs':6,
  'timber-window-repairs':6, 'timber-weatherboard-repairs':2,
  'structural-timber-repairs':4, 'fascia-and-eaves-repairs':4,
  'pergola-timber-repairs':2, 'timber-gate-repairs':5, 'rotten-timber-repairs':4
})) assert.equal(questions(read(`services/${slug}`)).length,count,`${slug}: near-synonyms merged`);
const schema = [...faq.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
  .map(match=>JSON.parse(match[1])).find(item=>item['@type']==='FAQPage');
assert.deepEqual(schema.mainEntity.map(item=>[item.name,item.acceptedAnswer.text]),
  questions(faq).map(item=>[item[1].replaceAll('&amp;','&'),item[2].replaceAll('&amp;','&')]),
  'FAQ schema matches the consolidated visible questions and answers');
console.log('FAQ consolidation and schema verified');
const merge=faqMerges[0];
const originals=merge.questions.map(q=>({q,a:'original',owner:merge.owner,group:'Booking & quotes'}));
const distinct={q:'A distinct repair question?',a:'Unique advice.',owner:merge.owner};
const result=consolidateFaqs([...originals,distinct]);
assert.equal(result.length,2,'merges duplicates but retains unrelated advice');
assert.deepEqual(result[1],distinct);
assert.equal(originals[0].a,'original','does not rewrite source data');
assert.throws(()=>consolidateFaqs(originals.slice(1)),/Missing FAQ merge source/,'incomplete editorial groups cannot silently lose advice');
