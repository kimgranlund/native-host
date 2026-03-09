import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const eventTextarea = document.getElementById('event-textarea');
  if (!eventTextarea) return;

  const eventLog = document.getElementById('event-log');
  let count = 0;

  eventTextarea.addEventListener('native:input', (e) => {
    count++;
    logPrepend(eventLog, `#${count} native:input — value: "${/** @type {CustomEvent} */ (e).detail.value}"`);
  });

  eventTextarea.addEventListener('native:change', (e) => {
    count++;
    logPrepend(eventLog, `#${count} native:change — value: "${/** @type {CustomEvent} */ (e).detail.value}"`);
  });

  // Formatting event logging
  const formatLog = document.getElementById('format-log');
  const formatCodeTextarea = document.getElementById('format-code-textarea');
  const formatAllTextarea = document.getElementById('format-all-textarea');

  [formatCodeTextarea, formatAllTextarea].forEach(el => {
    el?.addEventListener('native:format', (e) => {
      count++;
      logPrepend(formatLog, `#${count} native:format — type: "${/** @type {CustomEvent} */ (e).detail.type}", value: "${/** @type {CustomEvent} */ (e).detail.value}"`);
    });
  });

  // Form logging
  const form = document.getElementById('demo-form');
  const formLog = document.getElementById('form-log');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(/** @type {HTMLFormElement} */ (form));
    logPrepend(formLog, `submit — ${[...data.entries()].map(([k, v]) => `${k}: "${v}"`).join(', ')}`);
  });

  form?.addEventListener('reset', () => {
    logPrepend(formLog, 'reset');
  });
});
