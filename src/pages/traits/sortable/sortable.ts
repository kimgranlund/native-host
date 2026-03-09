import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('sortable-page')) return;

  // ── Basic Table Sort ──

  const basicWrapper = document.getElementById('basic-wrapper');
  basicWrapper?.addEventListener('native:sort', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    const { column, direction } = ce.detail;
    const tbody = basicWrapper.querySelector('tbody');
    if (!tbody) return;
    const rows = [...tbody.querySelectorAll('tr')];
    const headers = [...basicWrapper.querySelectorAll('th')];
    const colIndex = headers.findIndex(h => h.textContent?.trim() === column);
    if (direction === 'none') return;
    rows.sort((a, b) => {
      const aVal = a.children[colIndex]?.textContent ?? '';
      const bVal = b.children[colIndex]?.textContent ?? '';
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
      return direction === 'asc' ? cmp : -cmp;
    });
    for (const row of rows) tbody.appendChild(row);
  });

  // ── Custom Selector Sort ──

  const customWrapper = document.getElementById('custom-wrapper');
  customWrapper?.addEventListener('native:sort', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    const { column, direction } = ce.detail;
    const tbody = customWrapper.querySelector('tbody');
    if (!tbody) return;
    const rows = [...tbody.querySelectorAll('tr')];
    const headers = [...customWrapper.querySelectorAll('[data-column]')];
    const colIndex = headers.findIndex(h => /** @type {HTMLElement} */ (h).dataset.column === column);
    if (direction === 'none') return;
    rows.sort((a, b) => {
      const aVal = a.children[colIndex]?.textContent ?? '';
      const bVal = b.children[colIndex]?.textContent ?? '';
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
      return direction === 'asc' ? cmp : -cmp;
    });
    for (const row of rows) tbody.appendChild(row);
  });

  const basicLogEl = document.getElementById('basic-log');
  basicWrapper?.addEventListener('native:sort', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(basicLogEl, `Sort: ${ce.detail.column} ${ce.detail.direction}`);
  });

  const customLogEl = document.getElementById('custom-log');
  customWrapper?.addEventListener('native:sort', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(customLogEl, `Sort: ${ce.detail.column} ${ce.detail.direction}`);
  });
});
