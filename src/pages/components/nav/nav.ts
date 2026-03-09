import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const basicNav = document.getElementById('basic-nav');
  if (!basicNav) return;

  // Basic nav value tracking
  const basicValue = document.getElementById('basic-value');
  basicNav.addEventListener('native:change', (e) => {
    if (basicValue) basicValue.textContent = /** @type {CustomEvent} */ (e).detail.value;
  });

  // Grouped nav value tracking
  const groupedNav = document.getElementById('grouped-nav');
  const groupedValue = document.getElementById('grouped-value');
  groupedNav?.addEventListener('native:change', (e) => {
    if (groupedValue) groupedValue.textContent = /** @type {CustomEvent} */ (e).detail.value;
  });

  // Event logging
  const eventNav = document.getElementById('event-nav');
  const eventLog = document.getElementById('event-log');
  let eventCount = 0;

  eventNav?.addEventListener('native:change', (e) => {
    eventCount++;
    logPrepend(eventLog, `#${eventCount} native:change — value: "${/** @type {CustomEvent} */ (e).detail.value}"`);
  });
});
