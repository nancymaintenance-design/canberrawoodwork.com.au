// Flexible records describe the existing heterogeneous, build-owned template data.
// Interactive editor state and disk/HTTP boundaries use dedicated strict interfaces.
export type TemplateData = Record<string, any>;
export interface FeedNode {tag:string;attrs:Record<string,string>;children:(FeedNode|string)[]}
export interface FeedItem {id:string;url:string;title:string;summary:string;content_text:string;language:string;image?:string;authors?:{name:string;url:string}[];date_published?:string;date_modified?:string;_related?:{services:{title:string;url:string}[];projects:{title:string;url:string}[]}}
export interface Service {slug:string;title:string;group:string;intro:string;symptoms:string[];approach:string;boundary:string;related:string[];metaDescription?:string}
export interface FAQ {q:string;a?:string;owner:string;group?:string;id?:string;aliases?:string[]}
export interface GuideSection {id:string;heading:string;paragraphs:string[];sources:string[]}
export interface Article extends TemplateData {slug:string;title:string;lead:string;owner:string;reading:string[];published:string;updated:string;metaDescription?:string;category:string;faqs:{q:string;a:string}[];sections:string[][];sources:string[][];completeBody:GuideSection[]}
