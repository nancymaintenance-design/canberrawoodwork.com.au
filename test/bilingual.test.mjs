import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {bilingualPages,sourceKey,transformPage,automaticText} from '../src/localization.mjs';
import {buildKnowledgeFeeds} from '../src/knowledge-feed.mjs';
import vm from 'node:vm';

const origin='https://www.canberrawoodwork.com.au';
const read=route=>readFileSync(`dist${route}index.html`,'utf8');
const routes=[...readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const originals=routes.filter(r=>!r.startsWith('/zh/'));
const schemas=html=>[...html.matchAll(/type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
const catalog=JSON.parse(readFileSync('src/locales/zh-Hans.json','utf8'));

test('every public English page has a complete Chinese page, same sections, FAQ and images',()=>{
  assert.equal(originals.length,51);assert.equal(routes.length,102);
  for(const route of [...originals,'/404/']){
    const en=read(route),zh=read('/zh'+route);
    assert.match(zh,/<html lang="zh-Hans">/);
    assert.equal((zh.match(/<h1[ >]/g)||[]).length,1);
    for(const pattern of [/<h2[ >]/g,/<h3[ >]/g,/<img\s/g,/<details\s/g])assert.equal([...zh.matchAll(pattern)].length,[...en.matchAll(pattern)].length,route);
    const ids=html=>[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
    assert.deepEqual(ids(zh),ids(en),`${route}: preserve fragments`);
    const images=html=>[...html.matchAll(/(?:src|data-src)="(\/assets\/[^"]+)"/g)].map(m=>m[1]);
    assert.deepEqual(images(zh),images(en));
    assert.match(zh,/href="tel:\+61405878406"/);assert.match(zh,/mailto:brian@elliservices.com.au/);
    assert.equal((zh.match(/data-keyword-ids=/g)||[]).length,(en.match(/data-keyword-ids=/g)||[]).length);
    assert.ok(/[\u3400-\u9fff]/.test(zh.match(/<h1[^>]*>(.*?)<\/h1>/s)[1]),route);
  }
  assert.equal((read('/zh/faq/').match(/class="faq-item"/g)||[]).length,107);
});

test('language links follow Contact, paired canonicals and reciprocal hreflang stay correct',()=>{
  for(const route of originals){
    for(const prefix of ['', '/zh']){
      const html=read(prefix+route),nav=html.match(/<nav id="main-nav"[\s\S]*?<\/nav>/)[0];
      assert.ok(nav.indexOf(`href="${prefix}/contact/"`)<nav.indexOf('data-language-switch'));
      assert.match(html,new RegExp(`rel="canonical" href="${origin+prefix+route}"`));
      assert.ok(html.includes(`hreflang="en-AU" href="${origin+route}"`));
      assert.ok(html.includes(`hreflang="zh-Hans" href="${origin+'/zh'+route}"`));
      assert.ok(html.includes(`hreflang="x-default" href="${origin+route}"`));
    }
    assert.ok(read(route).includes(`class="language-switch" href="/zh${route}"`));
    assert.ok(read('/zh'+route).includes(`class="language-switch" href="${route}"`));
  }
});

test('Chinese schema, social metadata and internal navigation use their matching locale',()=>{
  for(const route of originals){
    const html=read('/zh'+route),entries=schemas(html),en=schemas(read(route));
    assert.deepEqual(entries.map(s=>s['@type']),en.map(s=>s['@type']));
    assert.deepEqual(entries.find(s=>s['@type']==='HomeAndConstructionBusiness'),en.find(s=>s['@type']==='HomeAndConstructionBusiness'));
    const page=entries.find(s=>s['@id']===origin+'/zh'+route+'#webpage');
    assert.equal(page.inLanguage,'zh-Hans');
    const title=html.match(/<title>(.*?)<\/title>/s)[1];
    assert.ok(/[\u3400-\u9fff]/.test(title));
    assert.ok(html.includes('property="og:locale" content="zh_CN"'));
    assert.ok(html.includes(`property="og:url" content="${origin}/zh${route}"`));
    for(const match of html.matchAll(/<a\b[^>]*href="(\/[^"]+)"/g)){
      const href=match[1];
      assert.ok(href.startsWith('/zh/')||href.startsWith('/assets/')||match[0].includes('class="language-switch"'),`${route}: ${href}`);
    }
    if(route.startsWith('/news/')&&route!=='/news/'){
      const article=entries.find(s=>s['@type']==='Article');
      assert.equal(article.inLanguage,'zh-Hans');
      assert.equal(article.author.url,origin+'/zh/about/');
      assert.equal(article.datePublished,en.find(s=>s['@type']==='Article').datePublished);
    }
  }
});

test('strict catalog fails changed English or missing Chinese instead of silently falling back',()=>{
  const html='<html lang="en-AU"><head></head><body><nav id="main-nav"></nav><h1>A new service</h1></body></html>';
  const key=sourceKey('A new service');
  assert.throws(()=>bilingualPages(new Map([['/',html]]),{}, {origin}),/missing\/stale/);
  assert.throws(()=>bilingualPages(new Map([['/',html]]),{[key]:{en:'Older copy',zh:'旧内容'}},{origin}),/missing\/stale/);
  assert.ok(bilingualPages(new Map([['/',html]]),{[key]:{en:'A new service',zh:'新的服务'}},{origin}).get('/zh/').includes('新的服务'));
});

test('all final Chinese prose and accessible labels have approved local catalog values',()=>{
  for(const route of [...originals,'/404/']){
    transformPage(read(route),{text:value=>{
      if(automaticText(value)===null){
        assert.equal(catalog[sourceKey(value)]?.en,value,`${route}: source changed`);
        assert.ok(catalog[sourceKey(value)].zh?.trim(),value);
        assert.ok(!/__P\d+__|__T\d+__/.test(catalog[sourceKey(value)].zh),value);
      }return value;
    }});
  }
});

test('Chinese feed contains all 17 complete articles and is derived from the visible Chinese pages',()=>{
  const feed=JSON.parse(readFileSync('dist/zh/feeds/llm-knowledge.json','utf8'));
  assert.equal(feed.language,'zh-Hans');assert.equal(feed.items.length,17);
  const pages=new Map(routes.map(route=>[route,read(route)]));
  const regenerated=buildKnowledgeFeeds(pages,{name:'Ellis Services Group',prefix:'/zh',language:'zh-Hans'}).feed;
  assert.deepEqual(feed,regenerated);
  for(const item of feed.items){
    assert.ok(item.url.startsWith(origin+'/zh/news/'));assert.ok(/[\u3400-\u9fff]/.test(item.content_text));
    assert.ok(item.content_text.length>1000);
    assert.equal(item._related.services.length>0,true);
    assert.ok(item._related.services.every(link=>link.url.startsWith(origin+'/zh/services/')));
    const html=read(new URL(item.url).pathname);
    const embedded=JSON.parse(html.match(/id="llm-knowledge-feed" type="application\/json">([\s\S]*?)<\/script>/)[1]);
    assert.deepEqual(embedded.items,[item]);
  }
});

test('runtime UI messages require both languages and language switch preserves fragments',()=>{
  const switchLink={};
  const sandbox={window:{},document:{documentElement:{lang:'zh-Hans'},querySelectorAll:()=>[switchLink]},location:{hash:'#faq-cbr-c-151'}};
  vm.runInNewContext(readFileSync('public/assets/i18n.js','utf8'),sandbox);
  for(const pair of Object.values(sandbox.window.EllisMessages))assert.ok(pair.en&&pair.zh);
  assert.equal(sandbox.window.EllisLocale.t('faqCount',{count:3,total:107}),'共 107 个问题，显示 3 个');
  assert.equal(switchLink.hash,'#faq-cbr-c-151');
  assert.ok(existsSync('dist/assets/i18n.js'));
});
