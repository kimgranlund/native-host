document.addEventListener('astro:page-load', () => {
  const range = document.getElementById('zoom-range');
  if (!range) return;
  const display = document.getElementById('zoom-value');
  range.addEventListener('native:input', (e) => {
    if (display) display.textContent = `${/** @type {CustomEvent} */ (e).detail.value}%`;
  });
});
