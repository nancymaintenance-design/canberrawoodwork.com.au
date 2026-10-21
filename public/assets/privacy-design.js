(() => {
 let clickPriorityUntil = 0;
 const links = [...document.querySelectorAll('.craft-index a')];
 const activate = id => links.forEach(link => {
  const active = link.hash === '#' + id;
  link.classList.toggle('is-active', active);
  if (active) link.setAttribute('aria-current', 'location');
  else link.removeAttribute('aria-current');
 });
 links.forEach(link => link.addEventListener('click', () => {
  clickPriorityUntil = performance.now() + 1000;
  activate(link.hash.slice(1));
 }));
 if (!('IntersectionObserver' in window)) return;
 const observer = new IntersectionObserver(entries => {
  if (performance.now() < clickPriorityUntil) return;
  const visible = entries.find(entry => entry.isIntersecting);
  if (visible) activate(visible.target.id);
 }, {rootMargin: '-12% 0px -48% 0px'});
 document.querySelectorAll('.craft-section').forEach(section => observer.observe(section));
})();
