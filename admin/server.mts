import {createServer,type IncomingMessage} from 'node:http';
import {readFileSync,writeFileSync,mkdirSync,cpSync,existsSync,statSync} from 'node:fs';
import {resolve,join,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
import {getCatalog} from './catalog.mts';
import {readState,saveDraft,syncEnglish,restore,pending} from './store.mts';
import {validateValue,writeManaged} from './render.mts';
import type {Catalog,State} from './model.mts';
export function allowedRequest(host:string|undefined,origin:string|undefined,port:number):boolean{return host===`127.0.0.1:${port}`&&(!origin||origin===`http://127.0.0.1:${port}`);}
const mime:Record<string,string>={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.ico':'image/x-icon'};
async function body(req:IncomingMessage):Promise<Record<string,unknown>>{let size=0;const chunks:Buffer[]=[];for await(const chunk of req){const buf=Buffer.from(chunk);size+=buf.length;if(size>16*1024*1024)throw Error('Request too large');chunks.push(buf);}return JSON.parse(Buffer.concat(chunks).toString()||'{}') as Record<string,unknown>;}
export function startAdmin(root:string,port=8780){
 const token=randomUUID();const dist=join(root,'dist'),preview=join(root,'.local-admin','preview');
 execFileSync(process.execPath,['build.mjs'],{cwd:root,env:{...process.env,CMS_SKIP_APPROVED:'1'},stdio:'pipe'});
 const catalog:Catalog=getCatalog(dist);
 const refresh=()=>{mkdirSync(preview,{recursive:true});cpSync(dist,preview,{recursive:true});writeManaged(preview,catalog,readState(root),'preview');};refresh();
 const publicCatalog=()=>({pages:catalog.pages,fields:Object.fromEntries(Object.entries(catalog.fields).map(([id,f])=>[id,{...f,occurrences:f.occurrences.map(o=>({route:o.route}))}]))});
 const server=createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  const send=(status:number,data:unknown)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'}).end(JSON.stringify(data));};
  if(!allowedRequest(req.headers.host,req.headers.origin,port)){send(403,{error:'Only this local admin origin is allowed'});return;}
  try{
   const url=new URL(req.url||'/','http://127.0.0.1');const path=decodeURIComponent(url.pathname);
   if(path==='/admin/api/state'&&req.method==='GET'){send(200,{token,catalog:publicCatalog(),state:readState(root),pending:pending(readState(root))});return;}
   if(path.startsWith('/admin/api/')&&req.method==='POST'){
    if(req.headers.origin!==`http://127.0.0.1:${port}`||req.headers['x-admin-token']!==token){send(403,{error:'Invalid local session; reload the page'});return;}
    const data=await body(req);const version=Number(data.version);if(!Number.isSafeInteger(version)||version<0)throw Error('Invalid version');
    const id=String(data.id||'');let state:State;
    if(path==='/admin/api/save'){
     const field=catalog.fields[id];if(!field)throw Error('Unknown field');const zh=String(data.zh||'');validateValue(field,zh);
     if(field.kind==='image'&&!existsSync(join(root,'public',zh)))throw Error('Image file does not exist');
     state=saveDraft(root,id,zh,version,field.zh,field.en);
     if(field.kind==='image'||field.kind==='link')state=syncEnglish(root,id,zh.replace(/^\/zh\//,'/'),state.version);
    }else if(path==='/admin/api/sync'){
     const field=catalog.fields[id];if(!field)throw Error('Unknown field');validateValue(field,String(data.en||''));state=syncEnglish(root,id,String(data.en),version);
    }else if(path==='/admin/api/restore')state=restore(root,Number(data.revision),version);
    else if(path==='/admin/api/preview'){if(readState(root).version!==version)throw Error('conflict: content changed');state=readState(root);}
    else if(path==='/admin/api/upload'){
     if(readState(root).version!==version)throw Error('conflict: content changed');
     const bytes=Buffer.from(String(data.base64||''),'base64');if(!bytes.length||bytes.length>10*1024*1024)throw Error('图片上限为 10 MB');
     const extension=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'png':bytes[0]===255&&bytes[1]===216?'jpg':bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'?'webp':null;
     if(!extension)throw Error('请上传 PNG、JPEG 或 WebP 图片');const folder=join(root,'public','assets','uploads');mkdirSync(folder,{recursive:true});
     const file=`image-${randomUUID()}.${extension}`;writeFileSync(join(folder,file),bytes);mkdirSync(join(dist,'assets','uploads'),{recursive:true});writeFileSync(join(dist,'assets','uploads',file),bytes);
     mkdirSync(join(preview,'assets','uploads'),{recursive:true});writeFileSync(join(preview,'assets','uploads',file),bytes);
     send(200,{path:'/assets/uploads/'+file});return;
    }else if(path==='/admin/api/package'){
     const {createPackage}=await import('./package.mts');const result=await createPackage(root,version);send(200,result);return;
    }else{send(404,{error:'Unknown operation'});return;}
    refresh();send(200,{state,pending:pending(state)});return;
   }
   if(!['GET','HEAD'].includes(req.method||'')){send(405,{error:'Local preview does not send enquiries'});return;}
   if(path==='/admin'||path==='/admin/'){res.writeHead(200,{'Content-Type':mime['.html']}).end(readFileSync(join(root,'admin','ui','index.html')));return;}
   if(path==='/admin/editor.js'){const js=ts.transpileModule(readFileSync(join(root,'admin','ui','editor.ts'),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;res.writeHead(200,{'Content-Type':mime['.js']}).end(js);return;}
   if(path==='/admin/admin.css'){res.writeHead(200,{'Content-Type':mime['.css']}).end(readFileSync(join(root,'admin','ui','admin.css')));return;}
   const relative=path.startsWith('/preview/')?path.slice('/preview'.length):path;
   if(relative.includes('..')||relative.includes('\\')){send(403,{error:'Invalid path'});return;}
   const fileRoot=preview;let file=resolve(fileRoot,'.'+relative);
   if(!file.startsWith(fileRoot+sep)&&file!==fileRoot){send(403,{error:'Invalid path'});return;}
   let status=200;if(existsSync(file)&&statSync(file).isDirectory())file=join(file,'index.html');
   if(!existsSync(file)){file=join(fileRoot,relative.startsWith('/zh/')?'zh/404/index.html':'404/index.html');status=404;}
   if(!existsSync(file)){send(404,{error:'Not found'});return;}
   res.writeHead(status,{'Content-Type':mime[extname(file)]||'application/octet-stream'}).end(req.method==='HEAD'?undefined:readFileSync(file));
  }catch(error){const message=error instanceof Error?error.message:'Unexpected failure';send(message.includes('conflict')?409:400,{error:message});}
 });server.listen(port,'127.0.0.1',()=>console.log(`本地内容后台：http://127.0.0.1:${port}/admin/`));return server;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))startAdmin(fileURLToPath(new URL('../',import.meta.url)),Number(process.env.ADMIN_PORT||8780));
