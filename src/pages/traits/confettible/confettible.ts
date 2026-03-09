import { ConfettiController } from '@nonoun/native-ui';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('confetti-form-card')) return;

  // ── Global Event Log ──

  const globalLogEl = document.getElementById('confetti-global-log');
  let globalCount = 0;
  document.addEventListener('native:confetti', (e) => {
    globalCount++;
    const { count, origin } = /** @type {CustomEvent} */ (e).detail;
    appendLog(globalLogEl, `#${globalCount} native:confetti  count=${count}  x=${Math.round(origin.x)} y=${Math.round(origin.y)}`);
  });

  // ── Form Success ──

  const submitBtn = document.getElementById('confetti-form-submit');
  if (submitBtn) {
    const formCtrl = new ConfettiController(submitBtn, { trigger: 'manual' });
    submitBtn.addEventListener('native:press', () => {
      submitBtn.setAttribute('disabled', '');
      submitBtn.textContent = 'Submitting...';
      setTimeout(() => {
        submitBtn.textContent = 'Success!';
        formCtrl.fire();
        setTimeout(() => {
          submitBtn.removeAttribute('disabled');
          submitBtn.textContent = 'Submit';
        }, 1500);
      }, 800);
    });
  }

  // ── Programmatic Presets ──

  const subtleBtn = document.getElementById('preset-subtle');
  const partyBtn = document.getElementById('preset-party');
  const explosionBtn = document.getElementById('preset-explosion');

  if (subtleBtn) {
    const ctrl = new ConfettiController(subtleBtn, {
      trigger: 'manual', count: 10, velocity: 6, spread: 45, duration: 1200,
    });
    subtleBtn.addEventListener('native:press', () => ctrl.fire());
  }
  if (partyBtn) {
    const ctrl = new ConfettiController(partyBtn, {
      trigger: 'manual', count: 60, velocity: 15, spread: 120, duration: 2500,
    });
    partyBtn.addEventListener('native:press', () => ctrl.fire());
  }
  if (explosionBtn) {
    const ctrl = new ConfettiController(explosionBtn, {
      trigger: 'manual', count: 100, velocity: 25, spread: 180, gravity: 0.3, duration: 3000,
    });
    explosionBtn.addEventListener('native:press', () => ctrl.fire());
  }

  // ── Options Playground ──

  const optCount = document.getElementById('opt-count');
  const optSpread = document.getElementById('opt-spread');
  const optVelocity = document.getElementById('opt-velocity');
  const optGravity = document.getElementById('opt-gravity');
  const optDuration = document.getElementById('opt-duration');
  const optFireBtn = document.getElementById('opt-fire');
  const optTargetBtn = document.getElementById('opt-target');

  function getPlaygroundOptions() {
    return {
      trigger: /** @type {'manual'} */ ('manual'),
      count: Number(optCount?.getAttribute('value') ?? 30),
      spread: Number(optSpread?.getAttribute('value') ?? 90),
      velocity: Number(optVelocity?.getAttribute('value') ?? 12),
      gravity: Number(optGravity?.getAttribute('value') ?? 0.5),
      duration: Number(optDuration?.getAttribute('value') ?? 2000),
    };
  }

  optFireBtn?.addEventListener('native:press', () => {
    const ctrl = new ConfettiController(optFireBtn, getPlaygroundOptions());
    ctrl.fire();
    setTimeout(() => ctrl.destroy(), getPlaygroundOptions().duration + 500);
  });

  optTargetBtn?.addEventListener('native:press', () => {
    const ctrl = new ConfettiController(optTargetBtn, getPlaygroundOptions());
    ctrl.fire();
    setTimeout(() => ctrl.destroy(), getPlaygroundOptions().duration + 500);
  });
});
