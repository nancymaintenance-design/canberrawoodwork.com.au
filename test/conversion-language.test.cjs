const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
function pages(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e => e.isDirectory()?pages(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]); }
test('rendered repair pages provide a site-assessment route without deflection or internal editorial talk', () => {
  const files=pages(path.join(root,'dist')).filter(f=>!f.includes(path.sep+'privacy'+path.sep)&&!f.includes(path.sep+'404'+path.sep));
  for (const f of files) {
    const html=fs.readFileSync(f,'utf8');
    const text=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]+>/g,' ');
    assert.doesNotMatch(text,/That depends on the extent|can only be considered|cannot establish the cause|This page is a starting point|may require a broader assessment|another specialist|search engines|AI systems|JSON-LD|examples of repair questions, not descriptions/i,path.relative(root,f));
    assert.match(text,/on-site (?:assessment|measure)/i,path.relative(root,f)+': site visit');
    if (f.includes('skirting-after-new-flooring')) {
      assert.match(text,/installation plan and quote/i);
      assert.doesNotMatch(text,/identify the cause/i);
    }
    if (f.includes('carpentry-jobs-before-selling')) {
      assert.match(text,/on-site assessment/i);
      assert.match(text,/repair plan and quote/i);
    }
    assert.match(html,/href="\/contact\/"/,path.relative(root,f)+': contact route');
  }
});
