document.addEventListener('astro:page-load', () => {
  const bar = document.getElementById('demo-js-progress');
  if (!bar) return;

  const btnAnimate = document.getElementById('demo-progress-animate');
  const btnReset = document.getElementById('demo-progress-reset');

  btnAnimate?.addEventListener('click', () => {
    let value = 0;
    const step = () => {
      value += 0.02;
      if (value > 1) value = 1;
      bar.style.setProperty('--n-progress', String(value));
      if (value < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  btnReset?.addEventListener('click', () => {
    bar.style.setProperty('--n-progress', '0');
  });
});
