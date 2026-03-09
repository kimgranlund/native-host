import { TossController } from '@nonoun/native-ui';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const arena = document.getElementById('provider-arena');
  if (!arena) return;

  // ── Provider event log ──

  const providerLog = document.getElementById('provider-log');

  arena.addEventListener('native:toss', (e) => {
    const d = /** @type {CustomEvent} */ (e).detail;
    appendLog(providerLog, `native:toss — x:${d.x.toFixed(0)} y:${d.y.toFixed(0)} v:(${d.velocityX.toFixed(2)}, ${d.velocityY.toFixed(2)}) bounces:${d.bounces} rot:${d.rotation.toFixed(0)}\u00B0`);
  });

  arena.addEventListener('native:bounce', (e) => {
    const d = /** @type {CustomEvent} */ (e).detail;
    appendLog(providerLog, `native:bounce — edge:"${d.edge}" x:${d.x.toFixed(0)} y:${d.y.toFixed(0)}`);
  });

  // ── Controller demo ──

  const controllerCard = document.getElementById('controller-card');
  const controllerLog = document.getElementById('controller-log');
  if (!controllerCard) return;

  let toss = new TossController(controllerCard, {
    friction: 0.95,
    bounce: true,
    bounceDamping: 0.6,
    returnOnEnd: false,
  });

  controllerCard.addEventListener('native:toss', (e) => {
    const d = /** @type {CustomEvent} */ (e).detail;
    appendLog(controllerLog, `native:toss — x:${d.x.toFixed(0)} y:${d.y.toFixed(0)} v:(${d.velocityX.toFixed(2)}, ${d.velocityY.toFixed(2)}) bounces:${d.bounces} rot:${d.rotation.toFixed(0)}\u00B0`);
  });

  controllerCard.addEventListener('native:bounce', (e) => {
    const d = /** @type {CustomEvent} */ (e).detail;
    appendLog(controllerLog, `native:bounce — edge:"${d.edge}" x:${d.x.toFixed(0)} y:${d.y.toFixed(0)}`);
  });

  // ── Option controls ──

  const frictionRange = document.getElementById('opt-friction');
  const frictionVal = document.getElementById('friction-val');
  frictionRange?.addEventListener('native:change', (e) => {
    const v = Number(/** @type {CustomEvent} */ (e).detail.value);
    toss.friction = v;
    if (frictionVal) frictionVal.textContent = v.toFixed(2);
  });

  const dampingRange = document.getElementById('opt-damping');
  const dampingVal = document.getElementById('damping-val');
  dampingRange?.addEventListener('native:change', (e) => {
    const v = Number(/** @type {CustomEvent} */ (e).detail.value);
    toss.bounceDamping = v;
    if (dampingVal) dampingVal.textContent = v.toFixed(2);
  });

  const gravityRange = document.getElementById('opt-gravity');
  const gravityVal = document.getElementById('gravity-val');
  gravityRange?.addEventListener('native:change', (e) => {
    const v = Number(/** @type {CustomEvent} */ (e).detail.value);
    toss.gravity = v;
    if (gravityVal) gravityVal.textContent = v.toFixed(2);
  });

  const spinSwitch = document.getElementById('opt-spin');
  spinSwitch?.addEventListener('native:change', (e) => {
    toss.spin = /** @type {CustomEvent} */ (e).detail.value;
  });

  const bounceSwitch = document.getElementById('opt-bounce');
  bounceSwitch?.addEventListener('native:change', (e) => {
    toss.bounce = /** @type {CustomEvent} */ (e).detail.value;
  });

  const returnSwitch = document.getElementById('opt-return');
  returnSwitch?.addEventListener('native:change', (e) => {
    toss.returnOnEnd = /** @type {CustomEvent} */ (e).detail.value;
  });

  // ── Reset button ──

  const resetBtn = document.getElementById('btn-reset');
  resetBtn?.addEventListener('native:press', () => {
    controllerCard.style.translate = '';
    controllerCard.style.rotate = '';
    toss.destroy();
    toss = new TossController(controllerCard, {
      friction: toss.friction,
      bounce: toss.bounce,
      bounceDamping: toss.bounceDamping,
      gravity: toss.gravity,
      spin: toss.spin,
      returnOnEnd: toss.returnOnEnd,
    });
  });
});
