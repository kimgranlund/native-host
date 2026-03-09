import { ParallaxController } from '@nonoun/native-ui';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('parallax-basic')) return;

  // ── Provider event log (Basic Tilt section — throttle to 30 entries) ──

  const providerLogEl = document.getElementById('provider-log');
  let providerCount = 0;
  const basicCard = document.getElementById('parallax-basic');
  basicCard?.addEventListener('native:parallax-move', (e) => {
    providerCount++;
    if (providerCount % 4 !== 0) return;
    const { tiltX, tiltY, percentX, percentY } = /** @type {CustomEvent} */ (e).detail;
    appendLog(providerLogEl, `tiltX: ${tiltX.toFixed(1)}, tiltY: ${tiltY.toFixed(1)}, %X: ${percentX.toFixed(2)}, %Y: ${percentY.toFixed(2)}`, 30);
  });

  // ── Controller (Programmatic) ──

  const ctrlCard = document.getElementById('ctrl-card');
  if (!ctrlCard) return;

  const parallax = new ParallaxController(ctrlCard, {
    maxTilt: 15,
    perspective: 1000,
    scale: 1.05,
    speed: 300,
    glare: false,
    glareOpacity: 0.35,
  });

  const ctrlLogEl = document.getElementById('ctrl-log');
  let ctrlCount = 0;
  ctrlCard.addEventListener('native:parallax-move', (e) => {
    ctrlCount++;
    if (ctrlCount % 3 !== 0) return;
    const { tiltX, tiltY, percentX, percentY } = /** @type {CustomEvent} */ (e).detail;
    appendLog(ctrlLogEl, `tiltX: ${tiltX.toFixed(1)}, tiltY: ${tiltY.toFixed(1)}, %X: ${percentX.toFixed(2)}, %Y: ${percentY.toFixed(2)}`, 50);
  });

  // ── Option controls ──

  /** @param {string} id @param {string} prop @param {string} valId @param {(v: string) => any} parse */
  function wireRange(id, prop, valId, parse) {
    const el = document.getElementById(id);
    const valEl = document.getElementById(valId);
    el?.addEventListener('input', (e) => {
      const raw = /** @type {HTMLInputElement} */ (e.target).value;
      if (valEl) valEl.textContent = raw;
      parallax[prop] = parse(raw);
    });
  }

  wireRange('ctrl-tilt', 'maxTilt', 'ctrl-tilt-val', Number);
  wireRange('ctrl-persp', 'perspective', 'ctrl-persp-val', Number);
  wireRange('ctrl-scale', 'scale', 'ctrl-scale-val', Number);
  wireRange('ctrl-speed', 'speed', 'ctrl-speed-val', Number);
  wireRange('ctrl-gopacity', 'glareOpacity', 'ctrl-gopacity-val', Number);

  // ── Glare switch — detach/attach cycle ──

  const glareSwitch = document.getElementById('ctrl-glare');
  glareSwitch?.addEventListener('change', (e) => {
    const on = /** @type {HTMLInputElement} */ (e.target).checked;
    parallax.detach();
    parallax.glare = on;
    parallax.attach();
  });

  // ── Reset button ──

  document.getElementById('ctrl-reset')?.addEventListener('click', () => {
    parallax.reset();
  });

  // ── CSS Custom Property Demo log ──

  const shadowLogEl = document.getElementById('shadow-log');
  let shadowCount = 0;
  for (const id of ['shadow-a', 'shadow-b']) {
    const card = document.getElementById(id);
    card?.addEventListener('native:parallax-move', (e) => {
      shadowCount++;
      if (shadowCount % 4 !== 0) return;
      const { percentX, percentY } = /** @type {CustomEvent} */ (e).detail;
      appendLog(shadowLogEl, `${id} — %X: ${percentX.toFixed(2)}, %Y: ${percentY.toFixed(2)}`, 50);
    });
  }
});
