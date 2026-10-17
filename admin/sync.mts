import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {readState,pending,syncEnglish} from './store.mts';
const root=fileURLToPath(new URL('../',import.meta.url));let state=readState(root);
if(process.argv[2]){
 const input=JSON.parse(readFileSync(process.argv[2],'utf8')) as {version:number;translations:Record<string,{en:string;zhRevision:number}>};
 if(input.version!==state.version)throw Error('conflict: stale translation batch');
 for(const[id,item]of Object.entries(input.translations)){const edit=state.edits[id];if(!edit||item.zhRevision!==edit.zhRevision)throw Error('conflict: Chinese revision has changed');if(!item.en?.trim())throw Error('Missing English translation');}
 for(const[id,item]of Object.entries(input.translations))state=syncEnglish(root,id,item.en,state.version);
 console.log(`Synced ${Object.keys(input.translations).length} fields. Remaining: ${pending(state).length}`);
}else{
 const data={version:state.version,translations:Object.fromEntries(pending(state).map(id=>[id,{en:'',zhRevision:state.edits[id]!.zhRevision,zh:state.edits[id]!.zh,previousEnglish:state.edits[id]!.en,previousChinese:state.edits[id]!.originalZh}]))};
 const folder=join(root,'.local-admin');mkdirSync(folder,{recursive:true});writeFileSync(join(folder,'english-pending.json'),JSON.stringify(data,null,2)+'\n');console.log(join(folder,'english-pending.json'));
}
