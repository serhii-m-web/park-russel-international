export function initMegaMenu(root: ParentNode = document): void {
  const items = Array.from(
    root.querySelectorAll<HTMLElement>('.site-header__menu-item--has-mega'),
  );
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const closeDelayMs = 180;
  const closeTimers = new WeakMap<HTMLElement, number>();

  const isOpen = (item: HTMLElement) => item.classList.contains('is-open');

  const clearCloseTimer = (item: HTMLElement) => {
    const timerId = closeTimers.get(item);
    if (timerId === undefined) return;
    window.clearTimeout(timerId);
    closeTimers.delete(item);
  };

  const closeItem = (item: HTMLElement) => {
    clearCloseTimer(item);
    const trigger = item.querySelector<HTMLButtonElement>('[data-mega-trigger]');
    const panel = item.querySelector<HTMLElement>('[data-mega-panel]');
    if (!trigger || !panel) return;

    trigger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
    item.classList.remove('is-open');
  };

  const closeAll = (except?: HTMLElement) => {
    items.forEach((item) => {
      if (item !== except) closeItem(item);
    });
  };

  const scheduleClose = (item: HTMLElement) => {
    clearCloseTimer(item);
    const timerId = window.setTimeout(() => closeItem(item), closeDelayMs);
    closeTimers.set(item, timerId);
  };

  items.forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>('[data-mega-trigger]');
    const panel = item.querySelector<HTMLElement>('[data-mega-panel]');

    if (!trigger || !panel) return;

    panel.inert = true;

    const open = () => {
      clearCloseTimer(item);
      closeAll(item);
      trigger.setAttribute('aria-expanded', 'true');
      panel.setAttribute('aria-hidden', 'false');
      panel.inert = false;
      item.classList.add('is-open');
    };

    if (canHover) {
      trigger.addEventListener('mouseenter', open);
      trigger.addEventListener('mouseleave', () => scheduleClose(item));

      // Keep open only when already visible — do not open from empty hover area.
      panel.addEventListener('mouseenter', () => {
        if (!isOpen(item)) return;
        clearCloseTimer(item);
      });
      panel.addEventListener('mouseleave', () => {
        if (!isOpen(item)) return;
        scheduleClose(item);
      });
    }

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (canHover) {
        open();
        return;
      }

      if (isOpen(item)) closeItem(item);
      else open();
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target as Node | null;
    if (!target) return;

    const openItem = items.find((item) => isOpen(item));
    if (!openItem || openItem.contains(target)) return;
    closeItem(openItem);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });
}
