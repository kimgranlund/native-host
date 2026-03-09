import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('slash-commandable-page')) return;

  const basicTextarea = document.getElementById('basic-textarea');
  const basicLog = document.getElementById('basic-log');
  const tabLog = document.getElementById('tab-log');
  const inputLog = document.getElementById('input-log');

  // ── Basic demo ──
  // Events fire on the n-controller host, not the textarea — use .closest()

  const basicCtrl = basicTextarea?.closest('n-controller');
  basicCtrl?.addEventListener('native:slash-query', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(basicLog, `query: "${ce.detail.query}" — ${ce.detail.commands.length} match(es)`);
  });

  basicCtrl?.addEventListener('native:slash-select', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(basicLog, `selected: "${ce.detail.command.label}" (${ce.detail.command.value})`);
  });

  // ── Tab-to-select demo ──

  const tabTextarea = document.getElementById('tab-textarea');
  const tabCtrl = tabTextarea?.closest('n-controller');
  tabCtrl?.addEventListener('native:slash-select', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(tabLog, `Tab-selected: "${ce.detail.command.label}"`);
  });

  tabCtrl?.addEventListener('native:slash-query', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(tabLog, `query: "${ce.detail.query}" — ${ce.detail.commands.length} match(es)`);
  });

  // ── n-input demo ──

  const inputDemo = document.getElementById('input-demo');
  const inputCtrl = inputDemo?.closest('n-controller');
  inputCtrl?.addEventListener('native:slash-select', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(inputLog, `selected: "${ce.detail.command.label}"`);
  });
});
