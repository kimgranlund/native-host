import { SearchController } from '@nonoun/native-ui';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('controller-list')) return;

  // ── Basic Filter ──

  const basicWrap = document.getElementById('basic-wrap');
  if (!basicWrap) return;
  const basicSearch = new SearchController(basicWrap, {
    selector: '.search-item',
  });

  const basicInput = document.getElementById('basic-input');
  basicInput?.addEventListener('native:input', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    basicSearch.filter(ce.detail.value);
  });

  const basicLogEl = document.getElementById('basic-log');
  basicWrap.addEventListener('native:search', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    const { query, matchCount, total } = ce.detail;
    appendLog(basicLogEl, `"${query}" — ${matchCount}/${total} matches`);
  });

  // ── Custom Text Field ──

  const fieldWrap = document.getElementById('field-wrap');
  if (!fieldWrap) return;
  const fieldSearch = new SearchController(fieldWrap, {
    selector: '.search-item',
    textField: 'data-search',
  });

  const fieldInput = document.getElementById('field-input');
  fieldInput?.addEventListener('native:input', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    fieldSearch.filter(ce.detail.value);
  });

  // ── Highlight Matches ──

  const highlightWrap = document.getElementById('highlight-wrap');
  if (!highlightWrap) return;
  const highlightSearch = new SearchController(highlightWrap, {
    selector: '.search-item',
  });

  const highlightInput = document.getElementById('highlight-input');
  highlightInput?.addEventListener('native:input', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    const query = ce.detail.value;
    highlightSearch.filter(query);
    for (const item of highlightWrap.querySelectorAll('.search-item')) {
      const original = item.getAttribute('data-original') ?? '';
      item.innerHTML = SearchController.highlight(original, query);
    }
  });

  // ── SearchController — Attach to Any Element ──

  const ctrlList = document.getElementById('controller-list');
  if (!ctrlList) return;
  const ctrlSearch = new SearchController(ctrlList, {
    selector: '.search-item',
  });

  const ctrlLogEl = document.getElementById('ctrl-log');

  const ctrlInput = document.getElementById('ctrl-input');
  ctrlInput?.addEventListener('native:input', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    const { matches, hidden, total } = ctrlSearch.filter(ce.detail.value);
    appendLog(ctrlLogEl, `${matches.length}/${total} matches`);
  });

  ctrlList.addEventListener('native:search', (e) => {
    /** @type {CustomEvent} */ const ce = e;
    const { query, matchCount, total } = ce.detail;
    appendLog(ctrlLogEl, `"${query}" — ${matchCount}/${total} matches`);
  });
});
