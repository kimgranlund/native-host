document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('tabbar')) return;

  // ── Tab bar: active class switching ──

  const tabbar = document.getElementById('tabbar');
  tabbar?.addEventListener('focusin', (e) => {
    for (const item of tabbar.querySelectorAll('.tab-item')) item.classList.remove('active');
    if (e.target !== tabbar && e.target instanceof HTMLElement) e.target.classList.add('active');
  });
});
