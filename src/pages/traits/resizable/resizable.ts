import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('both-panel')) return;

  // ── Horizontal ──

  const hOut = document.getElementById('h-output');
  document.getElementById('h-panel')?.addEventListener('native:resize-move', (e) => {
    if (hOut) hOut.textContent = `Width: ${Math.round(/** @type {CustomEvent} */ (e).detail.width)}px`;
  });

  // ── Vertical ──

  const vOut = document.getElementById('v-output');
  document.getElementById('v-panel')?.addEventListener('native:resize-move', (e) => {
    if (vOut) vOut.textContent = `Height: ${Math.round(/** @type {CustomEvent} */ (e).detail.height)}px`;
  });

  // ── Both axes ──

  const bothOut = document.getElementById('both-output');
  document.getElementById('both-panel')?.addEventListener('native:resize-move', (e) => {
    if (bothOut) bothOut.textContent = `${Math.round(/** @type {CustomEvent} */ (e).detail.width)} x ${Math.round(/** @type {CustomEvent} */ (e).detail.height)}`;
  });
});
