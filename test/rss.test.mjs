import test from 'node:test';
import assert from 'node:assert/strict';
import {renderRss,addRssDiscovery} from '../src/rss-feed.mts';
const origin='https://www.canberrawoodwork.com.au';
const item={id:'stable-id',url:origin+'/news/test/',title:'Timber & 木工 <repair>',summary:'A & B',content_text:'木材 & repairs <safe>'};
const feed={title:'Woodwork & 木工',home_page_url:origin+'/news/',language:'en-AU',items:[item]};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const html=i=>`<html><head><link rel="canonical" href="${i.url}"></head><body><h1>${esc(i.title)}</h1><div class="article-prose">${esc(i.content_text)}</div></body></html>`;
test('RSS preserves Chinese, escapes XML, retains GUID, omits unknown dates and is deterministic',()=>{
 const a=renderRss(feed,'',()=>html(item));assert.equal(a,renderRss(feed,'',()=>html(item)));
 assert.match(a,/encoding="UTF-8"/);assert.match(a,/Timber &amp; 木工 &lt;repair&gt;/);assert.match(a,/<guid isPermaLink="false">stable-id<\/guid>/);assert.doesNotMatch(a,/<pubDate>|lastBuildDate/);
 assert.match(a,/href="https:\/\/www.canberrawoodwork.com.au\/rss.xml" rel="self"/);
});
test('added, edited and withdrawn final JSON entries are reflected without changing IDs',()=>{
 const added={...item,id:'another',url:origin+'/news/another/'};
 const a=renderRss({...feed,items:[item,added]},'',route=>html(route.includes('another')?added:item));assert.equal((a.match(/<item>/g)||[]).length,2);
 const edited={...item,title:'Updated title'};const b=renderRss({...feed,items:[edited]},'',()=>html(edited));assert.match(b,/Updated title/);assert.match(b,/>stable-id<\/guid>/);assert.doesNotMatch(b,/>another<\/guid>/);
 assert.doesNotMatch(renderRss({...feed,items:[]},'',()=>{throw Error('no page expected');}),/<item>/);
});
test('drafts and noindex pages are excluded; duplicate IDs, foreign URLs and stale HTML fail',()=>{
 assert.doesNotMatch(renderRss({...feed,items:[{...item,_draft:true}]},'',()=>{throw Error('draft read');}),/<item>/);
 assert.doesNotMatch(renderRss(feed,'',()=>html(item).replace('</head>','<meta name="robots" content="noindex"></head>')),/<item>/);
 assert.throws(()=>renderRss({...feed,items:[item,item]},'',()=>html(item)),/duplicate/);
 assert.throws(()=>renderRss({...feed,items:[{...item,url:'https://example.com/news/test/'}]},'',()=>html(item)),/canonical/);
 assert.throws(()=>renderRss(feed,'',()=>html({...item,title:'Stale'})),/differs/);
 assert.throws(()=>renderRss(feed,'',()=>html(item).replace(item.url,origin+'/news/wrong/')),/canonical differs/);
});
test('only genuine publication dates are used; bilingual URLs and discovery remain separate',()=>{
 const dated={...item,date_published:'2026-09-28T00:00:00Z'};assert.match(renderRss({...feed,items:[dated]},'',()=>html(item)),/<pubDate>Mon, 28 Sep 2026 00:00:00 GMT<\/pubDate>/);
 assert.doesNotMatch(renderRss({...feed,items:[{...item,date_published:'unknown'}]},'',()=>html(item)),/<pubDate>/);
 const zh={...item,id:'zh-stable',url:origin+'/zh/news/test/'};
 assert.match(renderRss({...feed,language:'zh-Hans',home_page_url:origin+'/zh/news/',items:[zh]},'/zh',()=>html(zh)),/\/zh\/rss.xml/);
 assert.throws(()=>renderRss(feed,'/zh',()=>html(item)),/canonical/);
 const base=html(zh),result=addRssDiscovery(base,'/zh');assert.equal(addRssDiscovery(result,'/zh'),result);assert.equal(result.slice(result.indexOf('<body>')),base.slice(base.indexOf('<body>')));
 assert.throws(()=>addRssDiscovery(result,''),/Conflicting/);
});
