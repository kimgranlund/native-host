document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('footer-dialog-demo')) return;

  const dialog = /** @type {HTMLDialogElement} */ (document.getElementById('footer-dialog-demo'));
  document.getElementById('open-footer-dialog')?.addEventListener('native:press', () => dialog?.showModal());
  document.getElementById('close-footer-dialog')?.addEventListener('native:press', () => dialog?.close());
  document.getElementById('cancel-footer-dialog')?.addEventListener('native:press', () => dialog?.close());
});
