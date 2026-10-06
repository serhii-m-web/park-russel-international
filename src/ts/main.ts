import '../styles/main.scss';
import { initCardsContentSlider } from './cardsContentSlider';
import { initMegaMenu } from './megaMenu';
import { initMethodologySlider } from './methodologySlider';
import { initMobileNav } from './mobileNav';
import { initPublicationsSlider } from './publicationsSlider';
import { initRiskPerspectiveSlider } from './riskPerspectiveSlider';
import { initSectionSlider } from './sectionSlider';
import { initSectionTabs } from './sectionTabs';

function init(): void {
  document.documentElement.classList.add('js');
  initMegaMenu();
  initMobileNav();
  initSectionSlider();
  initPublicationsSlider();
  initCardsContentSlider();
  initRiskPerspectiveSlider();
  initMethodologySlider();
  initSectionTabs();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
