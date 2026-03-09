document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('drawer-right')) return;

  function wire(openId, closeId, drawerId) {
    const open = document.getElementById(openId);
    const close = document.getElementById(closeId);
    const drawer = document.getElementById(drawerId);
    open?.addEventListener('native:press', () => drawer?.showModal());
    close?.addEventListener('native:press', () => drawer?.close());
  }

  wire('open-right', 'close-right', 'drawer-right');
  wire('open-left', 'close-left', 'drawer-left');
  wire('open-bottom', 'close-bottom', 'drawer-bottom');
  wire('open-top', 'close-top', 'drawer-top');
  wire('open-footer', 'close-footer', 'drawer-footer');
  document.getElementById('cancel-footer')?.addEventListener('native:press', () => {
    document.getElementById('drawer-footer')?.close();
  });
  wire('open-no-escape', 'close-no-escape', 'drawer-no-escape');
  wire('open-no-backdrop', 'close-no-backdrop', 'drawer-no-backdrop');
  wire('open-persistent', 'close-persistent', 'drawer-persistent');
});
