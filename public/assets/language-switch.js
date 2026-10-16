// Preserve the current FAQ/section fragment when switching languages.
const syncLanguageFragment=()=>{
  for(const link of document.querySelectorAll('[data-language-switch]'))link.hash=location.hash;
};
syncLanguageFragment();
window.addEventListener('hashchange',syncLanguageFragment);
