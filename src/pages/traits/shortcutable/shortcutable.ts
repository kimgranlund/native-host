import { ShortcutController } from '@nonoun/native-ui';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('declarative-ctrl')) return;

  // ── Global Shortcuts ──

  const globalLogEl = document.getElementById('log-global');
  const globalHost = document.createElement('div');
  document.body.appendChild(globalHost);

  const globalCtrl = new ShortcutController(globalHost, {
    shortcuts: [
      { id: 'search',  combo: 'mod+k',   handler: () => appendLog(globalLogEl, `search — mod+k`) },
      { id: 'help',    combo: 'shift+?', handler: () => appendLog(globalLogEl, `help — shift+?`) },
      { id: 'dismiss', combo: 'escape',  handler: () => appendLog(globalLogEl, `dismiss — escape`) },
    ],
    global: true,
  });

  // ── Scoped Shortcuts ──

  const scopedZone = document.getElementById('scoped-zone');
  if (!scopedZone) return;
  const scopedLogEl = document.getElementById('log-scoped');

  const scopedCtrl = new ShortcutController(scopedZone, {
    shortcuts: [
      { id: 'save', combo: 'mod+s', handler: () => appendLog(scopedLogEl, `save — mod+s`) },
      { id: 'undo', combo: 'mod+z', handler: () => appendLog(scopedLogEl, `undo — mod+z`) },
    ],
  });

  // ── Allow Editable ──

  const editableZone = document.getElementById('editable-zone');
  if (!editableZone) return;
  const editableLogEl = document.getElementById('log-editable');

  const editCtrl = new ShortcutController(editableZone, {
    shortcuts: [
      {
        id: 'submit',
        combo: 'mod+enter',
        allowEditable: true,
        handler: () => appendLog(editableLogEl, `submit — mod+enter`),
      },
    ],
    global: true,
  });

  // ── Conditional Guard ──

  const guardLogEl = document.getElementById('log-guard');
  const guardToggle = document.getElementById('guard-toggle');
  const guardStatus = document.getElementById('guard-status');
  if (!guardToggle || !guardStatus) return;
  let guardEnabled = false;

  const guardHost = document.createElement('div');
  document.body.appendChild(guardHost);

  const guardCtrl = new ShortcutController(guardHost, {
    shortcuts: [
      {
        id: 'guarded',
        combo: 'mod+g',
        when: () => guardEnabled,
        handler: () => appendLog(guardLogEl, `guarded — mod+g (enabled: ${guardEnabled})`),
      },
    ],
    global: true,
  });

  guardToggle.addEventListener('native:press', () => {
    guardEnabled = !guardEnabled;
    guardToggle.textContent = guardEnabled ? 'Disable shortcut' : 'Enable shortcut';
    guardToggle.setAttribute('intent', guardEnabled ? 'accent' : 'neutral');
    guardStatus.textContent = guardEnabled ? 'on' : 'off';
    guardStatus.className = guardEnabled ? 'guard-badge guard-badge--on' : 'guard-badge guard-badge--off';
  });

  // ── Declarative ──

  const declarativeCtrl = document.getElementById('declarative-ctrl');
  const declarativeLogEl = document.getElementById('log-declarative');
  declarativeCtrl?.addEventListener('native:shortcut', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(declarativeLogEl, `${ce.detail.id} — ${ce.detail.combo}`);
  });
});
