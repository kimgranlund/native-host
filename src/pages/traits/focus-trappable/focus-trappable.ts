import { FocusTrapController } from '@nonoun/native-ui';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('open-trap')) return;

  const trapEl = document.getElementById('trap');
  if (!trapEl) return;

  // ── Focus Trap Demo ──

  const trap = new FocusTrapController(trapEl);

  function showTrap() {
    trapEl.removeAttribute('hidden');
    trap.enable();
  }

  function hideTrap() {
    trap.disable();
    trapEl.setAttribute('hidden', '');
  }

  document.getElementById('open-trap')?.addEventListener('native:press', () => showTrap());
  document.getElementById('close-btn')?.addEventListener('native:press', () => hideTrap());
  document.getElementById('save-btn')?.addEventListener('native:press', () => hideTrap());

  // ── No Autofocus Demo ──

  const trap2El = document.getElementById('trap2');
  if (trap2El) {
    const trap2 = new FocusTrapController(trap2El);

    document.getElementById('open-trap2')?.addEventListener('native:press', () => {
      trap2El.removeAttribute('hidden');
      trap2.enable();
    });
    document.getElementById('close-btn2')?.addEventListener('native:press', () => {
      trap2.disable();
      trap2El.setAttribute('hidden', '');
    });
  }

  // ── Dialog Demo ──

  /** @type {HTMLElement & { showModal(): void; close(): void } | null} */
  const dialog = document.getElementById('demo-dialog');
  document.getElementById('open-dialog')?.addEventListener('native:press', () => dialog?.showModal());
  document.getElementById('close-dialog')?.addEventListener('native:press', () => dialog?.close());
});
