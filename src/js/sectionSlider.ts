import Swiper from 'swiper';
import { A11y, Keyboard, Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';

export function initSectionSlider(root: ParentNode = document): void {
  const sections = root.querySelectorAll<HTMLElement>('[data-section-slider]');
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  sections.forEach((section) => {
    const slider = section.querySelector<HTMLElement>(
      '[data-section-slider-el]',
    );
    if (!slider || slider.dataset.sliderReady === 'true') return;

    const nextEl = section.querySelector<HTMLElement>(
      '[data-section-slider-next]',
    );
    const prevEl = section.querySelector<HTMLElement>(
      '[data-section-slider-prev]',
    );
    const scrollbarEl = section.querySelector<HTMLElement>(
      '[data-section-slider-scrollbar]',
    );

    new Swiper(slider, {
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
        320: { slidesPerView: 1.15, spaceBetween: 12 },
        480: { slidesPerView: 1.4, spaceBetween: 16 },
        768: { slidesPerView: 2.2, spaceBetween: 24 },
        1024: { slidesPerView: 2.5, spaceBetween: 32 },
      },
    });

    slider.dataset.sliderReady = 'true';
  });
}
