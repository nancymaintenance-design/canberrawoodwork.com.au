import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { writeFileSync, statSync } from 'node:fs';
import { oldPhotos } from '../src/image-delivery.mjs';

// Generation only. The committed assets and normal build need no packages.
// Override SHARP_PATH for a different pre-existing Sharp installation.
const require=createRequire(import.meta.url);
const sharp=require(process.env.SHARP_PATH || 'C:/Users/UFTR/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const assets=new URL('../public/assets/',import.meta.url);
for (const photo of oldPhotos) {
  const input=fileURLToPath(new URL(`../public${photo.src}`,import.meta.url));
  const metadata=await sharp(input).metadata();
  if (metadata.width!==photo.width || metadata.height!==photo.height) throw Error(`Source dimensions changed: ${photo.src}`);
  for (const width of [400,800].filter(width=>width<metadata.width)) {
    const output=input.replace('.webp',`-${width}.webp`);
    await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:82,effort:6}).toFile(output);
    console.log(`${photo.src}: ${statSync(input).size}B -> ${width}px ${statSync(output).size}B`);
  }
}
const logo=fileURLToPath(new URL('ellis-services-logo.png',assets));
await sharp(logo).resize({width:136,height:136,fit:'inside',withoutEnlargement:true})
  .webp({lossless:true,effort:6}).toFile(fileURLToPath(new URL('ellis-services-logo-small.webp',assets)));
const favicon=await sharp(logo).resize({width:96,height:96,fit:'contain',background:{r:0,g:0,b:0,alpha:0},withoutEnlargement:true})
  .png({compressionLevel:9}).toBuffer();
writeFileSync(new URL('ellis-services-favicon-96.png',assets),favicon);
// ICO directory entry wrapping the same 96px PNG, for /favicon.ico fallback.
const header=Buffer.alloc(22);
header.writeUInt16LE(1,2); header.writeUInt16LE(1,4);
header[6]=96; header[7]=96;
header.writeUInt16LE(1,10); header.writeUInt16LE(32,12);
header.writeUInt32LE(favicon.length,14); header.writeUInt32LE(22,18);
writeFileSync(new URL('favicon.ico',assets),Buffer.concat([header,favicon]));
for (const name of ['ellis-services-logo-small.webp','ellis-services-favicon-96.png','favicon.ico']) console.log(`${name}: ${statSync(new URL(name,assets)).size}B`);
