import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const eventSelect = document.getElementById('event-select');
  if (!eventSelect) return;
  const eventLog = document.getElementById('event-log');
  let count = 0;

  eventSelect.addEventListener('native:change', (e) => {
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

  // Dynamic update demo
  const dynamicSelect = document.getElementById('dynamic-select');
  const dynamicLog = document.getElementById('dynamic-log');

  document.getElementById('load-fruits')?.addEventListener('native:press', () => {
    if (!dynamicSelect) return;
    dynamicSelect.options = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      { value: 'grape', label: 'Grape' },
    ];
    dynamicSelect.placeholder = 'Choose a fruit';
  });

  document.getElementById('load-colors')?.addEventListener('native:press', () => {
    if (!dynamicSelect) return;
    dynamicSelect.options = [
      { value: 'red', label: 'Red' },
      { value: 'green', label: 'Green' },
      { value: 'blue', label: 'Blue' },
    ];
    dynamicSelect.placeholder = 'Choose a color';
  });

  dynamicSelect?.addEventListener('native:change', (e) => {
    logPrepend(dynamicLog, `native:change — value: "${/** @type {CustomEvent} */ (e).detail.value}", label: "${/** @type {CustomEvent} */ (e).detail.label}"`);
  });
});
