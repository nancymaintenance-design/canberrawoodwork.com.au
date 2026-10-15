// NODE_PATH points to the bundled Playwright runtime. No live requests or forms.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
const { chromium }=createRequire(import.meta.url)('playwright');
const root=resolve('dist');
const server=createServer((req,res)=>{
  if(process.env.BROWSER_DEBUG)console.log('HTTP',req.url);
  const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!path.startsWith(root)){res.writeHead(403).end();return;}
  try{const file=path.endsWith(extname(path))&&extname(path)?path:resolve(path,'index.html');res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png'})[extname(file)]||'application/octet-stream');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server','--host-resolver-rules=MAP www.google.com ~NOTFOUND']});
const evidence=process.env.BROWSER_EVIDENCE_DIR;
const results=[];
let failures=0;
async function check(name,run){if(process.env.BROWSER_CHECK&&!name.includes(process.env.BROWSER_CHECK))return;try{await run();results.push({name,pass:true});console.log(`PASS ${name}`);}catch(error){failures++;results.push({name,pass:false,error:error.message});console.error(`FAIL ${name}: ${error.message}`);}}
try{
  await check('mobile navigation remains available without JavaScript',async()=>{
    const context=await browser.newContext({viewport:{width:320,height:900},javaScriptEnabled:false});
    const page=await context.newPage();
    const html=readFileSync(resolve(root,'index.html'),'utf8');
    const styles=[...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map(m=>`<style>${readFileSync(resolve(root,'.'+m[1]),'utf8')}</style>`).join('');
    await page.setContent(`<html><head>${styles}${html.match(/<noscript>[\s\S]*?<\/noscript>/)?.[0]||''}</head><body>${html.match(/<header class="site-header">[\s\S]*?<\/header>/)[0]}</body></html>`);
    assert.ok(await page.locator('#main-nav').isVisible(),'navigation remains readable when scripts are unavailable');
    assert.ok(await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Projects',exact:true}).isVisible());
    assert.equal(await page.locator('.menu-toggle').isVisible(),false);
    await context.close();
  });
  for(const width of (process.env.BROWSER_WIDTHS||'320,390,1440').split(',').map(Number)){
    const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    const page=await context.newPage();
    if(process.env.BROWSER_DEBUG){page.on('requestfailed',request=>console.log('REQUEST FAILED',request.url(),request.failure()));page.on('console',message=>console.log('BROWSER',message.text()));}
    for(const route of ['/','/services/','/news/','/contact/','/service-areas/'])await check(`${route} fits ${width}px`,async()=>{
      await page.goto(base+route,{waitUntil:'domcontentloaded'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if(evidence){
        // Scroll as a reader would so below-fold lazy images are present in the evidence.
        await page.evaluate(async()=>{const height=document.documentElement.scrollHeight;for(let y=0;y<height;y+=700){scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,40));}scrollTo(0,0);await Promise.all([...document.images].filter(img=>img.hasAttribute('src')).map(img=>img.decode().catch(()=>{})));});
        await page.screenshot({path:resolve(evidence,`task1-${route==='/'?'home':route.split('/')[1]}-${width}.png`),fullPage:true});
        await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
        await page.screenshot({path:resolve(evidence,`task1-${route==='/'?'home':route.split('/')[1]}-${width}-viewport.png`)});
      }
      if(['/contact/','/service-areas/'].includes(route)&&width<600){
        const typography=await page.locator('.enquiry-form input:not([type="checkbox"]),.enquiry-form select,.enquiry-form textarea,.enquiry-form label,.enquiry-form .consent-field>span,.enquiry-form .consent-field a').evaluateAll(nodes=>nodes.map(el=>({tag:el.tagName,className:el.className,fontSize:parseFloat(getComputedStyle(el).fontSize)})));
        assert.deepEqual(typography.filter(node=>node.fontSize<16),[],'visible controls, labels, consent sentence and privacy link are at least 16px');
      }
    });
    if(width<600)await check(`menu closes with retained focus, Escape and reopen at ${width}px`,async()=>{
      await page.goto(base+'/',{waitUntil:'domcontentloaded'});const button=page.locator('.menu-toggle'),nav=page.locator('#main-nav');
      await button.click();assert.ok(await nav.isVisible());await button.click();
      assert.equal(await nav.isVisible(),false,'closed nav must be hidden while toggle retains focus');
      assert.ok(await button.evaluate(el=>document.activeElement===el));
      await button.click();await nav.locator('a').first().focus();await page.keyboard.press('Escape');
      assert.equal(await nav.isVisible(),false);assert.ok(await button.evaluate(el=>document.activeElement===el));
      await page.keyboard.press('Enter');assert.ok(await nav.isVisible());
    });
    await check(`carousel controls and reduced motion at ${width}px`,async()=>{
      await page.goto(base+'/',{waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('[data-carousel] [role="tab"]').count(),0);
      const controls=await page.locator('[data-carousel] button').evaluateAll(nodes=>nodes.map(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height})));
      assert.ok(controls.every(r=>r.width>=44&&r.height>=44),'every carousel button is at least 44px');
      assert.equal(await page.locator('[data-carousel-slide]').first().evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
      await page.locator('[data-carousel-next]').click();assert.equal(await page.locator('[data-carousel-slide]').nth(1).getAttribute('aria-hidden'),'false');
    });
    await context.close();
  }
  await check('carousel explicit pause persists through pointer, focus and manual navigation; resume advances',async()=>{
    const context=await browser.newContext({viewport:{width:1440,height:900}});
    const page=await context.newPage();await page.clock.install();await page.goto(base+'/',{waitUntil:'domcontentloaded'});
    const pause=page.locator('[data-carousel-pause]');assert.equal(await pause.count(),1,'explicit pause/resume button exists');
    await pause.click();await page.locator('[data-carousel-next]').click();
    await page.locator('h1').click();await page.mouse.move(1,1);await page.clock.runFor(14000);
    assert.equal(await page.locator('[data-carousel-slide]').nth(1).getAttribute('aria-hidden'),'false','manual pause survives all restart paths');
    await pause.click();await page.locator('h1').click();await page.mouse.move(1,1);await page.clock.runFor(7000);
    assert.equal(await page.locator('[data-carousel-slide]').nth(2).getAttribute('aria-hidden'),'false','resume restores rotation');
    await context.close();
  });
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));if(evidence)writeFileSync(resolve(evidence,'task1-browser-results.json'),JSON.stringify(results,null,2));}
if(failures)process.exitCode=1;
