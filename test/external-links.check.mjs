import test from 'node:test';
import assert from 'node:assert/strict';
const feature=await import('../src/customer-links.mts').catch(()=>null);
test('remove reference-only sections and notes; retain useful inline text and internal service links',()=>{
 assert.ok(feature,'customer link policy missing');
 const html='<main><section><h2>相关官方指导</h2><p><a href="https://www.woodsolutions.com.au/test">WoodSolutions</a></p></section><p class="source-note">指导：<a href="https://example.com">Guide</a></p><p>Use <a href="https://example.com">product instructions</a> for the selected material.</p><a href="/services/deck-repairs/">Deck repairs</a></main>';
 const result=feature.removeThirdPartyLinks(html);assert.ok(!result.includes('相关官方指导'));assert.ok(!result.includes('source-note'));assert.ok(!result.includes('example.com'));assert.ok(result.includes('product instructions'));assert.ok(result.includes('href="/services/deck-repairs/"'));
});
test('preserve only verified business-owned destinations, not any URL on a social platform',()=>{
 assert.ok(feature);
 const input='<a href="https://www.instagram.com/elliservices_group/">Our photos</a><a href="https://www.instagram.com/other-brand/">Other brand</a><a href="tel:+61405878406">Call</a>';
 const output=feature.removeThirdPartyLinks(input);assert.ok(output.includes('href="https://www.instagram.com/elliservices_group/"'));assert.ok(!output.includes('href="https://www.instagram.com/other-brand/"'));assert.ok(output.includes('tel:+61405878406'));
});
