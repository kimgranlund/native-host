import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('type-box')) return;

  // ── Basic Press log ──

  let count = 0;
  const logEl = document.getElementById('log');
  for (const box of document.querySelectorAll('.press-box')) {
    box.addEventListener('native:press', (e) => {
      /** @type {CustomEvent} */ const ce = e;
      count++;
      appendLog(logEl, `#${count} native:press — pointerType: "${ce.detail.pointerType}"`);
    });
  }

  // ── Button Press log ──

  let btnCount = 0;
  const btnLogEl = document.getElementById('btn-log');
  for (const btn of [document.getElementById('btn-1'), document.getElementById('btn-2'), document.getElementById('btn-3')]) {
    btn?.addEventListener('native:press', (e) => {
      /** @type {CustomEvent} */ const ce = e;
      btnCount++;
      appendLog(btnLogEl, `#${btnCount} native:press — pointerType: "${ce.detail.pointerType}"`);
    });
  }

  // ── Pointer Type log ──

  const typeBox = document.getElementById('type-box');
  const typeLogEl = document.getElementById('type-log');
  typeBox?.addEventListener('native:press', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(typeLogEl, `pointerType: "${ce.detail.pointerType}"`);
  });
});
