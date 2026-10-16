import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
// Render every current source page first; never inventory a stale/partial dist.
const result=spawnSync(process.execPath,['build.mjs','--translations-inventory'],{encoding:'utf8',maxBuffer:8*1024*1024});
if(result.status!==0)throw new Error(result.stderr||'English inventory rendering failed');
const inventory=JSON.parse(result.stdout);
const path='src/locales/zh-Hans.json';
const previous=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{};
for(const[key,entry]of Object.entries(inventory))if(previous[key]?.en===entry.en)entry.zh=previous[key].zh;
mkdirSync('src/locales',{recursive:true});
// Mechanical extraction, not authored copy: keep catalog in the source tree.
writeFileSync(path,JSON.stringify(inventory,null,2)+'\n');
console.log(JSON.stringify({strings:Object.keys(inventory).length,missing:Object.values(inventory).filter(v=>!v.zh).length,englishWords:Object.values(inventory).reduce((n,v)=>n+v.en.split(/\s+/).length,0)}));
