import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const tree = document.getElementById('event-tree');
  if (!tree) return;

  const log = document.getElementById('tree-log');
  let count = 0;

  // Observe attribute changes on tree items to log select/expand/collapse
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type !== 'attributes') continue;
      const item = m.target;
      const label = item.querySelector(':scope > [slot="label"]')?.textContent?.trim() ?? '?';
      if (m.attributeName === 'selected' && item.hasAttribute('selected')) {
        count++;
        logPrepend(log, `#${count} selected — "${label}"`);
      } else if (m.attributeName === 'expanded') {
        count++;
        const expanded = item.hasAttribute('expanded');
        logPrepend(log, `#${count} ${expanded ? 'expanded' : 'collapsed'} — "${label}"`);
      }
    }
  });

  tree.querySelectorAll('n-tree-item').forEach((item) => {
    observer.observe(item, { attributes: true, attributeFilter: ['selected', 'expanded'] });
  });
});
