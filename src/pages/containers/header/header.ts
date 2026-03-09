document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('drawer-demo')) return;

  const drawer = /** @type {any} */ (document.getElementById('drawer-demo'));
  document.getElementById('open-drawer')?.addEventListener('native:press', () => drawer?.show());
  document.getElementById('close-drawer')?.addEventListener('native:press', () => drawer?.close());
  document.getElementById('cancel-drawer')?.addEventListener('native:press', () => drawer?.close());
});
