import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = slug => readFileSync(`dist/services/${slug}/index.html`, 'utf8');
// Removing a component distinction or replacing the service with generic copy must fail.
const topics = {
  'small-carpentry-jobs': [/one task per line/i, /minimum.*charge|charge.*minimum/i, 'carpentry-jobs-before-selling'],
  'door-and-frame-repairs': [/hinge.*jamb|jamb.*hinge/i, /trimming allowance/i, 'timber-door-sticks-after-rain'],
  'timber-window-repairs': [/sill.*drip|drip.*sill/i, /glazier/i, 'rotten-window-sill'],
  'rotten-timber-repairs': [/sound timber/i, /moisture source/i, 'why-timber-rot-returns'],
  'fascia-and-eaves-repairs': [/bargeboard.*gable|gable.*bargeboard/i, /lining material/i, 'fascia-bargeboard-eaves'],
  'deck-repairs': [/joists.*bearers|bearers.*joists/i, /sanding and oiling/i, 'deck-boards-or-frame'],
  'timber-fence-repairs': [/posts.*rails.*palings/i, /cost.sharing/i, 'leaning-paling-fence'],
  'timber-gate-repairs': [/post.*hinge|hinge.*post/i, /motorised/i, 'why-timber-gates-sag'],
  'skirting-and-architraves': [/height.*thickness|thickness.*height/i, /floor.*junction|junction.*floor/i, 'skirting-after-new-flooring'],
  'cabinet-door-and-drawer-repairs': [/part number/i, /particleboard|MDF/i, 'cabinet-hinges-and-drawer-runners'],
  'interior-carpentry': [/shelf.*load|load.*shelf/i, /concealed services/i, 'skirting-after-new-flooring'],
  'timber-weatherboard-repairs': [/profile and lap/i, /backing/i, 'timber-weatherboard-damage'],
  'timber-stair-and-handrail-repairs': [/tread.*support|support.*tread/i, /anchorage/i, 'loose-timber-stairs'],
  'pergola-timber-repairs': [/post.*beam|beam.*post/i, /footing/i, 'pergola-post-rot'],
  'custom-joinery': [/manufactur/i, /clearance/i, 'cabinet-hinges-and-drawer-runners'],
  'structural-timber-repairs': [/termite.*treatment|treatment.*termite/i, /engineering/i, 'why-timber-rot-returns'],
  'deck-building': [/footprint/i, /development.*building approval/i, 'repair-or-rebuild-a-deck'],
};

test('service headings describe decisions without repeating the H1 or a keyword catalogue', () => {
  for (const slug of Object.keys(topics)) {
    const html = read(slug);
    const h1 = html.match(/<h1>(.*?)<\/h1>/s)[1];
    const headings = [...html.matchAll(/<h2>(.*?)<\/h2>/gs)].map(m => m[1]);
    assert.ok(!headings.includes(h1), `${slug}: H1 must not repeat as H2`);
    assert.ok(!html.includes('class="keyword-scope shell"'), `${slug}: remove exhaustive keyword catalogue`);
    assert.ok(!headings.some(h => h.includes(': repair method') || h.includes(': installation method')), slug);
    assert.equal((html.match(/<h1>/g) || []).length, 1);
  }
});

test('all seventeen services connect component decisions, quote scope and a relevant guide', () => {
  for (const [slug, [component, boundary, guide]] of Object.entries(topics)) {
    const html = read(slug);
    const narrative = html.match(/<div class="detail-main service-narrative">([\s\S]*?)<aside/)[1]
      + html.match(/<section class="service-local-notes shell">([\s\S]*?)<\/section>/)[1];
    assert.match(narrative, component, `${slug}: specific component decision`);
    assert.match(narrative, boundary, `${slug}: relevant material or scope limit`);
    assert.match(narrative, /quote/i, `${slug}: scoped quote`);
    assert.ok(html.includes(`href="/news/${guide}/"`), `${slug}: relevant guide`);
    assert.ok(existsSync(`dist/news/${guide}/index.html`));
    for (const link of ['/contact/', 'tel:+61405878406', 'mailto:brian@elliservices.com.au']) {
      assert.ok(html.includes(`href="${link}"`), `${slug}: ${link}`);
    }
    assert.match(html, /id="service-questions"/);
    assert.doesNotMatch(html, /"@type":"FAQPage"/);
    assert.match(html, /"provider":\{"@id":"https:\/\/www.canberrawoodwork.com.au\/#business"\}/);
  }
});

test('safety boundaries do not promise third-party coordination or unsupported qualifications', () => {
  for (const slug of Object.keys(topics)) {
    const html = read(slug);
    const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
    assert.doesNotMatch(main, /(?:our team |Ellis |we )(?:arranges?|coordinates?).{0,60}(?:qualified|pest|roof|plumb|engineering)|are coordinated|through (?:the required |confirmed )qualified|qualified service arrangements/i, slug);
  }
  assert.ok(read('fascia-and-eaves-repairs').includes('href="https://www.accesscanberra.act.gov.au/business-and-work/building-and-construction/asbestos-assessor-and-removal-licensing"'));
  assert.ok(read('deck-building').includes('href="https://www.planning.act.gov.au/applications-and-assessments/building-approvals/check-if-you-need-a-ba"'));
});

test('window FAQ defines glass retention as a glazing decision', () => {
  const html = read('timber-window-repairs');
  const answer = html.match(/<summary>Can you repair the timber frame while keeping the existing glass\?<\/summary><p>(.*?)<\/p>/s)?.[1];
  assert.ok(answer, 'existing visible question is retained');
  assert.match(answer, /glazier/i, 'glass removal or replacement has an explicit trade boundary');
  assert.match(answer, /condition|access/i, 'retention depends on glass condition and repair access');
});
