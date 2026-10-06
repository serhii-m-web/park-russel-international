export function initSectionTabs(root: ParentNode = document): void {
  const horizontalMq = window.matchMedia('(max-width: 1023px)');

  root.querySelectorAll<HTMLElement>('[data-section-tabs]').forEach((section) => {
    const tablist = section.querySelector<HTMLElement>('[role="tablist"]');
    const triggers = Array.from(
      section.querySelectorAll<HTMLButtonElement>('[data-tabs-trigger]'),
    );
    const panels = Array.from(
      section.querySelectorAll<HTMLElement>('[data-tabs-panel]'),
    );

    if (!triggers.length || !panels.length) return;

    const syncOrientation = () => {
      if (!tablist) return;
      tablist.setAttribute(
        'aria-orientation',
        horizontalMq.matches ? 'horizontal' : 'vertical',
      );
    };

    const activate = (trigger: HTMLButtonElement) => {
      const targetId = trigger.dataset.tabsTarget;
      if (!targetId) return;

      triggers.forEach((button) => {
        const isActive = button === trigger;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', String(isActive));
        button.tabIndex = isActive ? 0 : -1;
      });

      panels.forEach((panel) => {
        const isActive = panel.id === targetId;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
        panel.tabIndex = isActive ? 0 : -1;
      });

      trigger.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth',
      });
    };

    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => {
        activate(trigger);
      });

      trigger.addEventListener('keydown', (event) => {
        let nextIndex: number | null = null;
        const isHorizontal = horizontalMq.matches;

        if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = triggers.length - 1;
        } else if (isHorizontal) {
          if (event.key === 'ArrowRight') nextIndex = (index + 1) % triggers.length;
          else if (event.key === 'ArrowLeft') {
            nextIndex = (index - 1 + triggers.length) % triggers.length;
          }
        } else if (event.key === 'ArrowDown') {
          nextIndex = (index + 1) % triggers.length;
        } else if (event.key === 'ArrowUp') {
          nextIndex = (index - 1 + triggers.length) % triggers.length;
        }

        if (nextIndex === null) return;

        event.preventDefault();
        const nextTrigger = triggers[nextIndex];
        activate(nextTrigger);
        nextTrigger.focus();
      });
    });

    syncOrientation();
    horizontalMq.addEventListener('change', syncOrientation);
  });
}
