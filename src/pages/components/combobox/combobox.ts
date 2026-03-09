import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const eventCombobox = document.getElementById('event-combobox');
  if (!eventCombobox) return;

  const eventLog = document.getElementById('event-log');
  let count = 0;

  eventCombobox.addEventListener('native:change', (e) => {
    count++;
    logPrepend(eventLog, `#${count} native:change — value: "${/** @type {CustomEvent} */ (e).detail.value}", label: "${/** @type {CustomEvent} */ (e).detail.label}"`);
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
