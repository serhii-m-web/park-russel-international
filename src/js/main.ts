import '../styles/main.scss';
import { initMegaMenu } from './megaMenu';
import { initMobileNav } from './mobileNav';
import { initSectionSlider } from './sectionSlider';

function init(): void {
  document.documentElement.classList.add('js');
  initMegaMenu();
  initMobileNav();
  initSectionSlider();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
