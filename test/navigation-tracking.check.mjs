import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext,createContext} from 'node:vm';
import ts from 'typescript';
const source=ts.transpileModule(readFileSync('browser/navigation-paths.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace(/export \{\};?\s*$/,'');
test('breadcrumb analytics reuses existing tracker once without personal/query data',()=>{
 const attrs=new Set(),events=[],listeners=[];
 const nav={dataset:{sourcePath:'/news/rotten-window-sill/',locale:'en-AU',ownerId:'timber-window-repairs'}};
 const anchor={dataset:{targetPath:'/services/timber-window-repairs/',breadcrumbPosition:'2'},closest:()=>nav};
 const ctx=createContext({document:{documentElement:{hasAttribute:n=>attrs.has(n),setAttribute:n=>attrs.add(n)},addEventListener:(_,fn)=>listeners.push(fn)},window:{gtag:(...a)=>events.push(a)}});
 runInNewContext(source,ctx);runInNewContext(source,ctx);assert.equal(listeners.length,1);
 listeners[0]({target:{closest:()=>anchor}});assert.equal(events.length,1);assert.equal(events[0][1],'breadcrumb_click');assert.equal(events[0][2].position,2);assert.ok(!JSON.stringify(events).includes('?'));
});
test('no analytics configuration creates no tracker, queue or network call',()=>{
 const win={},nav={dataset:{}},anchor={dataset:{},closest:()=>nav};let fn;
 runInNewContext(source,{document:{documentElement:{hasAttribute:()=>false,setAttribute:()=>{}},addEventListener:(_,f)=>fn=f},window:win});fn({target:{closest:()=>anchor}});assert.deepEqual(win,{});
});
