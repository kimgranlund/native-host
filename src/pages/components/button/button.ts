import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const pressBtn = document.getElementById('press-btn');
  if (!pressBtn) return;

  const pressLog = document.getElementById('press-log');
  let pressCount = 0;

  pressBtn.addEventListener('native:press', (e) => {
    pressCount++;
    logPrepend(pressLog, `#${pressCount} native:press — pointerType: ${/** @type {CustomEvent} */ (e).detail.pointerType}`);
  });

  // Form logging
  const form = document.getElementById('demo-form');
  const formLog = document.getElementById('form-log');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    logPrepend(formLog, `submit — value: "${new FormData(/** @type {HTMLFormElement} */ (form)).get('demo')}"`);
  });

  form?.addEventListener('reset', () => {
    logPrepend(formLog, 'reset');
  });
});
