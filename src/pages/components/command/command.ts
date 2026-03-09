import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const basicCommand = document.getElementById('basic-command');
  if (!basicCommand) return;

  const basicLog = document.getElementById('basic-log');
  let count = 0;

  basicCommand.addEventListener('native:change', (e) => {
    count++;
    logPrepend(basicLog, `#${count} native:change — value: "${/** @type {CustomEvent} */ (e).detail.value}", label: "${/** @type {CustomEvent} */ (e).detail.label}"`);
  });

  basicCommand.addEventListener('native:dismiss', () => {
    count++;
    logPrepend(basicLog, `#${count} native:dismiss`);
  });
});
