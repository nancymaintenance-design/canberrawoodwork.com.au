import { homeCaseMedia, serviceCaseMedia } from './service-case-media.mjs';

// Source widths are the real, retained originals; variants never upscale them.
export const oldPhotos = [...new Map([
  ...Object.values(homeCaseMedia),
  ...Object.values(serviceCaseMedia).flatMap(media=>media.images),
  { src:'/assets/measuring-timber-work-canberra.webp', width:1440, height:960 },
].map(image=>[image.src,image])).values()];
const photosBySource = new Map(oldPhotos.map(image=>[image.src,image]));
const srcset = image => [400,800].filter(width=>width<image.width)
  .map(width=>`${image.src.replace('.webp',`-${width}.webp`)} ${width}w`)
  .concat(`${image.src} ${image.width}w`).join(', ');

// Follow the current CSS cascade: shell max 1240; craft-details overrides the
// case-study grid to equal columns. Carousel caption has a 260px minimum.
const carouselSizes = '(max-width:720px) 100vw, (max-width:809px) calc(100vw - 260px), 67.857143vw';
const caseSizes = '(max-width:700px) calc(100vw - 32px), (max-width:950px) calc(50vw - 34px), (max-width:1304px) calc(50vw - 46px), 606px';
function photoSizes(tag,route,image) {
  if (/class="feature-photo"/.test(tag)) return '(max-width:700px) calc(100vw - 32px), (max-width:950px) calc(33.333333vw - 26px), (max-width:1304px) calc(33.333333vw - 34px), 400.667px';
  if (/class="service-card-photo"/.test(tag)) return '(max-width:700px) calc(100vw - 34px), (max-width:950px) calc(50vw - 31px), (max-width:1304px) calc(50vw - 43px), 609px';
  if (route==='/' && image.src===homeCaseMedia.deck.src) return '(max-width:700px) calc(100vw - 32px), (max-width:720px) calc(100vw - 40px), (max-width:950px) calc(61vw - 53.68px), (max-width:1304px) calc(61vw - 68.32px), 727.12px';
  if (route==='/about/') return '(max-width:700px) calc(100vw - 32px), (max-width:950px) calc(47.5vw - 40.375px), (max-width:1304px) calc(47.5vw - 70.775px), 548.625px';
  return caseSizes;
}

export function enhanceImageDelivery(html,route) {
  let output = html.replace('<link rel="icon" href="/assets/ellis-services-logo.png">','<link rel="icon" type="image/png" sizes="96x96" href="/assets/ellis-services-favicon-96.png">')
    .replace('<img src="/assets/ellis-services-logo.png" alt="">','<img src="/assets/ellis-services-logo-small.webp" alt="" width="68" height="68">');
  output = output.replace(/(<article class="work-carousel-slide[^>]*>)(<img\b[^>]*>)/g,(_,article,tag)=>{
    const source=tag.match(/\ssrc="([^"]+)"/)?.[1];
    const image=photosBySource.get(source);
    if (!image) return article+tag;
    const active=/\bis-active\b/.test(article);
    const attributes=`${active?'srcset':'data-srcset'}="${srcset(image)}" sizes="${carouselSizes}"`;
    if (active) tag=tag.replace(/\sloading="[^"]*"/,'').replace(' decoding=', ' loading="eager" decoding=');
    else tag=tag.replace(' src=',' data-src=');
    return article+tag.replace('<img ',`<img ${attributes} `);
  });
  return output.replace(/<img\b[^>]*>/g,tag=>{
    // Existing verified project photos and deferred slides keep their delivery.
    if (/\s(?:data-src|srcset)=/.test(tag)) return tag;
    const source=tag.match(/\ssrc="([^"]+)"/)?.[1];
    const image=photosBySource.get(source);
    if (!image) return tag;
    return tag.replace('<img ',`<img srcset="${srcset(image)}" sizes="${photoSizes(tag,route,image)}" `);
  });
}
