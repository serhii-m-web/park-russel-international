import Swiper from 'swiper';
import { A11y, Keyboard, Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';

export function initRiskPerspectiveSlider(root: ParentNode = document): void {
  const sections = root.querySelectorAll<HTMLElement>(
    '[data-risk-perspective-slider]',
  );
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const mq = window.matchMedia('(max-width: 767px)');

  sections.forEach((section) => {
    const slider = section.querySelector<HTMLElement>(
      '[data-risk-perspective-slider-el]',
    );
    if (!slider) return;

    const nextEl = section.querySelector<HTMLElement>(
      '[data-risk-perspective-slider-next]',
    );
    const prevEl = section.querySelector<HTMLElement>(
      '[data-risk-perspective-slider-prev]',
    );
    const scrollbarEl = section.querySelector<HTMLElement>(
      '[data-risk-perspective-slider-scrollbar]',
    );
    const navEl = section.querySelector<HTMLElement>(
      '[data-risk-perspective-slider-nav]',
    );
    const carouselLabel =
      slider.dataset.riskPerspectiveSliderLabel?.trim() || '';

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

    const clearInlineSizes = () => {
      slider
        .querySelectorAll<HTMLElement>('.swiper-slide')
        .forEach((slide) => {
          slide.style.removeProperty('width');
          slide.style.removeProperty('margin-right');
        });

      const wrapper = slider.querySelector<HTMLElement>('.swiper-wrapper');
      wrapper?.style.removeProperty('transform');
      wrapper?.style.removeProperty('width');
    };

    const enable = () => {
      if (swiper || !mq.matches) return;
      if (slider.clientWidth <= 0) return;

      setCarouselAttrs(true);

      swiper = new Swiper(slider, {
        modules: [Navigation, Scrollbar, A11y, Keyboard],
        slidesPerView: 1.15,
        spaceBetween: 16,
        watchOverflow: true,
        observer: true,
        observeParents: true,
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
        },
      });
    };

    const disable = () => {
      if (swiper) {
        swiper.destroy(true, true);
        swiper = null;
      }
      clearInlineSizes();
      setCarouselAttrs(false);
    };

    const sync = () => {
      if (mq.matches) {
        window.requestAnimationFrame(() => {
          enable();
          swiper?.update();
        });
        return;
      }

      disable();
    };

    sync();
    mq.addEventListener('change', sync);
  });
}
