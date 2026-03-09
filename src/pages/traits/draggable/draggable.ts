import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const swapList = document.getElementById('swap-list');
  if (!swapList) return;

  const swapLogEl = document.getElementById('swap-log');
  const replaceLogEl = document.getElementById('replace-log');
  const slotLogEl = document.getElementById('slot-log');
  const previewLogEl = document.getElementById('preview-log');

  function swapLog(msg) { if (swapLogEl) appendLog(swapLogEl, msg); }
  function replaceLog(msg) { if (replaceLogEl) appendLog(replaceLogEl, msg); }
  function slotLog(msg) { if (slotLogEl) appendLog(slotLogEl, msg); }
  function previewLog(msg) { if (previewLogEl) appendLog(previewLogEl, msg); }

  // ── Drop mode — swap ──

  swapList.addEventListener('native:drop', (e) => {
    const { item, target } = /** @type {CustomEvent} */ (e).detail;
    if (!target || target === item) return;
    const itemLabel = item.querySelector('span')?.textContent;
    const targetLabel = target.querySelector('span')?.textContent;
    const placeholder = document.createElement('div');
    item.before(placeholder);
    target.before(item);
    placeholder.replaceWith(target);
    swapLog(`Swapped "${itemLabel}" ↔ "${targetLabel}"`);
  });
  swapList.addEventListener('native:drag-cancel', (e) => {
    swapLog(`Cancelled: "${/** @type {CustomEvent} */ (e).detail.item.querySelector('span')?.textContent}"`);
  });

  // ── Drop mode — replace ──

  const replaceList = document.getElementById('replace-list');
  replaceList?.addEventListener('native:drop', (e) => {
    const { item, target } = /** @type {CustomEvent} */ (e).detail;
    if (!target) return;
    const slot = target.querySelector('.role-assignee');
    const name = item.textContent;
    const role = target.querySelector('.role-name')?.textContent;
    if (slot) slot.textContent = name;
    replaceLog(`Assigned "${name}" → ${role}`);
  });

  // ── Slot mode — vertical list ──

  const slotList = document.getElementById('slot-list');
  slotList?.addEventListener('native:drop', (e) => {
    const { item, insertBefore, toIndex } = /** @type {CustomEvent} */ (e).detail;
    if (toIndex === -1) return;
    if (insertBefore) {
      insertBefore.before(item);
    } else {
      slotList?.appendChild(item);
    }
    slotLog(`Inserted "${item.querySelector('span')?.textContent}" at position ${toIndex}`);
  });

  // ── Slot mode — horizontal cards ──

  const cardRow = document.getElementById('card-row');
  cardRow?.addEventListener('native:drop', (e) => {
    const { item, insertBefore } = /** @type {CustomEvent} */ (e).detail;
    if (insertBefore) {
      insertBefore.before(item);
    } else {
      cardRow?.appendChild(item);
    }
  });

  // ── Cross-zone — kanban ──

  const kanbanBoard = document.getElementById('kanban-board');
  const kanbanLogEl = document.getElementById('kanban-log');
  function kanbanLog(msg) { if (kanbanLogEl) appendLog(kanbanLogEl, msg); }

  kanbanBoard?.addEventListener('native:drop', (e) => {
    const { item, insertBefore, sourceZone, targetZone } = /** @type {CustomEvent} */ (e).detail;
    const label = item.textContent.trim();
    if (insertBefore) {
      insertBefore.before(item);
    } else {
      targetZone.appendChild(item);
    }
    if (sourceZone !== targetZone) {
      const from = sourceZone.querySelector('.kanban-column-title')?.textContent;
      const to = targetZone.querySelector('.kanban-column-title')?.textContent;
      kanbanLog(`Moved "${label}" from ${from} → ${to}`);
    } else {
      kanbanLog(`Reordered "${label}" within ${sourceZone.querySelector('.kanban-column-title')?.textContent}`);
    }
  });

  // ── Preview mode — grid reorder ──

  const previewGrid = document.getElementById('preview-grid');
  previewGrid?.addEventListener('native:drop', (e) => {
    const { item, fromIndex, toIndex } = /** @type {CustomEvent} */ (e).detail;
    previewLog(`Moved cell ${item.textContent.trim()} from position ${fromIndex} → ${toIndex}`);
  });
  previewGrid?.addEventListener('native:drag-cancel', (e) => {
    previewLog(`Cancelled: cell ${/** @type {CustomEvent} */ (e).detail.item.textContent.trim()} restored`);
  });
});
