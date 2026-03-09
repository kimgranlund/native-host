import { PresentController } from '@nonoun/native-ui';
import { logAppend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('present-basic')) return;

  // ── Basic Demo ──

  const content1 = document.getElementById('present-content-1');
  if (!content1) return;
  const ctrl1 = new PresentController(content1);

  document.getElementById('present-basic')?.addEventListener('native:press', () => {
    ctrl1.present();
  });

  // ── Custom Inset Demo ──

  const content2 = document.getElementById('present-content-2');
  if (!content2) return;
  let ctrl2 = null;

  function presentWithInset(inset) {
    ctrl2?.destroy();
    ctrl2 = new PresentController(content2, { inset });
    ctrl2.present();
  }

  document.getElementById('present-inset-1rem')?.addEventListener('native:press', () => presentWithInset('1rem'));
  document.getElementById('present-inset-4rem')?.addEventListener('native:press', () => presentWithInset('4rem'));
  document.getElementById('present-inset-8rem')?.addEventListener('native:press', () => presentWithInset('8rem'));

  // ── No Close Button Demo ──

  const content3 = document.getElementById('present-content-3');
  if (!content3) return;
  const ctrl3 = new PresentController(content3, { closeButton: false });

  document.getElementById('present-no-close')?.addEventListener('native:press', () => {
    ctrl3.present();
  });

  // ── Events Demo ──

  const content4 = document.getElementById('present-content-4');
  if (!content4) return;
  const ctrl4 = new PresentController(content4);
  const logEl = document.getElementById('log');
  let count = 0;

  content4.addEventListener('native:present', () => {
    count++;
    logAppend(logEl, `#${count} native:present — overlay opened`);
  });

  content4.addEventListener('native:dismiss', () => {
    count++;
    logAppend(logEl, `#${count} native:dismiss — overlay closed, host restored`);
  });

  document.getElementById('present-events')?.addEventListener('native:press', () => {
    ctrl4.present();
  });
});
