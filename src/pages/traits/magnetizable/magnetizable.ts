import { MagnetController } from '@nonoun/native-ui';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('magnetizable-page')) return;

  // ── Options Playground (programmatic MagnetController) ──

  const playgroundArena = /** @type {HTMLElement} */ (document.getElementById('playground-arena'));
  if (playgroundArena) {
    const ctrl = new MagnetController(playgroundArena, {
      threshold: 20,
      gridSize: 0,
      strength: 1,
      guides: true,
      snapToEdges: true,
      snapToSiblings: true,
    });

    const thresholdRange = /** @type {HTMLInputElement} */ (document.getElementById('opt-threshold'));
    const gridSizeRange = /** @type {HTMLInputElement} */ (document.getElementById('opt-grid-size'));
    const strengthRange = /** @type {HTMLInputElement} */ (document.getElementById('opt-strength'));
    const guidesSwitch = /** @type {HTMLInputElement} */ (document.getElementById('opt-guides'));
    const edgesSwitch = /** @type {HTMLInputElement} */ (document.getElementById('opt-snap-edges'));
    const siblingsSwitch = /** @type {HTMLInputElement} */ (document.getElementById('opt-snap-siblings'));
    const resetBtn = document.getElementById('opt-reset');

    const thresholdVal = document.getElementById('opt-threshold-val');
    const gridSizeVal = document.getElementById('opt-grid-size-val');
    const strengthVal = document.getElementById('opt-strength-val');

    thresholdRange?.addEventListener('input', () => {
      ctrl.threshold = Number(thresholdRange.value);
      if (thresholdVal) thresholdVal.textContent = thresholdRange.value;
    });
    gridSizeRange?.addEventListener('input', () => {
      ctrl.gridSize = Number(gridSizeRange.value);
      if (gridSizeVal) gridSizeVal.textContent = gridSizeRange.value;
    });
    strengthRange?.addEventListener('input', () => {
      ctrl.strength = Number(strengthRange.value);
      if (strengthVal) strengthVal.textContent = strengthRange.value;
    });
    guidesSwitch?.addEventListener('change', () => {
      ctrl.guides = guidesSwitch.checked;
    });
    edgesSwitch?.addEventListener('change', () => {
      ctrl.snapToEdges = edgesSwitch.checked;
    });
    siblingsSwitch?.addEventListener('change', () => {
      ctrl.snapToSiblings = siblingsSwitch.checked;
    });

    resetBtn?.addEventListener('click', () => {
      for (const box of playgroundArena.querySelectorAll('.magnet-box')) {
        /** @type {HTMLElement} */ (box).style.translate = '';
      }
    });
  }

  // ── Global Event Log ──

  const logEl = document.getElementById('magnet-global-log');

  document.addEventListener('native:magnet-snap', (e) => {
    /** @type {CustomEvent} */ const ce = /** @type {any} */ (e);
    const { snappedTo, axis, x, y } = ce.detail;
    appendLog(logEl, `snap: ${snappedTo} on ${axis} at (${Math.round(x)}, ${Math.round(y)})`, 50);
  });

  document.addEventListener('native:magnet-drop', (e) => {
    /** @type {CustomEvent} */ const ce = /** @type {any} */ (e);
    const { x, y } = ce.detail;
    appendLog(logEl, `drop at (${Math.round(x)}, ${Math.round(y)})`, 50);
  });
});
