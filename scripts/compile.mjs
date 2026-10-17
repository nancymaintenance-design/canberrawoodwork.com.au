import ts from 'typescript';
import {readFileSync,writeFileSync,mkdirSync,readdirSync,cpSync} from 'node:fs';
import {join,dirname} from 'node:path';
export function compileProduction(root=process.cwd()){
 const out=join(root,'.compiled');mkdirSync(out,{recursive:true});
 for(const file of ['build.mts',...readdirSync(join(root,'src')).filter(f=>f.endsWith('.mts')).map(f=>'src/'+f)]){
  const source=readFileSync(join(root,file),'utf8');const output=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},fileName:file}).outputText;
  const target=join(out,file.replace(/\.mts$/,'.mjs'));mkdirSync(dirname(target),{recursive:true});writeFileSync(target,output);
  if(file.startsWith('src/'))writeFileSync(join(root,file.replace(/\.mts$/,'.mjs')),output);
 }
 for(const file of ['keyword-map.json','locales'])cpSync(join(root,'src',file),join(out,'src',file),{recursive:true});
 for(const file of readdirSync(join(root,'browser')).filter(f=>f.endsWith('.ts'))){const result=ts.transpileModule(readFileSync(join(root,'browser',file),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},fileName:file});writeFileSync(join(root,'public','assets',file.replace(/\.ts$/,'.js')),result.outputText.replace(/export \{\};?\s*$/,''));}
}
