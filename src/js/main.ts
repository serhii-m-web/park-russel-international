import '../styles/main.scss';
import { initCardsContentSlider } from './cardsContentSlider';
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
  initCardsContentSlider();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
