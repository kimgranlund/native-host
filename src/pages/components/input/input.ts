import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const eventInput = document.getElementById('event-input');
  if (!eventInput) return;

  const eventLog = document.getElementById('event-log');
  let count = 0;

  eventInput.addEventListener('native:input', (e) => {
    count++;
    logPrepend(eventLog, `#${count} native:input — value: "${/** @type {CustomEvent} */ (e).detail.value}"`);
  });

  eventInput.addEventListener('native:change', (e) => {
    count++;
    logPrepend(eventLog, `#${count} native:change — value: "${/** @type {CustomEvent} */ (e).detail.value}"`);
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

  // Formatting event logging
  const formatInput = document.getElementById('format-input');
  const formatLog = document.getElementById('format-log');

  formatInput?.addEventListener('native:format', (e) => {
    count++;
    logPrepend(formatLog, `#${count} native:format — type: "${/** @type {CustomEvent} */ (e).detail.type}", value: "${/** @type {CustomEvent} */ (e).detail.value}"`);
  });

  // Validation form logging
  const validationForm = document.getElementById('validation-form');
  const validationLog = document.getElementById('validation-log');

  validationForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(/** @type {HTMLFormElement} */ (validationForm));
    logPrepend(validationLog, `submit — ${[...data.entries()].map(([k, v]) => `${k}: "${v}"`).join(', ')}`);
  });

  validationForm?.addEventListener('reset', () => {
    logPrepend(validationLog, 'reset');
  });
});
