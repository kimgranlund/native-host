import { CSSInspectController } from '@nonoun/native-ui';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('provider-card')) return;

  // ── Provider event logs ──

  let providerCount = 0;
  const providerLog = document.getElementById('provider-log');
  for (const el of document.querySelectorAll('.provider-target')) {
    el.addEventListener('native:inspect', (e) => {
      /** @type {CustomEvent} */ const ce = /** @type {any} */ (e);
      providerCount++;
      appendLog(providerLog, `#${providerCount} inspect → ${ce.detail.active ? 'ON' : 'OFF'}, layers: ${ce.detail.layers}`);
    });
  }

  // ── Controller demo ──

  const controllerTarget = document.getElementById('controller-target');
  const controllerLog = document.getElementById('controller-log');

  if (controllerTarget) {
    const inspector = new CSSInspectController(controllerTarget, {
      depth: 16,
      scale: 0.85,
      maxTilt: 60,
      tiltRadius: 384,
      perspective: 1200,
      labels: true,
    });

    let controllerCount = 0;
    controllerTarget.addEventListener('native:inspect', (e) => {
      /** @type {CustomEvent} */ const ce = /** @type {any} */ (e);
      controllerCount++;
      appendLog(controllerLog, `#${controllerCount} inspect → ${ce.detail.active ? 'ON' : 'OFF'}, layers: ${ce.detail.layers}`);
    });

    // ── Option controls ──

    const depthRange = document.getElementById('opt-depth');
    const depthVal = document.getElementById('depth-val');
    depthRange?.addEventListener('native:change', (e) => {
      const v = Number(/** @type {CustomEvent} */ (e).detail.value);
      inspector.depth = v;
      if (depthVal) depthVal.textContent = v.toFixed(0);
    });

    const scaleRange = document.getElementById('opt-scale');
    const scaleVal = document.getElementById('scale-val');
    scaleRange?.addEventListener('native:change', (e) => {
      const v = Number(/** @type {CustomEvent} */ (e).detail.value);
      inspector.scale = v;
      if (scaleVal) scaleVal.textContent = v.toFixed(2);
    });

    const perspRange = document.getElementById('opt-perspective');
    const perspVal = document.getElementById('perspective-val');
    perspRange?.addEventListener('native:change', (e) => {
      const v = Number(/** @type {CustomEvent} */ (e).detail.value);
      inspector.perspective = v;
      if (perspVal) perspVal.textContent = v.toFixed(0);
    });

    const maxTiltRange = document.getElementById('opt-max-tilt');
    const maxTiltVal = document.getElementById('max-tilt-val');
    maxTiltRange?.addEventListener('native:change', (e) => {
      const v = Number(/** @type {CustomEvent} */ (e).detail.value);
      inspector.maxTilt = v;
      if (maxTiltVal) maxTiltVal.textContent = v.toFixed(0);
    });

    const tiltRadiusRange = document.getElementById('opt-tilt-radius');
    const tiltRadiusVal = document.getElementById('tilt-radius-val');
    tiltRadiusRange?.addEventListener('native:change', (e) => {
      const v = Number(/** @type {CustomEvent} */ (e).detail.value);
      inspector.tiltRadius = v;
      if (tiltRadiusVal) tiltRadiusVal.textContent = v.toFixed(0);
    });

    const labelSwitch = document.getElementById('opt-labels');
    labelSwitch?.addEventListener('native:change', (e) => {
      inspector.labels = /** @type {CustomEvent} */ (e).detail.checked;
    });
  }

  // ── Pick mode event log ──

  let pickCount = 0;
  const pickLog = document.getElementById('pick-log');
  const pickTarget = document.getElementById('pick-target');
  pickTarget?.addEventListener('native:inspect', (e) => {
    /** @type {CustomEvent} */ const ce = /** @type {any} */ (e);
    pickCount++;
    appendLog(pickLog, `#${pickCount} inspect → ${ce.detail.active ? 'ON' : 'OFF'}, layers: ${ce.detail.layers}`);
  });
});
