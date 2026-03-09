import { effect, signal, PopoverController } from '@nonoun/native-ui';

// ── Helper: wire a popover instance ──

/**
 * @param {string} hostId
 * @param {string} triggerId
 * @param {string} contentId
 */
function wirePopDemo(hostId, triggerId, contentId) {
  const host = document.getElementById(hostId);
  const trigger = document.getElementById(triggerId);
  const content = document.getElementById(contentId);
  if (!host || !trigger || !content) return;

  const popover = new PopoverController(host);
  const open = signal(false);

  popover.wirePopover(trigger, content);

  trigger.addEventListener('native:press', () => {
    open.value = !open.value;
  });

  host.addEventListener('native:dismiss', () => {
    open.value = false;
  });

  effect(() => {
    popover.syncPopover(open.value);
  });
}

// ── Wire all popover demos ──

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('popoverable-demo-1')) return;

  wirePopDemo('popoverable-demo-1', 'pop-trigger-1', 'pop-content-1');
  wirePopDemo('pop-2', 'pop-trigger-2', 'pop-content-2');
  wirePopDemo('pop-3', 'pop-trigger-3', 'pop-content-3');
});
