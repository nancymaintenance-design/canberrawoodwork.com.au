import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read=route=>readFileSync(`dist${route}index.html`,'utf8');
const body=route=>read(route).match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
const decode=s=>s.replaceAll('&amp;','&');

test('home group destinations contain every enquiry service once in the same named group',()=>{
  const hub=body('/services/'),home=body('/');
  const groups=[...hub.matchAll(/<section class="service-group" id="([^"]+)">([\s\S]*?)<\/section>/g)];
  assert.ok(groups.length>=3,'directory exposes service groups');
  const selected=[];
  for(const [,id,group] of groups){
    const name=decode(group.match(/<h2>(.*?)<\/h2>/)[1]);
    assert.ok(home.includes(`href="/services/#${id}"`),'home group has a matching destination');
    const titles=[...group.matchAll(/<h3><a href="\/services\/[^/]+\/">(.*?)<\/a><\/h3>/g)].map(m=>decode(m[1]));
    assert.ok(titles.length>0);
    const contact=body('/contact/');
    const options=[...contact.matchAll(/<optgroup label="([^"]+)">([\s\S]*?)<\/optgroup>/g)].find(m=>decode(m[1])===name);
    assert.ok(options,`${name}: same group in enquiry`);
    assert.deepEqual([...options[2].matchAll(/<option[^>]*>(.*?)<\/option>/g)].map(m=>decode(m[1])),titles);
    selected.push(...titles);
  }
  assert.equal(selected.length,21);assert.equal(new Set(selected).size,21);
});

test('home introduces real projects before service directory and leaves the enquiry CTA last',()=>{
  const home=body('/');
  const proof=home.indexOf('id="home-projects"');
  assert.ok(proof>0&&proof<home.indexOf('id="home-services"'));
  assert.ok(home.includes('href="/projects/pearce-wardrobe-installation/"'));
  assert.match(home,/IKEA/);assert.match(home,/different.*projects/i);
  assert.ok(home.lastIndexOf('class="cta-panel"')>home.indexOf('id="home-services"'));
  for(const route of ['/','/services/','/news/','/projects/']){
    const nav=read(route).match(/<nav id="main-nav"[\s\S]*?<\/nav>/)[0];
    assert.match(nav,/<a href="\/projects\/"[^>]*>Projects<\/a>/);
    assert.match(nav,/<a href="\/news\/"[^>]*>Advice<\/a>/);
  }
});

test('advice topic links precede the complete compact seventeen-guide directory',()=>{
  const news=body('/news/');
  const index=news.match(/<nav class="topic-index"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(index,'advice starts with a topic index');
  const topics=[...news.matchAll(/<section class="advice-topic" id="([^"]+)">([\s\S]*?)<\/section>/g)];
  const destinations=[];
  for(const [,id,topic] of topics){
    assert.ok(index.includes(`href="#${id}"`));
    assert.ok(news.indexOf(index)<news.indexOf(topic));
    destinations.push(...[...topic.matchAll(/<h3><a href="([^"]+)">/g)].map(m=>m[1]));
  }
  assert.equal(destinations.length,17);assert.equal(new Set(destinations).size,17);
});
