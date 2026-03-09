import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const basicListbox = document.getElementById('basic-listbox');
  if (!basicListbox) return;

  // Basic listbox value tracking
  const basicValue = document.getElementById('basic-value');

  basicListbox.addEventListener('native:change', (e) => {
    if (basicValue) basicValue.textContent = /** @type {CustomEvent} */ (e).detail.value;
  });

  // Pre-select "medium"
  const preListbox = document.getElementById('preselected-listbox');
  preListbox?.addEventListener('native:change', () => {});
  // Programmatic select after element setup
  preListbox?.ready.then(() => {
    preListbox.controller.select('medium');
  });

  // Event logging
  const eventListbox = document.getElementById('event-listbox');
  const eventLog = document.getElementById('event-log');
  let eventCount = 0;

  eventListbox?.addEventListener('native:select', (e) => {
    eventCount++;
    logPrepend(eventLog, `#${eventCount} native:select — value: "${/** @type {CustomEvent} */ (e).detail.value}", label: "${/** @type {CustomEvent} */ (e).detail.label}"`);
  });

  eventListbox?.addEventListener('native:change', (e) => {
    eventCount++;
    logPrepend(eventLog, `#${eventCount} native:change — value: "${/** @type {CustomEvent} */ (e).detail.value}", label: "${/** @type {CustomEvent} */ (e).detail.label}"`);
  });
});
