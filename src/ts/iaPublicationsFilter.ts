const ALL_CATEGORY = 'all';

function normalizeCategory(value: string | null | undefined): string {
  const slug = value?.trim().toLowerCase();
  return slug || ALL_CATEGORY;
}

function getCategoryFromUrl(): string {
  const params = new URLSearchParams(window.location.search);
  return normalizeCategory(params.get('category'));
}

function setCategoryInUrl(category: string): void {
  const url = new URL(window.location.href);

  if (category === ALL_CATEGORY) {
    url.searchParams.delete('category');
  } else {
    url.searchParams.set('category', category);
  }

  window.history.replaceState(null, '', url);
}

function setLinkActive(link: HTMLAnchorElement, active: boolean): void {
  link.classList.toggle('is-active', active);

  if (active) {
    link.setAttribute('aria-current', 'page');
  } else {
    link.removeAttribute('aria-current');
  }
}

export function initIaPublicationsFilter(root: ParentNode = document): void {
  root
    .querySelectorAll<HTMLElement>('[data-ia-publications-filters]')
    .forEach((section) => {
      const filterLinks = Array.from(
        section.querySelectorAll<HTMLAnchorElement>(
          '[data-ia-publications-filter]',
        ),
      );
      const cards = Array.from(
        section.querySelectorAll<HTMLElement>('.section-ia-body__pub-card'),
      );
      const emptyEl = section.querySelector<HTMLElement>(
        '[data-ia-publications-empty]',
      );
      const sliderWrap = section.querySelector<HTMLElement>(
        '[data-ia-publications-slider]',
      );

      if (!filterLinks.length || !cards.length) return;

      const apply = (rawCategory: string, syncUrl = true) => {
        const category = normalizeCategory(rawCategory);
        const knownCategories = new Set(
          filterLinks.map((link) =>
            normalizeCategory(link.dataset.iaPublicationsFilter),
          ),
        );
        const nextCategory = knownCategories.has(category)
          ? category
          : ALL_CATEGORY;

        let visibleCount = 0;

        cards.forEach((card) => {
          const cardCategory =
            card.dataset.iaPublicationsCategory?.trim().toLowerCase() || '';
          // Cards without a category slug appear only in "all" (WP posts without term).
          const isVisible =
            nextCategory === ALL_CATEGORY ||
            (cardCategory !== '' && cardCategory === nextCategory);

          card.hidden = !isVisible;
          card.classList.toggle('swiper-slide', isVisible);
          card.setAttribute('aria-hidden', String(!isVisible));

          if (isVisible) visibleCount += 1;
        });

        filterLinks.forEach((link) => {
          const linkCategory = normalizeCategory(
            link.dataset.iaPublicationsFilter,
          );
          setLinkActive(link, linkCategory === nextCategory);
        });

        section
          .querySelectorAll<HTMLElement>('.section-ia-body__nav-item')
          .forEach((item) => {
            const hasActiveLink = Boolean(
              item.querySelector('.section-ia-body__nav-link.is-active'),
            );
            item.classList.toggle('is-active', hasActiveLink);
          });

        if (emptyEl) {
          emptyEl.hidden = visibleCount > 0;
        }

        if (sliderWrap) {
          sliderWrap.hidden = visibleCount === 0;
          sliderWrap.dispatchEvent(
            new CustomEvent('ia-publications:filter-change', {
              bubbles: true,
            }),
          );
        }

        if (syncUrl) {
          setCategoryInUrl(nextCategory);
        }
      };

      filterLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          apply(normalizeCategory(link.dataset.iaPublicationsFilter), true);
        });
      });

      apply(getCategoryFromUrl(), false);
    });
}
