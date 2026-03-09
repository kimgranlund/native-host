import { FlipController } from '@nonoun/native-ui';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('flippable-page')) return;

  // ── Basic Flip + Hover log ──

  let basicCount = 0;
  const basicLogEl = document.getElementById('basic-log');
  for (const id of ['flip-click', 'flip-hover']) {
    const card = document.getElementById(id);
    card?.addEventListener('native:flip', (e) => {
      const { flipped, axis } = /** @type {CustomEvent} */ (e).detail;
      basicCount++;
      appendLog(basicLogEl, `#${basicCount} ${id} — ${flipped ? 'back' : 'front'} (${axis}-axis)`);
    });
  }

  // ── Axis Options log ──

  let axisCount = 0;
  const axisLogEl = document.getElementById('axis-log');
  for (const id of ['flip-y', 'flip-x']) {
    const card = document.getElementById(id);
    card?.addEventListener('native:flip', (e) => {
      const { flipped, axis } = /** @type {CustomEvent} */ (e).detail;
      axisCount++;
      appendLog(axisLogEl, `#${axisCount} ${id} — ${flipped ? 'back' : 'front'} (${axis}-axis)`);
    });
  }

  // ── Programmatic Demo ──

  const manualEl = document.getElementById('flip-manual');
  const manualLogEl = document.getElementById('manual-log');
  let manualCount = 0;

  if (manualEl) {
    const manualCtrl = new FlipController(manualEl, { trigger: 'manual' });

    manualEl.addEventListener('native:flip', (e) => {
      const { flipped, axis } = /** @type {CustomEvent} */ (e).detail;
      manualCount++;
      appendLog(manualLogEl, `#${manualCount} — ${flipped ? 'back' : 'front'} (${axis}-axis)`);
    });

    document.getElementById('btn-flip')?.addEventListener('native:press', () => manualCtrl.flip());
    document.getElementById('btn-unflip')?.addEventListener('native:press', () => manualCtrl.unflip());
    document.getElementById('btn-toggle')?.addEventListener('native:press', () => manualCtrl.toggle());
  }

  // ── Options Playground ──

  const pgEl = document.getElementById('flip-playground');
  const pgLogEl = document.getElementById('playground-log');
  let pgCount = 0;

  if (pgEl) {
    let currentAxis = 'y';
    let currentDuration = 600;
    let currentPerspective = 1000;
    let currentTrigger = 'click';
    let currentDisabled = false;

    let pgCtrl = new FlipController(pgEl, {
      axis: currentAxis,
      duration: currentDuration,
      perspective: currentPerspective,
      trigger: currentTrigger,
      disabled: currentDisabled,
    });

    pgEl.addEventListener('native:flip', (e) => {
      const { flipped, axis } = /** @type {CustomEvent} */ (e).detail;
      pgCount++;
      appendLog(pgLogEl, `#${pgCount} — ${flipped ? 'back' : 'front'} (${axis}-axis)`);
    });

    function recreateController() {
      pgCtrl.destroy();
      // Reset back face transform for axis changes
      const backFace = pgEl.querySelector('[data-flip-back]');
      if (backFace) {
        backFace.classList.toggle('x-axis', currentAxis === 'x');
      }
      pgCtrl = new FlipController(pgEl, {
        axis: currentAxis,
        duration: currentDuration,
        perspective: currentPerspective,
        trigger: currentTrigger,
        disabled: currentDisabled,
      });
    }

    // Axis select
    const axisSelect = document.getElementById('opt-axis');
    axisSelect?.addEventListener('native:change', (e) => {
      currentAxis = /** @type {CustomEvent} */ (e).detail.value;
      recreateController();
    });

    // Duration range
    const durationRange = document.getElementById('opt-duration');
    const durationLabel = document.getElementById('opt-duration-value');
    durationRange?.addEventListener('native:change', (e) => {
      currentDuration = Number(/** @type {CustomEvent} */ (e).detail.value);
      if (durationLabel) durationLabel.textContent = String(currentDuration);
      recreateController();
    });

    // Perspective range
    const perspectiveRange = document.getElementById('opt-perspective');
    const perspectiveLabel = document.getElementById('opt-perspective-value');
    perspectiveRange?.addEventListener('native:change', (e) => {
      currentPerspective = Number(/** @type {CustomEvent} */ (e).detail.value);
      if (perspectiveLabel) perspectiveLabel.textContent = String(currentPerspective);
      recreateController();
    });

    // Trigger select
    const triggerSelect = document.getElementById('opt-trigger');
    triggerSelect?.addEventListener('native:change', (e) => {
      currentTrigger = /** @type {CustomEvent} */ (e).detail.value;
      recreateController();
    });

    // Disabled switch
    const disabledSwitch = document.getElementById('opt-disabled');
    disabledSwitch?.addEventListener('native:change', (e) => {
      currentDisabled = /** @type {CustomEvent} */ (e).detail.checked;
      pgCtrl.disabled = currentDisabled;
    });
  }
});
