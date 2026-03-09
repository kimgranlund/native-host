import { RangeSelectController } from '@nonoun/native-ui';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('drag-grid')) return;

  // ── Stamp 28 cells into grids ──

  /** @param {HTMLElement} container */
  function stampCells(container) {
    for (let i = 1; i <= 28; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = String(i);
      container.appendChild(cell);
    }
  }

  // Drag mode grid (cells inside n-controller child div)
  const dragGrid = document.getElementById('drag-grid');
  if (dragGrid) stampCells(dragGrid);

  // Click mode grid (cells inside plain div)
  const clickGrid = document.getElementById('click-grid');
  if (clickGrid) stampCells(clickGrid);

  // ── Drag Mode: Calendar Grid (Provider) ──

  const dragOutput = document.getElementById('drag-output');
  dragGrid?.addEventListener('native:range-select', (e) => {
    const { startIndex, endIndex } = /** @type {CustomEvent} */ (e).detail;
    appendLog(dragOutput, `Selected days ${startIndex + 1}\u2013${endIndex + 1}`);
  });
  dragGrid?.addEventListener('native:range-change', (e) => {
    const { startIndex, endIndex } = /** @type {CustomEvent} */ (e).detail;
    if (dragOutput) dragOutput.textContent = `Dragging: days ${startIndex + 1}\u2013${endIndex + 1}`;
  });

  // ── Click Mode: Calendar Grid (RangeSelectController) ──

  const clickCtrl = clickGrid ? new RangeSelectController(clickGrid, {
    selector: '.cell',
    mode: 'click',
  }) : null;

  const clickOutput = document.getElementById('click-output');

  clickGrid?.addEventListener('native:range-change', (e) => {
    const { startIndex, endIndex } = /** @type {CustomEvent} */ (e).detail;
    if (clickOutput) clickOutput.textContent = `Preview: days ${startIndex + 1}\u2013${endIndex + 1}`;
  });

  clickGrid?.addEventListener('native:range-select', (e) => {
    const { startIndex, endIndex } = /** @type {CustomEvent} */ (e).detail;
    appendLog(clickOutput, `Committed: days ${startIndex + 1}\u2013${endIndex + 1}`);
  });

  document.getElementById('clear-btn')?.addEventListener('native:press', () => {
    clickCtrl?.clearRange();
    if (clickOutput) clickOutput.textContent = 'Range cleared. Click a start date.';
  });

  // ── Drag Mode: Vertical List (Provider) ──

  const listOutput = document.getElementById('list-output');
  const list = document.getElementById('list');

  list?.addEventListener('native:range-select', (e) => {
    const { startIndex, endIndex, items } = /** @type {CustomEvent} */ (e).detail;
    appendLog(listOutput, `Selected ${items.length} items (${startIndex}\u2013${endIndex})`);
  });

  // ── RangeSelectController: Attach to Any Element ──

  const ctrlList = document.getElementById('ctrl-list');
  ctrlList ? new RangeSelectController(ctrlList, {
    selector: '.list-item',
    mode: 'drag',
  }) : null;

  const ctrlOutput = document.getElementById('ctrl-output');
  ctrlList?.addEventListener('native:range-select', (e) => {
    const { startIndex, endIndex, items } = /** @type {CustomEvent} */ (e).detail;
    appendLog(ctrlOutput, `Selected ${items.length} items (${startIndex}\u2013${endIndex})`);
  });
});
