document.addEventListener('astro:page-load', () => {
  const single = document.getElementById('single');
  if (!single) return;

  const singleOutput = document.getElementById('single-output');
  single.addEventListener('native:change', (e) => {
    if (singleOutput) singleOutput.textContent = `Selected: ${/** @type {CustomEvent} */ (e).detail.value}`;
  });

  // Range output
  const rangeCal = document.getElementById('range-cal');
  const rangeOutput = document.getElementById('range-output');
  rangeCal?.addEventListener('native:range-select', (e) => {
    const { start, end } = /** @type {CustomEvent} */ (e).detail;
    if (rangeOutput) rangeOutput.textContent = `Range: ${start} → ${end}`;
  });
});
