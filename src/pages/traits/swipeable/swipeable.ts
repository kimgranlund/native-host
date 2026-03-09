import { SwipeController } from '@nonoun/native-ui';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('swipeable-page')) return;

  // ── Horizontal Swipe (provider) ──

  const hCard = document.getElementById('h-card');
  const hLogEl = document.getElementById('h-log');
  hCard?.addEventListener('native:swipe', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    const { direction, distance, velocity } = ce.detail;
    appendLog(hLogEl, `${direction} — ${Math.round(distance)}px @ ${velocity.toFixed(2)}px/ms`);
  });

  // ── Vertical Swipe (provider) ──

  const vCard = document.getElementById('v-card');
  const vLogEl = document.getElementById('v-log');
  vCard?.addEventListener('native:swipe', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    const { direction, distance, velocity } = ce.detail;
    appendLog(vLogEl, `${direction} — ${Math.round(distance)}px @ ${velocity.toFixed(2)}px/ms`);
  });

  // ── Both Axes (provider) ──

  const bCard = document.getElementById('b-card');
  const bLogEl = document.getElementById('b-log');
  bCard?.addEventListener('native:swipe', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    const { direction, distance, velocity } = ce.detail;
    appendLog(bLogEl, `${direction} — ${Math.round(distance)}px @ ${velocity.toFixed(2)}px/ms`);
  });

  // ── Custom Threshold (provider) ──

  const cCard = document.getElementById('c-card');
  const cLogEl = document.getElementById('c-log');
  cCard?.addEventListener('native:swipe', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    const { direction, distance, velocity } = ce.detail;
    appendLog(cLogEl, `${direction} — ${Math.round(distance)}px @ ${velocity.toFixed(2)}px/ms`);
  });

  // ── SwipeController — attach to plain element ──

  const ctrlCard = document.getElementById('controller-card');
  if (ctrlCard) {
    const swipe = new SwipeController(ctrlCard, {
      threshold: 50,
      velocityThreshold: 0.3,
      axis: 'both',
    });

    const ctrlLogEl = document.getElementById('ctrl-log');
    ctrlCard.addEventListener('native:swipe', (e) => {
      /** @type {CustomEvent} */ const ce = e;
      const { direction, distance, velocity } = ce.detail;
      appendLog(ctrlLogEl, `${direction} — ${Math.round(distance)}px @ ${velocity.toFixed(2)}px/ms`);
    });
  }
});
