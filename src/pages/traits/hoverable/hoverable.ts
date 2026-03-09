import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('instant-card')) return;

  // ── Helper: update status badge ──

  function bindStatus(el) {
    const badge = el.querySelector('.hover-status');
    el.addEventListener('native:hover-enter', () => { if (badge) badge.textContent = 'hovered'; });
    el.addEventListener('native:hover-leave', () => { if (badge) badge.textContent = 'idle'; });
  }

  // ── Bind status badges ──

  for (const el of document.querySelectorAll('.hover-card')) {
    bindStatus(el);
  }

  // ── Instant Hover ──

  const instantCard = document.getElementById('instant-card');
  const instantLogEl = document.getElementById('instant-log');
  instantCard?.addEventListener('native:hover-enter', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(instantLogEl, `Enter (${ce.detail.pointerType})`);
  });
  instantCard?.addEventListener('native:hover-leave', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(instantLogEl, `Leave (${ce.detail.pointerType})`);
  });

  // ── Hover Intent ──

  const intentCard = document.getElementById('intent-card');
  const intentLogEl = document.getElementById('intent-log');
  intentCard?.addEventListener('native:hover-enter', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(intentLogEl, `Enter after 500ms (${ce.detail.pointerType})`);
  });
  intentCard?.addEventListener('native:hover-leave', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(intentLogEl, `Leave (${ce.detail.pointerType})`);
  });

  // ── Sticky Hover ──

  const stickyCard = document.getElementById('sticky-card');
  const stickyLogEl = document.getElementById('sticky-log');
  stickyCard?.addEventListener('native:hover-enter', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(stickyLogEl, `Enter (${ce.detail.pointerType})`);
  });
  stickyCard?.addEventListener('native:hover-leave', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(stickyLogEl, `Leave after 300ms delay (${ce.detail.pointerType})`);
  });

  // ── Combined Delays ──

  const combinedCard = document.getElementById('combined-card');
  const combinedLogEl = document.getElementById('combined-log');
  combinedCard?.addEventListener('native:hover-enter', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(combinedLogEl, `Enter after 400ms (${ce.detail.pointerType})`);
  });
  combinedCard?.addEventListener('native:hover-leave', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    appendLog(combinedLogEl, `Leave after 200ms (${ce.detail.pointerType})`);
  });
});
