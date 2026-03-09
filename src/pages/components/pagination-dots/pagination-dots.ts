import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const eventDemo = document.getElementById('event-demo');
  if (!eventDemo) return;
  const eventLog = document.getElementById('event-log');

  eventDemo.addEventListener('native:change', (e) => {
    logPrepend(eventLog, `native:change — index: ${/** @type {CustomEvent} */ (e).detail.index}`);
  });

  // Programmatic control
  const prog = document.getElementById('prog-demo');
  document.getElementById('prog-prev')?.addEventListener('native:press', () => prog?.prev());
  document.getElementById('prog-next')?.addEventListener('native:press', () => prog?.next());
  document.getElementById('prog-reset')?.addEventListener('native:press', () => { if (prog) prog.active = 0; });
});
