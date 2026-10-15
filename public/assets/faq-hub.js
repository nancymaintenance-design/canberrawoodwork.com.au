// Native anchors and details work without this enhancement.
const hub = document.querySelector('.faq-hub');
if (hub) {
  const header = document.querySelector('.site-header');
  const nav = hub.querySelector('.faq-topic-nav');
  const rail = nav.querySelector('.faq-topic-links');
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const groups = [...hub.querySelectorAll('.faq-group')];
  const questions = [...hub.querySelectorAll('.faq-item')];
  const filter = hub.querySelector('.faq-filter');
  const input = filter.querySelector('input');
  const status = filter.querySelector('[role="status"]');
  const normalize = text => text.toLocaleLowerCase('en-AU').replace(/\s+/g,' ').trim();
  const searchable = new Map(questions.map(item => [item,normalize(`${item.querySelector('summary').textContent} ${item.querySelector('p').textContent}`)]));
  const mobile = window.matchMedia('(max-width:700px)');
  let headerHeight = 0;
  let navHeight = 0;
  let current;
  let frame;

  const updateCurrent = () => {
    frame = undefined;
    const line = headerHeight + navHeight + 32;
    const visible = groups.filter(group => !group.hidden);
    let selected = visible[0];
    for (const group of visible) {
      if (group.getBoundingClientRect().top <= line) selected = group;
    }
    if (current === selected?.id) return;
    current = selected?.id;
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
    if (mobile.matches && !document.body.classList.contains('faq-compact')) {
      document.body.style.setProperty('--faq-header-expanded',`${headerHeight}px`);
      document.body.style.setProperty('--faq-topic-expanded',`${navHeight}px`);
    }
    schedule();
  };
  const applyFilter = () => {
    const query = normalize(input.value);
    let count = 0;
    for (const item of questions) {
      item.hidden = !searchable.get(item).includes(query);
      if (!item.hidden) count++;
    }
    for (const [index,group] of groups.entries()) {
      const matches = [...group.querySelectorAll('.faq-item')].filter(item => !item.hidden).length;
      group.hidden = matches === 0;
      links[index].querySelector('.faq-topic-count').textContent = matches;
      group.querySelector('[data-faq-group-count]').textContent = `${matches} ${matches === 1 ? 'QUESTION' : 'QUESTIONS'}`;
    }
    status.textContent = `${count} of ${questions.length} questions`;
    filter.querySelector('.faq-no-results').hidden = count !== 0;
    // Keep navigation state in step with the result count, including no groups.
    if (frame) cancelAnimationFrame(frame);
    updateCurrent();
  };
  const compactHeader = () => {
    const compact = mobile.matches && window.scrollY > 120;
    if (document.body.classList.contains('faq-compact') !== compact) {
      document.body.classList.toggle('faq-compact',compact);
      measure();
    }
  };
  const followHash = (initial = false) => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target || !hub.contains(target)) return;
    // All aliases belong to one original answer, including native no-JS targets.
    if (input.value) { input.value = ''; applyFilter(); }
    const disclosure = target.closest('details');
    if (disclosure) disclosure.open = true;
    const destination = disclosure || target;
    if (mobile.matches) document.body.classList.add('faq-compact');
    measure();
    // Initial fragment positioning may precede measured sticky geometry.
    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    requestAnimationFrame(() => {
      destination.scrollIntoView({behavior:initial || reduced ? 'instant' : 'smooth',block:'start'});
      if (disclosure) disclosure.querySelector('summary').focus({preventScroll:true});
    });
  };
  document.body.classList.add('faq-enhanced');
  filter.hidden = false;
  input.addEventListener('input',applyFilter);
  filter.querySelector('button').addEventListener('click',() => { input.value = ''; applyFilter(); input.focus(); });
  new ResizeObserver(measure).observe(header);
  new ResizeObserver(measure).observe(nav);
  window.addEventListener('scroll',() => { compactHeader(); schedule(); },{passive:true});
  window.addEventListener('resize',measure,{passive:true});
  mobile.addEventListener('change',() => { compactHeader(); measure(); });
  window.addEventListener('hashchange',() => followHash());
  nav.addEventListener('click',event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && link.hash === location.hash) {
      event.preventDefault();
      followHash();
    }
  });
  measure(); compactHeader();
  if (location.hash) followHash(true);
}
