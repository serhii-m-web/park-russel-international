export function initNavActive(root: ParentNode = document): void {
  const path = window.location.pathname.replace(/\\/g, '/');
  const page = path.split('/').pop() || '';
  const isHome = page === '' || page === 'index.html';

  if (!isHome) return;

  root.querySelectorAll<HTMLElement>('[data-nav-home]').forEach((link) => {
    link.classList.add('is-active');
    link.setAttribute('aria-current', 'page');
  });
}
