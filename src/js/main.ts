import '../styles/main.scss';
import { initMegaMenu } from './megaMenu';
import { initMobileNav } from './mobileNav';
import { initPublicationsSlider } from './publicationsSlider';
import { initSectionSlider } from './sectionSlider';

function init(): void {
  document.documentElement.classList.add('js');
  initMegaMenu();
  initMobileNav();
  initSectionSlider();
  initPublicationsSlider();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
