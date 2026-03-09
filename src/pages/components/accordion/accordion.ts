import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const accordion = document.getElementById('event-accordion');
  if (!accordion) return;

  const log = document.getElementById('accordion-log');
  let count = 0;

  accordion.addEventListener('toggle', (e) => {
    const item = e.target?.closest('n-accordion-item');
    if (!item) return;
    const heading = item.querySelector('[slot="heading"]')?.textContent?.trim() ?? '?';
    const isOpen = item.hasAttribute('open');
    count++;
    logPrepend(log, `#${count} ${isOpen ? 'opened' : 'closed'} — "${heading}"`);
  }, true);
});
