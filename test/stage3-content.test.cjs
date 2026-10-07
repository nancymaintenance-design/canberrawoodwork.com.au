const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
test('deck decision guide publishes three scopes, quotation checks and professional repair approach', () => {
  execFileSync(process.execPath, ['build.mjs'], { cwd: root, stdio: 'pipe' });
  const html = fs.readFileSync(path.join(root, 'dist/news/repair-or-rebuild-a-deck/index.html'), 'utf8');
  const main = html.match(/<main[\s\S]*?<\/main>/)[0];
  assert.match(html, /name="description" content="Ellis compares Canberra deck board repairs/);
  assert.ok(html.match(/name="description" content="([^"]+)"/)[1].length <= 170, 'concise decision-guide description');
  for (const p of [/local board repair/i, /frame and connection repairs/i, /rebuild/i, /written variation/i, /stop using/i, /From assessment to a written quote/, /Our written quote identifies/]) assert.match(main, p);
  assert.ok((main.match(/<details/g) || []).length >= 3, 'visible deck decision questions');
  for (const route of ['/services/deck-repairs/', '/services/deck-building/', '/news/deck-boards-or-frame/', '/news/why-timber-rot-returns/', '/contact/']) {
    assert.ok(main.includes(`href="${route}"`), route);
    assert.ok(fs.existsSync(path.join(root, 'dist', route, 'index.html')), route);
  }
  assert.doesNotMatch(main, /another trade|licensed practitioner|appropriate trade/i);
});
