import type {TemplateData,FeedNode,FeedItem,Service,FAQ,Article} from './types.mjs';
// Build-time extraction from this site's final, generated HTML. No runtime dependency.
const feedPath = '/feeds/llm-knowledge.json';
const feedTitle = 'Canberra Woodwork knowledge feed';
const blockPattern = /<script id="llm-knowledge-feed" type="application\/json">[\s\S]*?<\/script>/g;
const discoveryPattern = /<link rel="alternate" type="application\/feed\+json" title="Canberra Woodwork knowledge feed" href="\/feeds\/llm-knowledge.json">/g;
const namedEntities: Record<string,string> = {amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:'\u00a0',ndash:'–',mdash:'—',lsquo:'‘',rsquo:'’',ldquo:'“',rdquo:'”',hellip:'…',copy:'©',reg:'®',trade:'™',bull:'•',middot:'·',euro:'€',pound:'£',times:'×',deg:'°'};
const decode = (value: string) => value.replace(/&(#x[\da-f]+|#\d+|[a-z][a-z\d]+);/gi, (entity: any, code: string) => {
  if (!code.startsWith('#')) return namedEntities[code] ?? entity;
  const point = /^#x/i.test(code) ? parseInt(code.slice(2), 16) : Number(code.slice(1));
  return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff) ? String.fromCodePoint(point) : '\ufffd';
});
const escapeAttribute = (value: string) => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const serialize = (value: unknown) => JSON.stringify(value, null, 2).replaceAll('<','\\u003c').replaceAll('\u2028','\\u2028').replaceAll('\u2029','\\u2029');
const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);

// A small tokenizer for our generated markup, retaining nested element boundaries.
// Raw-text elements are consumed whole so their contents cannot become article text.
function parse(html: string) {
  const root: FeedNode = {tag:'root', attrs:{}, children:[]}, stack = [root];
  const tokens = /<!--[\s\S]*?-->|<(script|style)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>[\s\S]*?<\/\1\s*>|<\/?[a-z](?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
  let cursor = 0;
  for (const match of html.matchAll(tokens)) {
    stack!!.at(-1)!.children.push(html.slice(cursor, match.index));
    cursor = match.index + match[0].length;
    const token = match[0];
    if (token.startsWith('<!--')) continue;
    const tag = token.match(/^<\/?([a-z][\w-]*)/i)![1].toLowerCase();
    if (token.startsWith('</')) {
      for (let i = stack.length - 1; i > 0; i--) if (stack[i].tag === tag) {stack.length = i; break;}
      continue;
    }
    const attrs: Record<string,string> = {};
    const opening = token.match(/^<[a-z][\w-]*((?:[^"'<>]|"[^"]*"|'[^']*')*)>/i)![1];
    for (const attr of opening.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[attr[1].toLowerCase()] = decode(attr[2] ?? attr[3] ?? attr[4] ?? '');
    const node: FeedNode = {tag, attrs, children:[]};
    stack!!.at(-1)!.children.push(node);
    if (!voidTags.has(tag) && !['script','style'].includes(tag) && !token.endsWith('/>')) stack.push(node);
  }
  stack!!.at(-1)!.children.push(html.slice(cursor));
  return root;
}
const hasClass = (node: FeedNode, value: string) => node.attrs?.class?.split(/\s+/).includes(value);
function findAll(node: FeedNode, predicate: (node:FeedNode)=>boolean): FeedNode[] {
  if (!node || typeof node === 'string') return [];
  return [...(predicate(node) ? [node] : []), ...node.children.flatMap((child: any) => findAll(child, predicate))];
}
const find = (node: FeedNode, predicate: (node:FeedNode)=>boolean) => findAll(node, predicate)[0];
const ignored = (node: FeedNode) => ['script','style','nav','aside','footer'].includes(node.tag) || 'hidden' in node.attrs || node.attrs['aria-hidden'] === 'true' || /display\s*:\s*none|visibility\s*:\s*hidden/i.test(node.attrs.style || '');
function text(node: FeedNode): string {
  if (!node) return '';
  const collect = (entry: FeedNode|string): string => typeof entry === 'string' ? decode(entry) : ignored(entry) ? '' : entry.children.map(collect).join(' ');
  return collect(node).replace(/\s+/g,' ').trim();
}
const canonical = (document: FeedNode) => find(document, (node: FeedNode) => node.tag === 'link' && node.attrs.rel === 'canonical')?.attrs.href;
const absolute = (path: string, url: string) => new URL(path, url).href;

export function buildKnowledgeFeeds(finalPages: Map<string,string>, {name}: { name: string; }) {
  const pages = new Map(finalPages);
  const about = parse(pages.get('/about/') || '');
  const aboutUrl = canonical(about);
  if (!aboutUrl) throw new Error('Knowledge feed needs the final public about-page canonical URL');
  const homeUrl = absolute('/', aboutUrl);
  const aboutMain = find(about, (node: FeedNode) => node.tag === 'main');
  const description = text(find(aboutMain, (node: FeedNode) => node.tag === 'p' && !hasClass(node,'eyebrow')));
  const context = {name, url:homeUrl, about_url:aboutUrl, description};
  const items = [];
  for (const [route, html] of pages) {
    if (!/^\/news\/[^/]+\/$/.test(route)) continue;
    const document = parse(html);
    const prose = find(document, (node: FeedNode) => hasClass(node,'article-prose'));
    const hero = find(document, (node: FeedNode) => hasClass(node,'article-hero'));
    const url = canonical(document);
    if (!prose || !hero || !url) throw new Error(`Incomplete final article for knowledge feed: ${route}`);
    const byline = find(hero, (node: FeedNode) => hasClass(node,'article-byline'));
    const author = find(byline, (node: FeedNode) => node.tag === 'a');
    const dates = findAll(byline, (node: FeedNode) => node.tag === 'time').map((node: FeedNode) => node.attrs.datetime);
    const image = find(prose, (node: FeedNode) => node.tag === 'img')?.attrs.src;
    const related: {services:{title:string;url:string}[];projects:{title:string;url:string}[]} = {services:[],projects:[]};
    const article = find(document, (node: FeedNode) => node.tag === 'article');
    for (const anchor of findAll(article, (node: FeedNode) => node.tag === 'a' && !!node.attrs.href)) {
      const target = new URL(anchor.attrs.href, url);
      const kind = /^\/services\/[^/]+\/$/.test(target.pathname) ? 'services' : /^\/projects\/[^/]+\/$/.test(target.pathname) ? 'projects' : null;
      if (!kind || target.origin !== new URL(url).origin || !pages.has(target.pathname) || related[kind].some(link => link.url === target.href)) continue;
      related[kind].push({title:text(anchor),url:target.href});
    }
    const item: FeedItem = {id:url,url,title:text(find(hero, (node: FeedNode) => node.tag === 'h1')),summary:text(find(hero, (node: FeedNode) => node.tag === 'p' && !hasClass(node,'eyebrow'))),content_text:text(prose),language:'en-AU'};
    if (image) item.image = absolute(image,url);
    if (author) item.authors = [{name:text(author),url:absolute(author.attrs.href,url)}];
    if (dates[0]) item.date_published = `${dates[0]}T00:00:00Z`;
    if (dates[1]) item.date_modified = `${dates[1]}T00:00:00Z`;
    item._related = related;
    items.push(item);
  }
  const feed = {version:'https://jsonfeed.org/version/1.1',title:feedTitle,home_page_url:absolute('/news/',aboutUrl),feed_url:absolute(feedPath,aboutUrl),language:'en-AU',_business:context,items};
  for (const item of items) {
    const route = new URL(item.url).pathname;
    const html = pages!!.get(route)!.replace(blockPattern,'').replace(discoveryPattern,'');
    const discovery = `<link rel="alternate" type="application/feed+json" title="${escapeAttribute(feedTitle)}" href="${escapeAttribute(feedPath)}">`;
    const embedded = {...feed,items:[item]};
    pages.set(route,html.replace('</head>',`${discovery}</head>`).replace('</body>',`<script id="llm-knowledge-feed" type="application/json">${serialize(embedded)}</script></body>`));
  }
  return {feed,pages};
}
