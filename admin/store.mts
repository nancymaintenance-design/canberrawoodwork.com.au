import {mkdirSync,existsSync,readFileSync,writeFileSync,renameSync,openSync,closeSync,unlinkSync} from 'node:fs';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import type {State,Edit} from './model.mts';
const empty=():State=>({schemaVersion:1,version:0,edits:{},history:[]});
const location=(root:string)=>join(root,'.local-admin','state.json');
export function readState(root:string):State {
 const path=location(root);if(existsSync(path))return JSON.parse(readFileSync(path,'utf8')) as State;
 const approved=join(root,'content','approved.json');const state=empty();
 if(existsSync(approved))state.edits=(JSON.parse(readFileSync(approved,'utf8')) as {edits:Record<string,Edit>}).edits;
 return state;
}
export const pending=(state:State)=>Object.entries(state.edits).filter(([,e])=>e.zhRevision!==e.enRevision).map(([id])=>id);
function mutate(root:string,expected:number,action:string,change:(s:State)=>void):State{
 const folder=join(root,'.local-admin');mkdirSync(folder,{recursive:true});
 const lock=join(folder,'write.lock');let fd:number;
 try{fd=openSync(lock,'wx');}catch{throw Error('conflict: another save is in progress');}
 try{
  const state=readState(root);if(state.version!==expected)throw Error('conflict: content has changed; reload before saving');
  if(!state.history.length)state.history.push({version:state.version,time:new Date().toISOString(),action:'Initial state',edits:structuredClone(state.edits)});
  change(state);state.version++;
  state.history.push({version:state.version,time:new Date().toISOString(),action,edits:structuredClone(state.edits)});
  const temp=join(folder,randomUUID()+'.tmp');writeFileSync(temp,JSON.stringify(state,null,2)+'\n');renameSync(temp,location(root));return state;
 }finally{closeSync(fd);unlinkSync(lock);}
}
export function saveDraft(root:string,id:string,zh:string,expected:number,originalZh:string,originalEn:string):State {
 if(!zh.trim()||zh.length>20000)throw Error('Text must contain 1–20000 characters');
 return mutate(root,expected,'中文修改 '+id,s=>{
  const prior=s.edits[id];if(prior?.zh===zh)return;
  s.edits[id]={zh,en:prior?.en??originalEn,zhRevision:s.version+1,enRevision:prior?.enRevision??0,originalZh:prior?.originalZh??originalZh,originalEn:prior?.originalEn??originalEn};
  if(zh===originalZh&&!prior)delete s.edits[id];
 });
}
export function syncEnglish(root:string,id:string,en:string,expected:number):State {
 if(!en.trim()||en.length>20000)throw Error('English text must contain 1–20000 characters');
 return mutate(root,expected,'英文同步 '+id,s=>{const edit=s.edits[id];if(!edit)throw Error('Unknown edited field');edit.en=en;edit.enRevision=edit.zhRevision;});
}
export function restore(root:string,revision:number,expected:number):State {
 return mutate(root,expected,'恢复版本 '+revision,s=>{const item=s.history.find(r=>r.version===revision);if(!item)throw Error('Unknown revision');s.edits=structuredClone(item.edits);});
}
export function approve(root:string,expected:number):State {
 const lockFolder=join(root,'.local-admin');mkdirSync(lockFolder,{recursive:true});const lock=join(lockFolder,'write.lock');let fd:number;
 try{fd=openSync(lock,'wx');}catch{throw Error('conflict: another save is in progress');}
 try{
 const state=readState(root);if(state.version!==expected)throw Error('conflict: content changed');
 if(pending(state).length)throw Error('English synchronization pending');
 const folder=join(root,'content');mkdirSync(folder,{recursive:true});
 const temp=join(folder,randomUUID()+'.tmp');writeFileSync(temp,JSON.stringify({schemaVersion:1,edits:state.edits},null,2)+'\n');renameSync(temp,join(folder,'approved.json'));return state;
 }finally{closeSync(fd);unlinkSync(lock);}
}
