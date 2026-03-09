import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('once-a')) return;

  function bindStatus(el) {
    const badge = el.querySelector('.intersect-status');
    el.addEventListener('native:intersect', (e) => {
      /** @type {CustomEvent} */ const ce = e;
      if (badge) badge.textContent = ce.detail.isIntersecting ? 'visible' : 'hidden';
    });
  }

  // ── Bind status badges ──

  for (const el of document.querySelectorAll('.intersect-box')) {
    bindStatus(el);
  }

  // ── Once mode: add .revealed class on first intersection ──

  for (const el of [document.getElementById('once-a'), document.getElementById('once-b'), document.getElementById('once-c')]) {
    el?.addEventListener('native:intersect', (e) => {
      /** @type {CustomEvent} */ const ce = e;
      if (ce.detail.isIntersecting) el.classList.add('revealed');
    });
  }

  // ── Event logging: Scroll Into View ──

  const scrollLogEl = document.getElementById('scroll-log');
  const scrollBoxes = document.querySelectorAll('.layout-section:nth-of-type(1) .intersect-box');
  for (const el of scrollBoxes) {
    el.addEventListener('native:intersect', (e) => {
      /** @type {CustomEvent} */ const ce = e;
      const label = el.querySelector('.intersect-label')?.textContent;
      appendLog(scrollLogEl, `${label}: ${ce.detail.isIntersecting ? 'enter' : 'leave'} (ratio: ${ce.detail.ratio.toFixed(2)})`);
    });
  }

  // ── Event logging: Once mode ──

  const onceLogEl = document.getElementById('once-log');
  for (const el of [document.getElementById('once-a'), document.getElementById('once-b'), document.getElementById('once-c')]) {
    el?.addEventListener('native:intersect', (e) => {
      /** @type {CustomEvent} */ const ce = e;
      const label = el.querySelector('.intersect-label')?.textContent;
      appendLog(onceLogEl, `${label}: ${ce.detail.isIntersecting ? 'enter (observer disconnects)' : 'leave'}`);
    });
  }

  // ── Event logging: Threshold ──

  const thresholdLogEl = document.getElementById('threshold-log');
  const thresholdBoxes = document.querySelectorAll('.layout-section:last-of-type .intersect-box');
  for (const el of thresholdBoxes) {
    el.addEventListener('native:intersect', (e) => {
      /** @type {CustomEvent} */ const ce = e;
      const label = el.querySelector('.intersect-label')?.textContent;
      appendLog(thresholdLogEl, `${label}: ${ce.detail.isIntersecting ? 'enter' : 'leave'} (ratio: ${ce.detail.ratio.toFixed(2)})`);
    });
  }
});
