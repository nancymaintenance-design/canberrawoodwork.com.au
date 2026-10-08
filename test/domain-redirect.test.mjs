import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const config=JSON.parse(readFileSync('vercel.json','utf8'));
const rule=config.redirects?.find(item=>item.has?.some(condition=>condition.type==='host' && condition.value==='canberrawoodwork.com.au'));
assert.ok(rule,'production apex has a source-controlled canonical host redirect');
assert.equal(rule.permanent,true,'permanent redirect retains HTTP method');
assert.equal(rule.source,'/:path*');
assert.equal(rule.destination,'https://www.canberrawoodwork.com.au/:path*');
// Check our rule contract, not pretend to emulate Vercel HTTP/TLS routing.
for(const pathname of ['/','/services/deck-repairs/','/sitemap.xml','/api/contact']) {
  const destination=rule.destination.replace(':path*',pathname.slice(1));
  assert.equal(destination,`https://www.canberrawoodwork.com.au${pathname}`,'retains the full requested path');
}
assert.ok(!rule.has.some(item=>['www.canberrawoodwork.com.au','localhost','127.0.0.1'].includes(item.value)),'no canonical host loop or preview redirect');
console.log('Canonical host rule verified; live HTTP chain still requires infrastructure verification');
