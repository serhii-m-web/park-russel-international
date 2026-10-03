export function initMobileNav(root: ParentNode = document): void {
  const nav = root.querySelector<HTMLElement>('[data-mobile-nav]');
  const openBtn = root.querySelector<HTMLButtonElement>('[data-mobile-open-nav]');
  if (!nav || !openBtn) return;

  const closeBtn = nav.querySelector<HTMLButtonElement>('[data-mobile-close]');
  const rootScreen = nav.querySelector<HTMLElement>('[data-mobile-screen="root"]');
  const panels = Array.from(
    nav.querySelectorAll<HTMLElement>('[data-mobile-panel]'),
  );
  const mq = window.matchMedia('(max-width: 1023px)');

  const isNavOpen = () => nav.classList.contains('is-open');

  const setExpanded = (expanded: boolean) => {
    openBtn.setAttribute('aria-expanded', String(expanded));
  };

  const setLayerState = (layer: HTMLElement, active: boolean) => {
    layer.classList.toggle('is-active', active);
    // Prefer inert over aria-hidden so focused descendants cannot be "hidden".
    layer.inert = !active;
    layer.removeAttribute('aria-hidden');
  };

  const focusIn = (container: HTMLElement | null | undefined) => {
    if (!container) return;

    const target =
      container.querySelector<HTMLElement>('[data-mobile-back]') ??
      container.querySelector<HTMLElement>('[data-mobile-open]') ??
      container.querySelector<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );

    target?.focus({ preventScroll: true });
  };

  const leaveLayer = (layer: HTMLElement, fallback?: HTMLElement | null) => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || !layer.contains(active)) return;

    if (fallback && !fallback.inert) {
      focusIn(fallback);
    }

    if (layer.contains(document.activeElement)) {
      active.blur();
    }
  };

  const showRoot = (options?: { moveFocus?: boolean }) => {
    if (rootScreen) setLayerState(rootScreen, true);
    if (options?.moveFocus) focusIn(rootScreen);

    panels.forEach((panel) => {
      leaveLayer(panel, rootScreen);
      setLayerState(panel, false);
    });

    nav.dataset.mobileView = 'root';
  };

  const showPanel = (name: string) => {
    const targetPanel = panels.find((panel) => panel.dataset.mobilePanel === name);
    if (!targetPanel) return;

    setLayerState(targetPanel, true);
    focusIn(targetPanel);

    if (rootScreen) {
      leaveLayer(rootScreen, targetPanel);
      setLayerState(rootScreen, false);
    }

    panels.forEach((panel) => {
      if (panel === targetPanel) return;
      leaveLayer(panel, targetPanel);
      setLayerState(panel, false);
    });

    nav.dataset.mobileView = name;
  };

  const openNav = () => {
    showRoot();
    nav.inert = false;
    nav.removeAttribute('aria-hidden');
    document.documentElement.classList.add('is-mobile-nav-open');
    setExpanded(true);

    window.requestAnimationFrame(() => {
      nav.classList.add('is-open');
      closeBtn?.focus({ preventScroll: true });
    });
  };

  const closeNav = () => {
    if (!isNavOpen()) return;

    openBtn.focus({ preventScroll: true });

    nav.classList.remove('is-open');
    document.documentElement.classList.remove('is-mobile-nav-open');
    setExpanded(false);

    window.setTimeout(() => {
      if (isNavOpen()) return;
      nav.inert = true;
      showRoot();
    }, 300);
  };

  showRoot();

  openBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (!mq.matches) return;
    if (isNavOpen()) closeNav();
    else openNav();
  });

  closeBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    closeNav();
  });

  nav.querySelectorAll<HTMLElement>('[data-mobile-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.mobileOpen;
      if (!target) return;
      showPanel(target);
    });
  });

  nav.querySelectorAll<HTMLElement>('[data-mobile-back]').forEach((button) => {
    button.addEventListener('click', () => showRoot({ moveFocus: true }));
  });

  nav.querySelectorAll<HTMLElement>('[data-mobile-acc]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest<HTMLElement>('.mobile-nav__acc');
      const accordion = item?.closest('.mobile-nav__accordion');
      if (!item || !accordion) return;

      const willOpen = !item.classList.contains('is-open');

      accordion.querySelectorAll<HTMLElement>('.mobile-nav__acc').forEach((acc) => {
        const accTrigger = acc.querySelector<HTMLButtonElement>('[data-mobile-acc]');
        const accBody = acc.querySelector<HTMLElement>('.mobile-nav__acc-body');
        const isCurrent = acc === item && willOpen;

        acc.classList.toggle('is-open', isCurrent);
        accTrigger?.setAttribute('aria-expanded', String(isCurrent));
        if (accBody) accBody.hidden = !isCurrent;
      });
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isNavOpen()) closeNav();
  });

  mq.addEventListener('change', () => {
    if (!mq.matches) closeNav();
  });
}
