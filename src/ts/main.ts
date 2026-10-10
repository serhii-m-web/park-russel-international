import '../styles/main.scss';
import { initCardsContentSlider } from './cardsContentSlider';
import { initDesignDefendSlider } from './designDefendSlider';
import { initFeatureItemsSlider } from './featureItemsSlider';
import { initFollowValueSlider } from './followValueSlider';
import { initMegaMenu } from './megaMenu';
import { initMethodologySlider } from './methodologySlider';
import { initMobileNav } from './mobileNav';
import { initProcessRampSlider } from './processRampSlider';
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
  initDesignDefendSlider();
  initFollowValueSlider();
  initFeatureItemsSlider();
  initProcessRampSlider();
  initSectionTabs();
  initSectionFaq();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
