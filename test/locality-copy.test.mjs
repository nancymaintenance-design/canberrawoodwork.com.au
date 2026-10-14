import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=route=>readFileSync(`dist${route}index.html`,'utf8');
const h1=html=>html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1];

test('public locality wording keeps the home identity and uses topic-led FAQ and guide headings',()=>{
  assert.equal(h1(read('/')),'Canberra Carpentry & Timber Repairs');
  assert.match(h1(read('/faq/')),/Carpentry Questions/);
  for(const route of ['/faq/','/news/','/news/carpentry-quote-cost-factors/','/news/timber-vs-composite-decking-canberra/','/news/timber-deck-maintenance-canberra/'])assert.doesNotMatch(h1(read(route)),/Canberra/i,route);
});

test('near-me booking question retains provider criteria and a stable keyword deep link',()=>{
  const faq=read('/faq/');
  const small=faq.match(/<details[^>]*id="faq-cbr-c-151"[^>]*>([\s\S]*?)<\/details>/)[1];
  assert.match(small,/<summary>How can I find a carpenter near me for small timber repairs\?<\/summary>/);
  assert.match(small,/relevant timber repair experience/);
  assert.match(small,/qualifications[^.]*licences[^.]*work requires/i);
  assert.match(small,/written scope/);
  assert.match(small,/suburb[^.]*availability|availability[^.]*suburb/i);
  assert.doesNotMatch(faq,/<summary>[^<]*Canberra/);
});
