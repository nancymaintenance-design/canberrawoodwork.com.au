// Compatibility entry point. The maintained production sources are TypeScript.
import {compileProduction} from './scripts/compile.mjs';
compileProduction();
await import('./.compiled/build.mjs?run='+Date.now());
if(!process.argv.includes('--english-only')&&process.env.CMS_SKIP_APPROVED!=='1'){
 const {applyApproved}=await import('./admin/render.mts');applyApproved(process.cwd()+'/dist',process.cwd());
 const {applyReviewedRelease}=await import('./src/reviewed-release.mts');applyReviewedRelease(process.cwd()+'/dist',process.cwd());
 const {applyCustomerVoiceRelease}=await import('./src/customer-voice-release.mts');applyCustomerVoiceRelease(process.cwd()+'/dist',process.cwd());
 if(process.env.SERVICE_NAVIGATION_SKIP_RELEASE!=='1'){
  const {applyNavigationRelease}=await import('./src/navigation-release.mts');applyNavigationRelease(process.cwd()+'/dist');
 }
 if(process.env.SERVICE_INTENT_SKIP_RELEASE!=='1'){
  const {applyServiceIntentRelease}=await import('./src/service-intent-release.mts');applyServiceIntentRelease(process.cwd()+'/dist');
 }
 if(process.env.CUSTOMER_COPY_SKIP_RELEASE!=='1'){
  const {applyCustomerCopyRelease}=await import('./src/customer-copy-release.mts');applyCustomerCopyRelease(process.cwd()+'/dist',process.cwd());
 }
 if(process.env.PRIVACY_DESIGN_SKIP_RELEASE!=='1'){
  const {applyPrivacyDesignRelease}=await import('./src/privacy-design-release.mts');applyPrivacyDesignRelease(process.cwd()+'/dist');
 }
 if(process.env.FAQ_DESIGN_SKIP_RELEASE!=='1'){
  const {applyFaqDesignRelease}=await import('./src/faq-design-release.mts');applyFaqDesignRelease(process.cwd()+'/dist');
 }
}
// Derive RSS only after all bilingual/content/design release overlays have finished.
const {applyRssFeeds}=await import('./src/rss-feed.mts');
applyRssFeeds(process.cwd()+'/dist');
