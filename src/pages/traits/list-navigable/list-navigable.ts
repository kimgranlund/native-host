import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const basicList = document.getElementById('basic-list');
  if (!basicList) return;

  // ── Basic (Vertical) ──

  const basicValueEl = document.querySelector('#basic-value span');
  basicList.addEventListener('native:change', (e) => {
    const { value } = /** @type {CustomEvent} */ (e).detail;
    if (basicValueEl) basicValueEl.textContent = value;
  });

  // ── Horizontal ──

  const horizontalList = document.getElementById('horizontal-list');
  const horizontalValueEl = document.querySelector('#horizontal-value span');
  horizontalList?.addEventListener('native:change', (e) => {
    const { value } = /** @type {CustomEvent} */ (e).detail;
    if (horizontalValueEl) horizontalValueEl.textContent = value;
  });

  // ── Events ──

  const eventList = document.getElementById('event-list');
  const eventLogEl = document.getElementById('event-log');

  eventList?.addEventListener('native:select', (e) => {
    const { value, label } = /** @type {CustomEvent} */ (e).detail;
    appendLog(eventLogEl, `native:select — value: ${value}, label: ${label}`);
  });

  eventList?.addEventListener('native:change', (e) => {
    const { value, label } = /** @type {CustomEvent} */ (e).detail;
    appendLog(eventLogEl, `native:change — value: ${value}, label: ${label}`);
  });
});
