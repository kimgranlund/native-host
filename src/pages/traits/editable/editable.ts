import { EditController } from '@nonoun/native-ui';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('dbl-list')) return;

  // ── Double-Click to Edit (provider) ──
  // n-controller with for=".edit-item" applies EditController to each item.
  // Events bubble up from each item to the list container.

  const dblLogEl = document.getElementById('dbl-log');
  const dblList = document.getElementById('dbl-list');

  dblList?.addEventListener('native:edit-start', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(dblLogEl, `Editing: "${ce.detail.value}"`);
  });
  dblList?.addEventListener('native:edit-commit', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(dblLogEl, `Committed: "${ce.detail.value}" (was "${ce.detail.previousValue}")`);
  });
  dblList?.addEventListener('native:edit-cancel', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(dblLogEl, `Cancelled: "${ce.detail.value}"`);
  });

  // ── Click to Edit (provider) ──

  const clickLogEl = document.getElementById('click-log');
  const clickList = document.getElementById('click-list');

  clickList?.addEventListener('native:edit-start', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(clickLogEl, `Editing: "${ce.detail.value}"`);
  });
  clickList?.addEventListener('native:edit-commit', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(clickLogEl, `Committed: "${ce.detail.value}" (was "${ce.detail.previousValue}")`);
  });
  clickList?.addEventListener('native:edit-cancel', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(clickLogEl, `Cancelled: "${ce.detail.value}"`);
  });

  // ── EditController — attach to plain element ──

  const ctrlItem = document.getElementById('controller-item');
  if (ctrlItem) {
    const ctrlEditor = new EditController(ctrlItem, { trigger: 'dblclick' });

    const ctrlLogEl = document.getElementById('ctrl-log');

    ctrlItem.addEventListener('native:edit-start', (e) => {
      /** @type {CustomEvent} */ const ce = e;
      appendLog(ctrlLogEl, `Editing: "${ce.detail.value}"`);
    });
    ctrlItem.addEventListener('native:edit-commit', (e) => {
      /** @type {CustomEvent} */ const ce = e;
      appendLog(ctrlLogEl, `Committed: "${ce.detail.value}" (was "${ce.detail.previousValue}")`);
    });
    ctrlItem.addEventListener('native:edit-cancel', (e) => {
      /** @type {CustomEvent} */ const ce = e;
      appendLog(ctrlLogEl, `Cancelled: "${ce.detail.value}"`);
    });
  }
});
