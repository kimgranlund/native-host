import { NativeElement, define, CopyController } from '@nonoun/native-ui';
import { logAppend as appendLog } from '../../../scripts/event-log';

// ── Minimal NativeElement shell for injection demos ──
if (!customElements.get('copy-demo')) {
  class CopyDemo extends NativeElement {}
  define('copy-demo', CopyDemo);
}

document.addEventListener('astro:page-load', () => {
  const getterEl = document.getElementById('getter-demo');
  if (!getterEl) return;

  // ── Basic Copy (injection) — wire native:press → copy ──

  for (const el of document.querySelectorAll('copy-demo[traits*="copyable"]')) {
    el.addEventListener('native:press', () => {
      /** @type {any} */ (el).getTraitController('copyable')?.copy();
    });
  }

  const basicLogEl = document.getElementById('basic-log');
  document.querySelector('copy-demo[data-trait-copyable-value="npm install native-ui"]')?.addEventListener('native:copy', (e) => {
    appendLog(basicLogEl, `Copied: "${/** @type {CustomEvent} */ (e).detail.value}"`);
  });

  // ── Copy with Getter (CopyController direct) ──

  const getterCopy = new CopyController(getterEl, {
    value: () => new Date().toISOString(),
  });

  getterEl.addEventListener('native:press', () => getterCopy.copy());

  const getterLogEl = document.getElementById('getter-log');
  getterEl.addEventListener('native:copy', (e) => {
    appendLog(getterLogEl, `Copied: "${/** @type {CustomEvent} */ (e).detail.value}"`);
  });

  // ── Custom Duration (injection) — log ──

  const fastLogEl = document.getElementById('fast-log');
  document.querySelector('copy-demo[data-trait-copyable-feedback-duration="500"]')?.addEventListener('native:copy', (e) => {
    appendLog(fastLogEl, `Copied: "${/** @type {CustomEvent} */ (e).detail.value}"`);
  });

  // ── Provider Pattern — wire click → copy ──
  // The CopyController is managed by n-controller on the first child.
  // Since targets are plain divs (not NativeElement), we read the value from
  // the controller attribute and invoke clipboard API directly.

  const providerCard = document.getElementById('provider-card');
  providerCard?.addEventListener('click', async () => {
    const value = document.getElementById('provider-ctrl')?.getAttribute('data-trait-copyable-value') ?? '';
    await navigator.clipboard.writeText(value);
    providerCard.toggleAttribute('copied', true);
    setTimeout(() => providerCard.removeAttribute('copied'), 2000);
    providerCard.dispatchEvent(new CustomEvent('native:copy', { bubbles: true, detail: { value } }));
  });

  const providerLogEl = document.getElementById('provider-log');
  providerCard?.addEventListener('native:copy', (e) => {
    appendLog(providerLogEl, `Copied: "${/** @type {CustomEvent} */ (e).detail.value}"`);
  });
});
