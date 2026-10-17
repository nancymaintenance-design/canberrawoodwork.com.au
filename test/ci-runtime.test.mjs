import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('GitHub release checks use the supported production Node runtime',()=>{
 const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 const workflow=readFileSync(new URL('../.github/workflows/node.js.yml',import.meta.url),'utf8');
 const minimum=Number(pkg.engines.node.match(/\d+/)[0]);
 const versions=workflow.match(/node-version:\s*\[([^\]]+)\]/)?.[1].split(',').map(s=>Number(s.trim().match(/\d+/)[0]));
 assert.ok(versions?.length,'CI must declare its runtime matrix');
 for(const version of versions)assert.ok(version>=minimum,`CI Node ${version} cannot run production sources requiring Node ${minimum}`);
 assert.ok(workflow.includes('- run: npm run typecheck'),'Release checks must run strict TypeScript verification');
});
