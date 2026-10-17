import {mkdirSync,readFileSync,writeFileSync,readdirSync,existsSync,cpSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {zipSync,type Zippable} from 'fflate';
import {readState,approve,pending} from './store.mts';
import {getCatalog} from './catalog.mts';
import {renderPages,writeManaged} from './render.mts';
import {validateSite} from './validate.mts';
const hash=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex');
function collect(root:string,skip:(path:string)=>boolean=()=>false):Record<string,Uint8Array>{const files:Record<string,Uint8Array>={};function walk(folder:string,prefix=''){for(const item of readdirSync(folder,{withFileTypes:true})){const path=prefix+item.name;if(skip(path)||item.isSymbolicLink())continue;if(item.isDirectory())walk(join(folder,item.name),path+'/');else files[path]=readFileSync(join(folder,item.name));}}walk(root);return files;}
export async function createPackage(root:string,version=readState(root).version):Promise<{directory:string;files:string[]}>{
 const state=readState(root);if(state.version!==version)throw Error('conflict: content changed');if(pending(state).length)throw Error('English synchronization pending');
 execFileSync(process.execPath,['build.mjs'],{cwd:root,env:{...process.env,CMS_SKIP_APPROVED:'1'},stdio:'pipe'});
 execFileSync(process.execPath,['node_modules/typescript/bin/tsc','--noEmit'],{cwd:root,stdio:'pipe'});
 const catalog=getCatalog(join(root,'dist'));validateSite(join(root,'dist'),renderPages(catalog,state,'release'));
 writeManaged(join(root,'dist'),catalog,state,'release');
 approve(root,version);
 const stamp=new Date().toISOString().replace(/[:.]/g,'-');const folder=join(root,'..','reports','local-admin-2026-10-17','releases',stamp);mkdirSync(folder,{recursive:true});
 const names=new Set(['admin','api','src','browser','scripts','public','content','test','docs','.github','build.mjs','build.mts','package.json','package-lock.json','tsconfig.json','vercel.json','start-admin.cmd','.gitignore','AGENTS.md','DESIGN.md','UX-CONTRACT.md','premium-ui.json']);
 const source=collect(root,path=>!names.has(path.split('/')[0]!)||path.includes('/node_modules/')||/^src\/.*\.mjs$/.test(path)||/^public\/assets\/(?:site|faq-hub|language-switch)\.js$/.test(path)||/(?:^|\/)(?:\.env[^/]*|\.local-admin|\.compiled|\.git|write\.lock|[^/]+\.dpapi)(?:\/|$)/.test(path)||/\.(?:tmp|log)$/.test(path));
 const site=collect(join(root,'dist'));
 const manifest={created:new Date().toISOString(),version,files:Object.fromEntries(Object.entries(site).map(([p,b])=>[p,hash(b)])),source:Object.fromEntries(Object.entries(source).map(([p,b])=>[p,hash(b)]))};
 writeFileSync(join(folder,'source-release.zip'),zipSync(source as Zippable,{level:6}));writeFileSync(join(folder,'static-site.zip'),zipSync(site as Zippable,{level:6}));
 writeFileSync(join(folder,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 writeFileSync(join(folder,'使用说明.md'),'# 网站上传包\n\nsource-release.zip 是完整发布源码；安装 Node 24 后运行 npm ci --ignore-scripts，再运行 npm run build，输出在 dist。\n\nstatic-site.zip 是构建成品备份，不独立提供联系邮件 API。正式发布仍走 GitHub → Vercel；请由 Codex 核对用户当次发布授权后操作。\n\n本包不含密钥、环境变量、本地草稿和历史记录。Resend 配置沿用原 Vercel 项目，不写入压缩包。\n');
 return {directory:resolve(folder),files:['source-release.zip','static-site.zip','manifest.json','使用说明.md']};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const result=await createPackage(fileURLToPath(new URL('../',import.meta.url)));console.log(JSON.stringify(result,null,2));}
