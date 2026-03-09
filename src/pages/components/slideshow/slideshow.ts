document.addEventListener('astro:page-load', () => {
  const demo = document.getElementById('event-demo');
  if (!demo) return;
  const log = document.getElementById('event-log');
  demo.addEventListener('native:slide-change', (e) => {
    const { index } = /** @type {CustomEvent} */ (e).detail;
    if (log) {
      log.textContent = `native:slide-change → index: ${index}\n` + log.textContent;
      if (log.textContent.length > 500) log.textContent = log.textContent.slice(0, 500);
    }
  });
});
