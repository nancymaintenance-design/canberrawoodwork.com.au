import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { homeCaseMedia, serviceCaseMedia } from '../src/service-case-media.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = new URL('../dist/', import.meta.url);
const html = path => readFileSync(new URL(path, dist), 'utf8');
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([,key,value])=>[key,value]));
const images = text => [...text.matchAll(/<img\b[^>]*>/g)].map(([tag])=>attrs(tag));
const home = () => html('index.html');
const slides = () => [...home().matchAll(/<article class="work-carousel-slide[^>]*>([\s\S]*?)<\/article>/g)].map(([,body])=>images(body)[0]);

// Catches accidentally lazy-loading the first slide or omitting its no-JS fallback.
test('first carousel photo is responsive, eager and high priority with a real fallback', () => {
  const first = slides()[0];
  assert.equal(first.src, '/assets/carpenter-at-work-canberra.webp');
  assert.equal(first.srcset, '/assets/carpenter-at-work-canberra-400.webp 400w, /assets/carpenter-at-work-canberra-800.webp 800w, /assets/carpenter-at-work-canberra.webp 1440w');
  assert.equal(first.sizes, '(max-width:720px) 100vw, (max-width:809px) calc(100vw - 260px), 67.857143vw');
  assert.equal(first.fetchpriority, 'high');
  assert.equal(first.loading, 'eager');
  assert.equal(first.alt, 'Carpenter preparing timber on a Canberra residential work site');
  assert.equal(first.width, '1440');
  assert.equal(first.height, '810');
});

// Catches browser-discoverable network URLs on hidden slides before activation.
test('inactive carousel photos have only deferred source attributes', () => {
  const all = slides();
  assert.equal(all.length, 7);
  for (const image of all.slice(1)) {
    assert.equal(image.src, undefined);
    assert.equal(image.srcset, undefined);
    assert.ok(image['data-src']?.startsWith('/assets/'));
    assert.match(image['data-srcset'] || '', /-400\.webp 400w, .*?-800\.webp 800w, .*?\.webp 1440w$/);
    assert.ok(image.sizes);
    assert.notEqual(image.fetchpriority, 'high');
  }
});

// Catches missing responsive enhancement after later service-card injection,
// duplicate srcset attributes, changed descriptions and false width descriptors.
test('ordinary old photos keep their descriptions, dimensions and lazy delivery', () => {
  const page = html('services/door-and-frame-repairs/index.html');
  const detail = images(page).find(image=>image.src==='/assets/door-hinge-frame-detail-canberra.webp');
  assert.equal(detail.srcset, '/assets/door-hinge-frame-detail-canberra-400.webp 400w, /assets/door-hinge-frame-detail-canberra-800.webp 800w, /assets/door-hinge-frame-detail-canberra.webp 960w');
  assert.equal(detail.alt, 'Close view of a timber door hinge and frame');
  assert.equal(detail.width, '960');
  assert.equal(detail.height, '720');
  assert.equal(detail.loading, 'lazy');
  assert.equal(detail.decoding, 'async');
  const about = images(html('about/index.html')).find(image=>image.src==='/assets/measuring-timber-work-canberra.webp');
  assert.match(about.srcset || '', /measuring-timber-work-canberra-400\.webp 400w/);
  const card = images(html('services/index.html')).find(image=>image.class==='service-card-photo');
  assert.ok(card.srcset);
  for (const tag of [...page.matchAll(/<img\b[^>]*>/g)].map(([tag])=>tag)) {
    assert.ok([...tag.matchAll(/\bsrcset=/g)].length<=1);
  }
  const project = images(html('projects/mitchell-composite-deck/index.html')).find(image=>image.src?.includes('/projects/'));
  assert.match(project.srcset, /1448w$/);
});

test('all old photo variants exist in the output with smaller payloads', () => {
  const sources = new Set([...Object.values(homeCaseMedia), ...Object.values(serviceCaseMedia).flatMap(media=>media.images)].map(image=>image.src));
  sources.add('/assets/measuring-timber-work-canberra.webp');
  for (const source of sources) {
    const original = new URL(source.slice(1), dist);
    for (const width of [400,800]) {
      const variant = new URL(source.slice(1).replace('.webp', `-${width}.webp`), dist);
      assert.ok(existsSync(variant), `${source}: ${width}px variant is copied`);
      assert.ok(statSync(variant).size < statSync(original).size, `${source}: ${width}px is smaller`);
    }
  }
});

// Catches the original 177KB logo or favicon being shipped for tiny display slots.
test('header logo and Google-sized square favicon use small separate resources', () => {
  const logo = images(home()).find(image=>image.src?.includes('ellis-services-logo'));
  assert.equal(logo.src, '/assets/ellis-services-logo-small.webp');
  assert.equal(logo.width, '68');
  assert.equal(logo.height, '68');
  assert.ok(statSync(new URL(logo.src.slice(1),dist)).size < 177335 / 4);
  const icon = home().match(/<link rel="icon"[^>]*>/)?.[0];
  assert.equal(attrs(icon).href, '/assets/ellis-services-favicon-96.png');
  assert.equal(attrs(icon).sizes, '96x96');
  const bytes = readFileSync(new URL(attrs(icon).href.slice(1),dist));
  assert.equal(bytes.readUInt32BE(16), 96);
  assert.equal(bytes.readUInt32BE(20), 96);
  assert.ok(bytes.length < 177335 / 4);
  const ico = readFileSync(new URL('favicon.ico',dist));
  assert.equal(ico.readUInt16LE(2), 1, 'root fallback is an actual ICO file');
  assert.ok(existsSync(new URL('assets/ellis-services-logo.png',dist)));
});

const snapshot = (directory, prefix='') => readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
  const path=prefix+entry.name;
  return entry.isDirectory()?snapshot(new URL(`${entry.name}/`,directory),`${path}/`):[[path,createHash('sha256').update(readFileSync(new URL(entry.name,directory))).digest('hex')]];
});
test('dependency-free build reruns deterministically without changing contact code', () => {
  const before = snapshot(dist);
  const api = readFileSync(new URL('../api/contact.js',import.meta.url));
  const formCode = readFileSync(new URL('../public/assets/site.js',import.meta.url),'utf8').split("document.querySelectorAll('[data-carousel]')")[0];
  const result = spawnSync(process.execPath,['build.mjs'],{cwd:root,encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.deepEqual(snapshot(dist),before);
  assert.deepEqual(readFileSync(new URL('../api/contact.js',import.meta.url)),api);
  assert.equal(readFileSync(new URL('../public/assets/site.js',import.meta.url),'utf8').split("document.querySelectorAll('[data-carousel]')")[0],formCode);
});
