document.addEventListener('astro:page-load', () => {
  const openBtn = document.getElementById('demo-body-open-drawer');
  if (!openBtn) return;

  const drawer = document.getElementById('demo-body-drawer');
  const closeBtn = document.getElementById('demo-body-close-drawer');
  const cancelBtn = document.getElementById('demo-body-cancel-drawer');

  openBtn.addEventListener('click', () => {
    if (drawer) drawer.open = true;
  });
  closeBtn?.addEventListener('click', () => {
    if (drawer) drawer.open = false;
  });
  cancelBtn?.addEventListener('click', () => {
    if (drawer) drawer.open = false;
  });
});
