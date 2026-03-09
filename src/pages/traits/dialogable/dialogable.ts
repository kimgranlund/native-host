import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const basicDialog = document.getElementById('basic-dialog');
  if (!basicDialog) return;

  const basicLog = document.getElementById('basic-log');
  const formLog = document.getElementById('form-log');
  const persistentLog = document.getElementById('persistent-log');
  const eventsLog = document.getElementById('events-log');

  // ── Basic demo ──

  const basicCtrl = /** @type {any} */ (basicDialog)?.getTraitController('dialogable');

  document.getElementById('basic-open-btn')?.addEventListener('native:press', () => {
    basicCtrl?.showModal();
    appendLog(basicLog, 'showModal()');
  });

  document.getElementById('basic-close-btn')?.addEventListener('native:press', () => {
    basicCtrl?.close();
  });

  basicDialog.addEventListener('close', () => {
    appendLog(basicLog, 'close event');
  });

  // ── Form demo ──

  const formDialog = document.getElementById('form-dialog');
  const formCtrl = /** @type {any} */ (formDialog)?.getTraitController('dialogable');

  document.getElementById('form-open-btn')?.addEventListener('native:press', () => {
    formCtrl?.showModal();
    appendLog(formLog, 'showModal()');
  });

  document.getElementById('form-cancel-btn')?.addEventListener('native:press', () => {
    formCtrl?.close();
  });

  document.getElementById('form-submit-btn')?.addEventListener('native:press', () => {
    const textarea = /** @type {HTMLTextAreaElement | null} */ (document.getElementById('form-textarea'));
    const value = textarea?.value ?? '';
    appendLog(formLog, `submitted: "${value}"`);
    formCtrl?.close();
  });

  formDialog?.addEventListener('close', () => {
    appendLog(formLog, 'close event');
  });

  // ── Persistent demo ──

  const persistentDialog = document.getElementById('persistent-dialog');
  const persistentCtrl = /** @type {any} */ (persistentDialog)?.getTraitController('dialogable');

  document.getElementById('persistent-open-btn')?.addEventListener('native:press', () => {
    persistentCtrl?.showModal();
    appendLog(persistentLog, 'showModal()');
  });

  document.getElementById('persistent-close-btn')?.addEventListener('native:press', () => {
    persistentCtrl?.close();
  });

  persistentDialog?.addEventListener('close', () => {
    appendLog(persistentLog, 'close event (only via button)');
  });

  // ── Events demo ──

  const eventsDialog = document.getElementById('events-dialog');
  const eventsCtrl = /** @type {any} */ (eventsDialog)?.getTraitController('dialogable');

  document.getElementById('events-open-btn')?.addEventListener('native:press', () => {
    eventsCtrl?.showModal();
    appendLog(eventsLog, `showModal() — open: ${eventsCtrl?.open}`);
  });

  document.getElementById('events-close-btn')?.addEventListener('native:press', () => {
    eventsCtrl?.close();
  });

  eventsDialog?.addEventListener('close', () => {
    appendLog(eventsLog, `close — open: ${eventsCtrl?.open}`);
  });
});
