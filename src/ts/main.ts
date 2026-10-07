import '../styles/main.scss';
import { initCardsContentSlider } from './cardsContentSlider';
import { initMegaMenu } from './megaMenu';
import { initMethodologySlider } from './methodologySlider';
import { initMobileNav } from './mobileNav';
import { initPublicationsSlider } from './publicationsSlider';
import { initRiskPerspectiveSlider } from './riskPerspectiveSlider';
import { initSectionFaq } from './sectionFaq';
import { initSectionSlider } from './sectionSlider';
import { initSectionTabs } from './sectionTabs';
import { initStakeholdersSlider } from './stakeholdersSlider';
import { initStructureSlider } from './structureSlider';

function init(): void {
  document.documentElement.classList.add('js');
  initMegaMenu();
  initMobileNav();
  initSectionSlider();
  initPublicationsSlider();
  initCardsContentSlider();
  initRiskPerspectiveSlider();
  initMethodologySlider();
  initStructureSlider();
  initStakeholdersSlider();
  initSectionTabs();
  initSectionFaq();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
