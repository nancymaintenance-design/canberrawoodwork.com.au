// Native anchors and details work without this enhancement.
const hub = document.querySelector('.faq-hub');
if (hub) {
  const header = document.querySelector('.site-header');
  const nav = hub.querySelector('.faq-topic-nav');
  const rail = nav.querySelector('.faq-topic-links');
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const groups = [...hub.querySelectorAll('.faq-group')];
  const mobile = window.matchMedia('(max-width:700px)');
  let headerHeight = 0;
  let navHeight = 0;
  let current;
  let frame;

  const updateCurrent = () => {
    frame = undefined;
    const line = headerHeight + navHeight + 32;
    let selected = groups[0];
    for (const group of groups) {
      if (group.getBoundingClientRect().top <= line) selected = group;
    }
    if (current === selected.id) return;
    current = selected.id;
    for (const link of links) {
      const active = link.hash === `#${current}`;
      if (active) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
      // Keep only the horizontal rail in view, never scroll the page from scrollspy.
      if (active && mobile.matches) {
        const left = link.offsetLeft - rail.offsetLeft;
        if (left < rail.scrollLeft) rail.scrollTo({left,behavior:'instant'});
        else if (left + link.offsetWidth > rail.scrollLeft + rail.clientWidth)
          rail.scrollTo({left:left + link.offsetWidth - rail.clientWidth,behavior:'instant'});
      }
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(updateCurrent); };
  const measure = () => {
    headerHeight = mobile.matches ? header.getBoundingClientRect().height : 0;
    navHeight = mobile.matches ? nav.getBoundingClientRect().height : 0;
    document.body.style.setProperty('--faq-header-height',`${headerHeight}px`);
    document.body.style.setProperty('--faq-topic-height',`${navHeight}px`);
    schedule();
  };
  const followHash = (initial = false) => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target || !hub.contains(target)) return;
    if (target.matches('details')) target.open = true;
    measure();
    // Initial fragment positioning may precede measured sticky geometry.
    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    requestAnimationFrame(() => target.scrollIntoView({behavior:initial || reduced ? 'instant' : 'smooth',block:'start'}));
  };
  new ResizeObserver(measure).observe(header);
  new ResizeObserver(measure).observe(nav);
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',measure,{passive:true});
  mobile.addEventListener('change',measure);
  window.addEventListener('hashchange',() => followHash());
  measure();
  if (location.hash) followHash(true);
}
