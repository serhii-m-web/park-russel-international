import Swiper from 'swiper';
import { A11y, Keyboard, Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';

export function initCardsContentSlider(root: ParentNode = document): void {
  const sections = root.querySelectorAll<HTMLElement>(
    '[data-cards-content-slider]',
  );
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const mq = window.matchMedia('(max-width: 1023px)');

  sections.forEach((section) => {
    const slider = section.querySelector<HTMLElement>(
      '[data-cards-content-slider-el]',
    );
    if (!slider) return;

    const nextEl = section.querySelector<HTMLElement>(
      '[data-cards-content-slider-next]',
    );
    const prevEl = section.querySelector<HTMLElement>(
      '[data-cards-content-slider-prev]',
    );
    const scrollbarEl = section.querySelector<HTMLElement>(
      '[data-cards-content-slider-scrollbar]',
    );
    const navEl = section.querySelector<HTMLElement>(
      '[data-cards-content-slider-nav]',
    );
    const carouselLabel = slider.dataset.cardsContentSliderLabel?.trim() || '';

    let swiper: Swiper | null = null;

    const setCarouselAttrs = (enabled: boolean) => {
      if (enabled) {
        slider.setAttribute('aria-roledescription', 'carousel');
        if (carouselLabel) {
          slider.setAttribute('aria-label', carouselLabel);
        }
        navEl?.removeAttribute('inert');
      } else {
        slider.removeAttribute('aria-roledescription');
        slider.removeAttribute('aria-label');
        navEl?.setAttribute('inert', '');
      }
    };

    const enable = () => {
      if (swiper || !mq.matches) return;

      setCarouselAttrs(true);

      swiper = new Swiper(slider, {
        modules: [Navigation, Scrollbar, A11y, Keyboard],
        slidesPerView: 1.15,
        spaceBetween: 16,
        watchOverflow: true,
        speed: prefersReducedMotion ? 0 : 400,
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        navigation: { nextEl, prevEl },
        scrollbar: scrollbarEl
          ? { el: scrollbarEl, draggable: true, hide: false }
          : undefined,
        a11y: {
          enabled: true,
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          slideLabelMessage: '{{index}} / {{slidesLength}}',
        },
        breakpoints: {
          480: {
            slidesPerView: 1.35,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 2.15,
            spaceBetween: 20,
          },
        },
      });
    };

    const disable = () => {
      if (swiper) {
        swiper.destroy(true, true);
        swiper = null;
      }
      setCarouselAttrs(false);
    };

    const sync = () => {
      if (mq.matches) enable();
      else disable();
    };

    sync();
    mq.addEventListener('change', sync);
  });
}
