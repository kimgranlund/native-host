document.addEventListener('astro:page-load', () => {
  const pag = document.getElementById('live-pagination');
  if (!pag) return;
  const display = document.getElementById('page-display');
  pag.addEventListener('native:change', (e) => {
    if (display) display.textContent = String(/** @type {CustomEvent} */ (e).detail.value);
  });
});
