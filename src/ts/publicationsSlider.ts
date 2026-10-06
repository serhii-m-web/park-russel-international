import Swiper from 'swiper';
import { A11y, Keyboard, Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';

export function initPublicationsSlider(root: ParentNode = document): void {
  const sections = root.querySelectorAll<HTMLElement>(
    '[data-publications-slider]',
  );
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const mq = window.matchMedia('(max-width: 1023px)');

  sections.forEach((section) => {
    const slider = section.querySelector<HTMLElement>(
      '[data-publications-slider-el]',
    );
    if (!slider) return;

    const nextEl = section.querySelector<HTMLElement>(
      '[data-publications-slider-next]',
    );
    const prevEl = section.querySelector<HTMLElement>(
      '[data-publications-slider-prev]',
    );
    const scrollbarEl = section.querySelector<HTMLElement>(
      '[data-publications-slider-scrollbar]',
    );

    let swiper: Swiper | null = null;

    const enable = () => {
      if (swiper || !mq.matches) return;

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
      if (!swiper) return;
      swiper.destroy(true, true);
      swiper = null;
    };

    const sync = () => {
      if (mq.matches) enable();
      else disable();
    };

    sync();
    mq.addEventListener('change', sync);
  });
}
