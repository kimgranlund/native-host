import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const eventCb = document.getElementById('event-cb');
  if (!eventCb) return;
  const eventLog = document.getElementById('event-log');
  let count = 0;

  eventCb.addEventListener('native:change', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    count++;
    logPrepend(eventLog, `#${count} native:change — checked: ${ce.detail.checked}, value: "${ce.detail.value}"`);
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
});
