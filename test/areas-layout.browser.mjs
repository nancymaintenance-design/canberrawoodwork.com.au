import test, {before, after} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync} from 'node:fs';
import {join} from 'node:path';

// Run explicitly with Playwright available through NODE_PATH and a GET-only preview.
const {chromium}=createRequire(import.meta.url)('playwright');
const url=new URL('/service-areas/',process.env.AREAS_PREVIEW_URL||'http://127.0.0.1:8770/').href;
const evidence=process.env.AREAS_LAYOUT_EVIDENCE_DIR;
const ids=['belconnen','gungahlin','inner-north-and-city','inner-south','woden-valley','weston-creek','tuggeranong','molonglo-valley','east-canberra'];
const suburbs=[
  ['Belconnen','Kaleen','Florey','Aranda'],['Gungahlin','Amaroo','Casey','Ngunnawal'],
  ['City','Braddon','Ainslie','Dickson'],['Kingston','Griffith','Red Hill','Narrabundah'],
  ['Woden','Curtin','Chifley','Phillip'],['Weston','Duffy','Fisher','Holder'],
  ['Tuggeranong','Kambah','Wanniassa','Gowrie'],['Denman Prospect','Whitlam','Wright'],['Fyshwick','Pialligo'],
];
const cases=[
  ['belconnen','/projects/melba-deck-care/'],
  ['gungahlin','/projects/mitchell-composite-deck/'],
  ['woden-valley','/projects/pearce-wardrobe-installation/'],
];
let browser;
before(async()=>{
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-proxy-server','--host-resolver-rules=MAP www.google.com ~NOTFOUND']});
  if(evidence)mkdirSync(evidence,{recursive:true});
});
after(async()=>{await browser?.close();});

for(const width of [1440,320,390])test(`Areas at ${width}px preserves district order and uses the available columns`,async()=>{
  const page=await browser.newPage({viewport:{width,height:1000}});
  try{
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.locator('.district').last().waitFor();
    const layout=await page.evaluate(()=>{
      const rect=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};
      return {
        overflow:document.documentElement.scrollWidth>innerWidth,
        jumps:[...document.querySelectorAll('.area-jump a')].map(a=>({href:a.getAttribute('href'),targets:document.querySelectorAll(a.getAttribute('href')).length})),
        districts:[...document.querySelectorAll('.district')].map(el=>({
          id:el.id,...rect(el),
          children:[...el.children].map(rect),
          suburbs:[...el.querySelectorAll(':scope > div:first-child p a')].map(a=>({href:a.getAttribute('href'),label:a.textContent})),
          cases:[...el.querySelectorAll('.district-project a')].map(a=>a.getAttribute('href')),
        })),
      };
    });
    if(evidence){
      await page.screenshot({path:join(evidence,`final-areas-${width}.png`),fullPage:true});
      await page.locator('.area-index').screenshot({path:join(evidence,`final-areas-directory-${width}.png`)});
    }
    assert.equal(layout.overflow,false,'page has no horizontal overflow');
    assert.deepEqual(layout.districts.map(d=>d.id),ids,'all nine districts retain DOM order');
    assert.deepEqual(layout.districts.map(d=>d.suburbs.map(a=>a.label)),suburbs,'all existing suburb links remain in order');
    assert.deepEqual(layout.jumps.map(j=>j.href),ids.map(id=>`#${id}`));
    assert.ok(layout.jumps.every(j=>j.targets===1),'each jump has exactly one destination');
    assert.deepEqual(layout.districts.flatMap(d=>d.cases.map(href=>[d.id,href])),cases,'the three real district cases remain');
    for(const district of layout.districts){
      assert.ok(district.suburbs.length>=2,`${district.id}: retained suburb links`);
      assert.ok(district.suburbs.every(a=>a.href===`#${district.id}`));
      for(const child of district.children){
        assert.ok(Math.abs(child.x-district.x)<1,`${district.id}: internal content starts in its single column`);
        assert.ok(child.width>district.width*.95,`${district.id}: internal content spans its district column`);
      }
      if(district.children.length===2)assert.ok(district.children[1].y>=district.children[0].bottom,`${district.id}: case follows suburb list`);
    }
    if(width===1440){
      const [first,second]=layout.districts;
      assert.ok(Math.abs(first.y-second.y)<1,'first two desktop districts share the first row');
      assert.ok(second.x>=first.x+first.width,'second desktop district occupies the next column');
      assert.ok(Math.abs(first.width-second.width)<1,'desktop columns have equal width');
      for(let i=2;i<layout.districts.length;i++){
        const previous=layout.districts[i-2],current=layout.districts[i];
        assert.ok(Math.abs(previous.x-current.x)<1,'desktop entries preserve alternating columns');
        assert.ok(current.y>=previous.bottom,'desktop rows do not overlap');
      }
    }else{
      const [first]=layout.districts;
      for(let i=1;i<layout.districts.length;i++){
        const current=layout.districts[i],previous=layout.districts[i-1];
        assert.ok(Math.abs(current.x-first.x)<1,'mobile uses one column');
        assert.ok(current.y>=previous.bottom,'mobile districts follow normal document order');
      }
    }
    console.log(JSON.stringify({width,overflow:layout.overflow,districts:layout.districts.map(({id,x,y,width,height})=>({id,x,y,width,height}))}));
  }finally{await page.close();}
});
