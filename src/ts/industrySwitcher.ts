const DRAG_THRESHOLD_PX = 6;

function markActiveChip(list: HTMLElement): void {
  const page =
    window.location.pathname.replace(/\\/g, '/').split('/').pop() || '';

  list
    .querySelectorAll<HTMLAnchorElement>('.section-industry-switcher__chip')
    .forEach((chip) => {
      const href = chip.getAttribute('href')?.split('/').pop() || '';
      const isActive = Boolean(page) && href === page;

      chip.classList.toggle('is-active', isActive);

      if (isActive) {
        chip.setAttribute('aria-current', 'page');
        chip.scrollIntoView({
          inline: 'center',
          block: 'nearest',
          behavior: 'auto',
        });
      } else {
        chip.removeAttribute('aria-current');
      }
    });
}

export function initIndustrySwitcher(root: ParentNode = document): void {
  const lists = root.querySelectorAll<HTMLElement>(
    '.section-industry-switcher__list',
  );

  lists.forEach((list) => {
    markActiveChip(list);

    let isDragging = false;
    let pointerId: number | null = null;
    let startX = 0;
    let startScrollLeft = 0;
    let didDrag = false;

    const stopDragging = (event?: PointerEvent): void => {
      if (!isDragging) return;

      if (
        event &&
        pointerId !== null &&
        list.hasPointerCapture(pointerId)
      ) {
        list.releasePointerCapture(pointerId);
      }

      isDragging = false;
      pointerId = null;
      list.classList.remove('is-dragging');
    };

    list.addEventListener('pointerdown', (event) => {
      // Touch already scrolls via overflow; only add drag for mouse/pen.
      if (event.pointerType === 'touch' || event.button !== 0) return;

      isDragging = true;
      didDrag = false;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = list.scrollLeft;
      list.classList.add('is-dragging');
      list.setPointerCapture(event.pointerId);
    });

    list.addEventListener('pointermove', (event) => {
      if (!isDragging || event.pointerId !== pointerId) return;

      const deltaX = event.clientX - startX;
      if (Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
        didDrag = true;
      }

      list.scrollLeft = startScrollLeft - deltaX;
    });

    list.addEventListener('pointerup', stopDragging);
    list.addEventListener('pointercancel', stopDragging);
    list.addEventListener('lostpointercapture', () => {
      isDragging = false;
      pointerId = null;
      list.classList.remove('is-dragging');
    });

    // Avoid navigating when the gesture was a drag, not a click.
    list.addEventListener(
      'click',
      (event) => {
        if (!didDrag) return;
        event.preventDefault();
        event.stopPropagation();
        didDrag = false;
      },
      true,
    );

    // Map vertical mouse wheel to horizontal scroll while hovering the list.
    list.addEventListener(
      'wheel',
      (event) => {
        if (list.scrollWidth <= list.clientWidth) return;

        const delta =
          Math.abs(event.deltaX) > Math.abs(event.deltaY)
            ? event.deltaX
            : event.deltaY;

        if (delta === 0) return;

        const atStart = list.scrollLeft <= 0 && delta < 0;
        const atEnd =
          list.scrollLeft + list.clientWidth >= list.scrollWidth - 1 &&
          delta > 0;

        if (atStart || atEnd) return;

        event.preventDefault();
        list.scrollLeft += delta;
      },
      { passive: false },
    );
  });
}
