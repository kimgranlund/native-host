document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('basic-dialog')) return;

  function wire(openId, dialogId, closeIds) {
    const dialog = document.getElementById(dialogId);
    document.getElementById(openId)?.addEventListener('native:press', () => dialog?.showModal());
    for (const id of closeIds) {
      document.getElementById(id)?.addEventListener('native:press', () => dialog?.close());
    }
  }

  wire('open-basic', 'basic-dialog', ['basic-cancel', 'basic-confirm']);
  wire('open-form', 'form-dialog', ['form-cancel', 'form-save']);
  wire('open-persistent', 'persistent-dialog', ['persistent-close']);
  wire('open-no-esc', 'no-esc-dialog', ['no-esc-close']);
  wire('open-danger', 'danger-dialog', ['danger-cancel', 'danger-confirm']);
});
