document.addEventListener('astro:page-load', () => {
  const otp = document.getElementById('otp-live');
  if (!otp) return;

  const display = document.getElementById('otp-value');
  otp.addEventListener('native:input', (e) => {
    const val = /** @type {CustomEvent} */ (e).detail.value;
    if (display) display.textContent = val.padEnd(6, '_');
  });
});
