export function initSectionFaq(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-section-faq]').forEach((section) => {
    const items = Array.from(
      section.querySelectorAll<HTMLElement>('[data-faq-item]'),
    );

    if (!items.length) return;

    const setOpen = (target: HTMLElement, open: boolean) => {
      const trigger = target.querySelector<HTMLButtonElement>('[data-faq-trigger]');
      const panel = target.querySelector<HTMLElement>('[data-faq-panel]');
      if (!trigger || !panel) return;

      target.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    };

    items.forEach((item) => {
      const trigger = item.querySelector<HTMLButtonElement>('[data-faq-trigger]');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');

        items.forEach((other) => {
          setOpen(other, willOpen && other === item);
        });
      });
    });
  });
}
