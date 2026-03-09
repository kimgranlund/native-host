import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const eventSw = document.getElementById('event-sw');
  if (!eventSw) return;
  const eventLog = document.getElementById('event-log');
  let count = 0;

  eventSw.addEventListener('native:change', (e) => {
    count++;
    logPrepend(eventLog, `#${count} native:change — checked: ${/** @type {CustomEvent} */ (e).detail.checked}, value: "${/** @type {CustomEvent} */ (e).detail.value}"`);
  });

  // Form logging
  const form = document.getElementById('demo-form');
  const formLog = document.getElementById('form-log');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(/** @type {HTMLFormElement} */ (form));
    const entries = [...data.entries()].map(([k, v]) => `${k}=${v}`).join(', ');
    logPrepend(formLog, `submit — ${entries || '(empty)'}`);
  });

  form?.addEventListener('reset', () => {
    logPrepend(formLog, 'reset');
  });

  // Terms form logging
  const termsForm = document.getElementById('terms-form');
  const termsLog = document.getElementById('terms-log');

  termsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(/** @type {HTMLFormElement} */ (termsForm));
    const entries = [...data.entries()].map(([k, v]) => `${k}=${v}`).join(', ');
    logPrepend(termsLog, `submit — ${entries || '(empty)'}`);
  });

  termsForm?.addEventListener('reset', () => {
    logPrepend(termsLog, 'reset');
  });
});
