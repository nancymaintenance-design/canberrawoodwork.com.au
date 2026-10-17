export interface Edit {zh:string;en:string;zhRevision:number;enRevision:number;originalZh:string;originalEn:string}
export interface Revision {version:number;time:string;action:string;edits:Record<string,Edit>}
export interface State {schemaVersion:1;version:number;edits:Record<string,Edit>;history:Revision[]}
export interface Span {start:number;end:number;raw:string}
export interface Occurrence {route:string;en:Span;zh:Span}
export type FieldKind='text'|'attribute'|'link'|'image';
export interface Field {id:string;label:string;section:string;kind:FieldKind;tag:string;attr?:string;en:string;zh:string;shared:boolean;occurrences:Occurrence[]}
export interface Page {route:string;title:string;category:string;fieldIds:string[]}
export interface Catalog {schemaVersion:1;pages:Page[];fields:Record<string,Field>;html:Record<string,{en:string;zh:string}>}
