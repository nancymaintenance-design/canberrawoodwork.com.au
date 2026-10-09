const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
test('local search content is rendered with district anchors and matching article schema', () => {
  execFileSync(process.execPath, ['build.mjs'], { cwd: root, stdio: 'pipe' });
  const read = route => fs.readFileSync(path.join(root, 'dist', route, 'index.html'), 'utf8');
  assert.match(read(''), /carpenter near me/i);
  const areas = read('service-areas');
  for (const district of ['Belconnen','Gungahlin','Inner North &amp; City','Inner South','Woden Valley','Weston Creek','Tuggeranong','Molonglo Valley','East Canberra']) {
    assert.ok(areas.includes(`Carpentry Services in ${district}`), district);
  }
  const article = read('news/pergola-post-rot');
  const headline = article.match(/<h1>(.*?)<\/h1>/s)[1];
  const schemas = [...article.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
  assert.equal(schemas.find(s=>s['@type']==='Article').headline, headline);
  assert.match(article, /replacement post|post replacement/i);
  assert.match(read('news'), /Timber Repair Advice/);
  assert.ok(read('').includes('hero-orbit orbit-one'));
  assert.equal((fs.readFileSync(path.join(root,'dist/sitemap.xml'),'utf8').match(/<loc>/g)||[]).length,39);
});
