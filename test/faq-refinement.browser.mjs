// Local rendered-page checks; NODE_PATH uses the bundled Playwright runtime.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
const { chromium }=createRequire(import.meta.url)('playwright');
const root=resolve('dist');
const server=createServer((req,res)=>{
  if(process.env.BROWSER_DEBUG)console.log('HTTP',req.url);
  const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!path.startsWith(root+sep)){res.writeHead(403).end();return;}
  try{const file=extname(path)?path:resolve(path,'index.html');res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png'})[extname(file)]||'application/octet-stream');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
if(process.env.BROWSER_DEBUG)console.log('Launching Chrome',base);
const browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server','--host-resolver-rules=MAP www.google.com ~NOTFOUND']});
if(process.env.BROWSER_DEBUG)console.log('Chrome ready');
const results=[], geometries=[], evidence=process.env.BROWSER_EVIDENCE_DIR;
async function check(name,run){if(process.env.BROWSER_CHECK&&!name.includes(process.env.BROWSER_CHECK))return;try{await run();results.push({name,pass:true});console.log(`PASS ${name}`);}catch(error){results.push({name,pass:false,error:error.message});console.error(`FAIL ${name}: ${error.message}`);}}
try{
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(5000);page.setDefaultNavigationTimeout(20000);
  if(process.env.BROWSER_DEBUG)console.log('FAQ page ready');
  if(process.env.BROWSER_DEBUG){page.on('requestfailed',r=>console.log('FAILED',r.url(),r.failure()));page.on('console',m=>console.log('CONSOLE',m.text()));}
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/faq/',{waitUntil:'domcontentloaded'});
  await check('filter finds closed answer text, normalizes case and whitespace, and updates topic counts',async()=>{
    const input=page.getByRole('searchbox',{name:'Find a question'});
    assert.ok(await input.isVisible(),'progressive filter is available');
    await input.fill('Does Ellis install composite decking?');
    assert.equal(await page.locator('.faq-item:visible').count(),1,'question text is searchable');
    await input.fill('  COMPONENT   SUITABILITY  ');
    assert.equal(await page.locator('.faq-item:visible').count(),1);
    assert.match(await page.locator('.faq-item:visible summary').innerText(),/IKEA/);
    assert.equal(await page.locator('.faq-item:visible').getAttribute('open'),null,'typing does not force answers open');
    assert.equal(await page.locator('.faq-group:visible').count(),1);
    assert.equal(await page.locator('.faq-topic-count').allTextContents().then(xs=>xs.reduce((a,n)=>a+Number(n),0)),1);
    assert.match(await page.getByRole('status').innerText(),/1 of 107 questions/);
    await input.fill('nothing-matches-zzxyz');
    assert.equal(await page.locator('.faq-group:visible').count(),0);
    assert.equal(await page.locator('.faq-topic-links [aria-current]').count(),0);
    assert.ok(await page.getByText('No questions match. Try a different word or clear the filter.').isVisible());
    assert.match(await page.getByRole('status').innerText(),/0 of 107 questions/);
    await page.getByRole('button',{name:'Clear filter'}).click();
    assert.equal(await page.locator('.faq-item:visible').count(),107);
    assert.equal(await input.inputValue(),'');assert.ok(await input.evaluate(el=>document.activeElement===el));
    assert.equal(await page.locator('.faq-group:visible').count(),6);
    await input.fill('   ');assert.equal(await page.locator('.faq-item:visible').count(),107);
  });
  await check('secondary research fragments clear an incompatible filter and open the original disclosure',async()=>{
    await page.getByRole('searchbox',{name:'Find a question'}).fill('nothing-matches-zzxyz');
    await page.evaluate(()=>{location.hash='faq-cbr-c-288';});
    await page.waitForFunction(()=>document.querySelector('#faq-cbr-c-179').open);
    assert.equal(await page.getByRole('searchbox',{name:'Find a question'}).inputValue(),'');
    assert.equal(await page.locator('.faq-item:visible').count(),107);
    assert.equal(await page.locator('#faq-cbr-c-288').count(),1);
    assert.equal(await page.locator('#faq-cbr-c-288').evaluate(el=>el.closest('details').id),'faq-cbr-c-179');
    assert.deepEqual(errors,[],'zero matches never breaks scrollspy');
  });
  await check('clicking the current topic restores it when a filter hides every answer',async()=>{
    await page.evaluate(()=>{location.hash='booking-and-quotes';});
    await page.waitForTimeout(100);
    await page.getByRole('searchbox',{name:'Find a question'}).fill('nothing-matches-zzxyz');
    await page.locator('.faq-topic-links a[href="#booking-and-quotes"]').click();
    assert.equal(await page.locator('.faq-item:visible').count(),107);
    assert.ok(await page.locator('#booking-and-quotes').isVisible());
  });
  await context.close();
  for(const [width,height] of [[390,600],[320,700],[1440,900]]){
    await check(`FAQ navigation, keyboard and fragment geometry at ${width}x${height}`,async()=>{
      const ctx=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
      const p=await ctx.newPage();p.setDefaultTimeout(5000);
      try{
        await p.goto(base+'/faq/#faq-cbr-c-288',{waitUntil:'domcontentloaded'});
        await p.waitForFunction(()=>document.querySelector('#faq-cbr-c-179').open);
        await p.waitForTimeout(150);
        assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal page overflow');
        const geometry=await p.evaluate(()=>{const h=document.querySelector('.site-header').getBoundingClientRect(),n=document.querySelector('.faq-topic-nav').getBoundingClientRect(),q=document.querySelector('#faq-cbr-c-179').getBoundingClientRect();return {header:h.height,rail:n.height,railTop:n.top,questionTop:q.top};});
        geometries.push({width,height,...geometry});
        if(width<700){assert.ok(geometry.header+geometry.rail>=120&&geometry.header+geometry.rail<=140,JSON.stringify(geometry));assert.ok(geometry.railTop>=geometry.header-1);assert.ok(geometry.questionTop>=geometry.header+geometry.rail);}
        if(evidence)await p.screenshot({path:resolve(evidence,`task2-faq-${width}-alias.png`)});
        const summary=p.locator('#faq-cbr-c-179 summary');await summary.focus();
        await p.keyboard.press('Enter');assert.equal(await p.locator('#faq-cbr-c-179').getAttribute('open'),null);
        await p.keyboard.press('Enter');assert.notEqual(await p.locator('#faq-cbr-c-179').getAttribute('open'),null);
        if(width<700){
          await p.locator('.menu-toggle').click();assert.ok(await p.locator('#main-nav').isVisible());
          const menu=await p.locator('#main-nav').boundingBox();assert.ok(menu.y>=0&&menu.y+menu.height<=height,'menu fits viewport');
          if(evidence)await p.screenshot({path:resolve(evidence,`task2-faq-${width}-menu.png`)});
          await p.locator('#main-nav a').last().focus();await p.keyboard.press('Escape');assert.equal(await p.locator('#main-nav').isVisible(),false);
          assert.ok(await p.locator('.menu-toggle').evaluate(el=>document.activeElement===el));
          await p.locator('.faq-topic-links a').last().focus();await p.keyboard.press('Enter');
          await p.waitForTimeout(100);assert.equal(await p.locator('.faq-topic-links a[aria-current]').getAttribute('href'),'#rot-and-exterior-timber');
          assert.ok(await p.locator('#rot-and-exterior-timber').evaluate(el=>el.getBoundingClientRect().top>=parseFloat(getComputedStyle(document.body).getPropertyValue('--faq-header-height'))+parseFloat(getComputedStyle(document.body).getPropertyValue('--faq-topic-height'))));
        }
        if(evidence)await p.screenshot({path:resolve(evidence,`task2-faq-${width}-fragment.png`)});
        await p.goto(base+'/faq/',{waitUntil:'domcontentloaded'});
        if(width<700){const search=await p.getByRole('searchbox',{name:'Find a question'}).boundingBox();assert.ok(search.y+search.height<=height,'keyword input is available in the entry viewport');}
        if(evidence)await p.screenshot({path:resolve(evidence,`task2-faq-${width}-entry.png`)});
        if(width<700){await p.evaluate(()=>scrollTo({top:130,behavior:'instant'}));await p.waitForTimeout(250);assert.ok(await p.locator('body').evaluate(el=>el.classList.contains('faq-compact')),'compact header remains stable near its scroll threshold');}
      }finally{await ctx.close();}
    });
  }
  await check('without JavaScript all 107 answers, six topics and secondary anchors remain readable',async()=>{
    const ctx=await browser.newContext({viewport:{width:320,height:700},javaScriptEnabled:false});
    const p=await ctx.newPage();try{
      await p.goto(base+'/faq/',{waitUntil:'domcontentloaded'});
      assert.equal(await p.locator('.faq-item:visible').count(),107);
      assert.equal(await p.locator('.faq-topic-links a:visible').count(),6);
      assert.equal(await p.getByRole('searchbox').isVisible(),false);
      await p.goto(base+'/faq/#faq-cbr-c-288',{waitUntil:'domcontentloaded'});
      assert.equal(await p.locator('#faq-cbr-c-288').count(),1,'alias remains an actual native fragment target');
      assert.ok(await p.locator('#faq-cbr-c-179 p').first().isVisible(),'native fragment reveals its answer');
      assert.ok(await p.locator('#main-nav').isVisible(),'no-JS navigation remains readable');
      assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    }finally{await ctx.close();}
  });
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));if(evidence){writeFileSync(resolve(evidence,'task2-browser-results.json'),JSON.stringify(results,null,2));writeFileSync(resolve(evidence,'task2-browser-geometry.json'),JSON.stringify(geometries,null,2));}}
if(results.some(r=>!r.pass))process.exitCode=1;
