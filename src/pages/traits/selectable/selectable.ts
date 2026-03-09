import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('single-log')) return;

  // ── Log helpers (defined before use) ──

  const multiLogEl = document.getElementById('multi-log');
  function multiLog(msg) { appendLog(multiLogEl, msg); }

  const singleLogEl = document.getElementById('single-log');
  function singleLog(msg) { appendLog(singleLogEl, msg); }

  // ── Multiple Selection ──

  const multiList = document.querySelector('n-controller[selectable-mode="multiple"]')?.querySelector('.select-list');
  multiList?.addEventListener('native:selection-change', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    const { selected, count } = ce.detail;
    const names = selected.map((el) => el.textContent).join(', ');
    multiLog(`Selected ${count}: ${names || 'none'}`);
  });

  // ── Single Selection ──

  const singleList = document.querySelector('n-controller[selectable-mode="single"]')?.querySelector('.select-list');
  singleList?.addEventListener('native:selection-change', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    const { selected } = ce.detail;
    const name = selected[0]?.textContent ?? 'none';
    singleLog(`Selected: ${name}`);
  });
});
