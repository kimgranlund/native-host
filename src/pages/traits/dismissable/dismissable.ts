import { DismissController } from '@nonoun/native-ui';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const panel = document.getElementById('panel');
  if (!document.getElementById('demo-dialog')) return;

  // ── Click Outside Demo ──

  const dismiss = panel ? new DismissController(panel) : null;
  const logEl = document.getElementById('log');
  let count = 0;

  function showPanel() {
    panel?.removeAttribute('hidden');
    dismiss?.enable();
    count++;
    appendLog(logEl, `#${count} Panel opened`);
  }

  function hidePanel() {
    dismiss?.disable();
    panel?.setAttribute('hidden', '');
  }

  document.getElementById('open-btn')?.addEventListener('native:press', () => showPanel());
  panel?.addEventListener('native:dismiss', () => {
    count++;
    appendLog(logEl, `#${count} Panel dismissed`);
    hidePanel();
  });

  // ── Nested Layers Demo ──

  const panelA = document.getElementById('panel-a');
  const panelB = document.getElementById('panel-b');
  const dismissA = panelA ? new DismissController(panelA) : null;
  const dismissB = panelB ? new DismissController(panelB) : null;

  function showPanelEl(el, ctrl) {
    el?.removeAttribute('hidden');
    ctrl?.enable();
  }

  function hidePanelEl(el, ctrl) {
    ctrl?.disable();
    el?.setAttribute('hidden', '');
  }

  document.getElementById('open-a')?.addEventListener('native:press', () => showPanelEl(panelA, dismissA));
  document.getElementById('open-b')?.addEventListener('native:press', () => showPanelEl(panelB, dismissB));
  panelA?.addEventListener('native:dismiss', () => hidePanelEl(panelA, dismissA));
  panelB?.addEventListener('native:dismiss', () => hidePanelEl(panelB, dismissB));

  // ── Dialog Demo ──

  const dialog = document.getElementById('demo-dialog');
  document.getElementById('open-dialog')?.addEventListener('native:press', () => dialog?.showModal());
  document.getElementById('close-dialog')?.addEventListener('native:press', () => dialog?.close());
});
