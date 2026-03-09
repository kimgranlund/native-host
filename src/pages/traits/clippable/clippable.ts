import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const copyList = document.getElementById('copy-list');
  if (!copyList) return;

  // ── Copy & Paste list ──

  const copyLogEl = document.getElementById('copy-log');

  copyList.addEventListener('native:selection-change', (e) => {
    appendLog(copyLogEl, `Selected ${/** @type {CustomEvent} */ (e).detail.count} item(s)`);
  });

  copyList.addEventListener('native:clip-copy', (e) => {
    const d = /** @type {CustomEvent} */ (e).detail;
    appendLog(copyLogEl, `Copied ${d.items.length} item(s): "${d.data}"`);
  });

  // ── Cut & Paste list ──

  const cutList = document.getElementById('cut-list');
  const cutLogEl = document.getElementById('cut-log');

  cutList?.addEventListener('native:selection-change', (e) => {
    appendLog(cutLogEl, `Selected ${/** @type {CustomEvent} */ (e).detail.count} item(s)`);
  });

  cutList?.addEventListener('native:clip-cut', (e) => {
    const d = /** @type {CustomEvent} */ (e).detail;
    appendLog(cutLogEl, `Cut ${d.items.length} item(s) — marked with [clip-cut]`);
  });

  cutList?.addEventListener('native:clip-paste', (e) => {
    appendLog(cutLogEl, `Paste received: "${/** @type {CustomEvent} */ (e).detail.data}"`);
  });
});
