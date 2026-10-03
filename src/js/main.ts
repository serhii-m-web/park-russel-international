import '../styles/main.scss';
import { initMegaMenu } from './megaMenu';
import { initMobileNav } from './mobileNav';

function init(): void {
  document.documentElement.classList.add('js');
  initMegaMenu();
  initMobileNav();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
