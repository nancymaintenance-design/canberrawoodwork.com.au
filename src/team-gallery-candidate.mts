import {parse,type DefaultTreeAdapterMap} from 'parse5';
type Node=DefaultTreeAdapterMap['node'];
type Element=DefaultTreeAdapterMap['element'];
const removedAsset='/assets/projects/oxley-timber-screen-work';

/** Remove only the requested photograph; keep original files available for recovery. */
export function removeTeamPhoto(html:string):string{
 const doc=parse(html,{sourceCodeLocationInfo:true}),figures:Element[]=[];
 function containsTarget(n:Node):boolean{
  if('tagName'in n&&n.tagName==='img'&&n.attrs.some(a=>a.name==='src'&&a.value.startsWith(removedAsset)))return true;
  return 'childNodes'in n&&n.childNodes.some(containsTarget);
 }
 function visit(n:Node){
  if('tagName'in n&&n.tagName==='figure'&&containsTarget(n)){figures.push(n);return;}
  if('childNodes'in n)for(const child of n.childNodes)visit(child);
 }
 visit(doc);
 for(const figure of figures.sort((a,b)=>b.sourceCodeLocation!.startOffset-a.sourceCodeLocation!.startOffset)){
  const loc=figure.sourceCodeLocation!;html=html.slice(0,loc.startOffset)+html.slice(loc.endOffset);
 }
 return html;
}
