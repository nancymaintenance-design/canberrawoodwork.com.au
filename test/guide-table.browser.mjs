// Run after build against a local static preview. NODE_PATH may point at the
// bundled Playwright package; no project dependency installation is needed.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const { chromium }=createRequire(import.meta.url)('playwright');
const base=process.env.LOCAL_PREVIEW_URL||'http://127.0.0.1:8768';
const evidence=process.env.BROWSER_EVIDENCE_DIR;
// Playwright's headless default hides every scrollbar, which would invalidate
// the visible-scrollbar check and its screenshots.
const browser=await chromium.launch({headless:true,channel:'chrome',ignoreDefaultArgs:['--hide-scrollbars']});
const rows=[];
try {
  for(const javaScriptEnabled of [true,false])for(const width of [320,390,1440]){
    const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled,reducedMotion:'reduce'});
    const page=await context.newPage();
    try {
      await page.goto(`${base}/news/repair-or-rebuild-a-deck/`,{waitUntil:'networkidle'});
      const table=page.locator('table').filter({has:page.locator('caption', {hasText:'Ellis assessment and the work to define'})});
      const geometry=await table.evaluate(table=>{
        const region=table.parentElement,rect=region.getBoundingClientRect(),style=getComputedStyle(region);
        return {viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,regionWidth:region.clientWidth,scrollWidth:region.scrollWidth,scrollbarHeight:region.offsetHeight-region.clientHeight,left:rect.left,right:rect.right,overflowX:style.overflowX,tabIndex:region.tabIndex,role:region.getAttribute('role'),name:document.getElementById(region.getAttribute('aria-labelledby'))?.textContent,columns:table.querySelectorAll('thead th[scope="col"]').length,rows:table.querySelectorAll('tbody th[scope="row"]').length,fontSize:getComputedStyle(table).fontSize};
      });
      rows.push({javaScriptEnabled,...geometry});
      assert.ok(geometry.documentWidth<=width,`${width}px: document width ${geometry.documentWidth} must fit`);
      assert.equal(geometry.role,'region');
      assert.equal(geometry.name,'Ellis assessment and the work to define');
      assert.equal(geometry.tabIndex,0,'scroll region belongs in keyboard tab order');
      assert.equal(geometry.columns,3);assert.equal(geometry.rows,3);
      assert.ok(parseFloat(geometry.fontSize)>=15,'readable table type');
      const region=table.locator('..');
      await region.evaluate(el=>{
        const previous=[...document.querySelectorAll('a[href],button,summary,[tabindex="0"]')].filter(node=>node.compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING).at(-1);
        previous.focus();
      });
      await page.keyboard.press('Tab');
      assert.equal(await region.evaluate(el=>document.activeElement===el),true,'Tab reaches the table region');
      const overflow=geometry.scrollWidth>geometry.regionWidth;
      if(overflow){
        assert.ok(['auto','scroll'].includes(geometry.overflowX));
        assert.ok(geometry.scrollbarHeight>=10,'overflow has a visible operable scrollbar');
        const initial=await region.evaluate(el=>el.scrollLeft);
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(200);
        assert.ok(await region.evaluate(el=>el.scrollLeft)>initial,'arrow key scrolls table');
        for(let i=0;i<20;i++)await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(400);
        assert.ok(await region.evaluate(el=>el.scrollLeft+el.clientWidth>=el.scrollWidth-1),'arrow keys reach the complete rightmost column');
        for(let i=0;i<20;i++)await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(400);
        assert.equal(await region.evaluate(el=>el.scrollLeft),0,'arrow keys return to first column');
      }
      await page.locator('nav[aria-label="On this page"]').first().waitFor({state:'attached'});
      const disclosure=page.locator('.article-prose details.faq-item').first();
      await disclosure.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.equal(await disclosure.evaluate(el=>el.open),true,'native FAQ works with or without JS');
      await region.scrollIntoViewIfNeeded();
      if(evidence)await page.screenshot({path:resolve(evidence,`final-table-${width}-${javaScriptEnabled?'js':'nojs'}.png`)});
      console.log(`PASS table ${width}px ${javaScriptEnabled?'JS':'no-JS'} ${JSON.stringify(geometry)}`);
    } finally {await context.close();}
  }
} finally {
  await browser.close();
  if(evidence)writeFileSync(resolve(evidence,'final-table-browser.json'),JSON.stringify(rows,null,2)+'\n');
}
