import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const eventSc = document.getElementById('event-sc');
  if (!eventSc) return;
  const eventLog = document.getElementById('event-log');
  let count = 0;

  eventSc.addEventListener('native:change', (e) => {
    count++;
    logPrepend(eventLog, `#${count} native:change — value: "${/** @type {CustomEvent} */ (e).detail.value}", label: "${/** @type {CustomEvent} */ (e).detail.label}"`);
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
