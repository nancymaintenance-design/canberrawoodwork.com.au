export {};
type TrackingWindow=Window&{gtag?:(...args:unknown[])=>void;dataLayer?:unknown[]};
if(!document.documentElement.hasAttribute('data-breadcrumb-tracking-ready')){
 document.documentElement.setAttribute('data-breadcrumb-tracking-ready','');
 document.addEventListener('click',event=>{
  const anchor=(event.target as Element|null)?.closest<HTMLAnchorElement>('a[data-breadcrumb-position]');
  const nav=anchor?.closest<HTMLElement>('[data-service-breadcrumb]');if(!anchor||!nav)return;
  const payload={source_path:nav.dataset.sourcePath,target_path:anchor.dataset.targetPath,locale:nav.dataset.locale,position:Number(anchor.dataset.breadcrumbPosition),owner_id:nav.dataset.ownerId||''};
  const tracker=window as TrackingWindow;
  if(typeof tracker.gtag==='function')tracker.gtag('event','breadcrumb_click',payload);
  else if(Array.isArray(tracker.dataLayer))tracker.dataLayer.push({event:'breadcrumb_click',...payload});
  if(document.documentElement.hasAttribute('data-navigation-preview')&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey&&event.button===0){event.preventDefault();location.assign(anchor.dataset.targetPath!);}
 });
}
