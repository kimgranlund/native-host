import { logPrepend } from '../../scripts/event-log';
import { registerIcon, getIconNames } from '@nonoun/native-ui';

document.addEventListener('astro:page-load', () => {
  const dynamicIcon = document.getElementById('dynamic-icon');
  if (!dynamicIcon) return;

  // ── Dynamic name change ──

  const iconPicker = document.getElementById('icon-picker');
  iconPicker?.addEventListener('change', () => {
    dynamicIcon.setAttribute('name', /** @type {HTMLSelectElement} */ (iconPicker).value ?? 'house');
  });

  // ── Late registration demo ──

  const registerBtn = document.getElementById('register-btn');
  const lateLog = document.getElementById('late-log');

  function log(msg) {
    logPrepend(lateLog, msg);
  }

  log('n-icon[name="late-demo"] created — icon not yet registered, renders empty.');

  registerBtn?.addEventListener('click', () => {
    registerIcon('late-demo', '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>');
    log('registerIcon("late-demo", ...) called — icon should now appear!');
    if (registerBtn) registerBtn.disabled = true;
  });

  // ── All Icons Grid ──

  const grid = document.getElementById('all-icons-grid');
  const searchInput = document.getElementById('icon-search');
  const countEl = document.getElementById('icon-count');
  if (!grid || !searchInput || !countEl) return;

  const allNames = getIconNames();

  function renderGrid(filter) {
    const q = (filter || '').toLowerCase().trim();
    const matched = q ? allNames.filter((n) => n.includes(q)) : allNames;

    countEl.textContent = `${matched.length} icons`;

    grid.innerHTML = '';
    const frag = document.createDocumentFragment();

    for (const name of matched) {
      const cell = document.createElement('div');
      cell.className = 'icon-cell';
      cell.innerHTML = `<n-icon name="${name}"></n-icon><span>${name}</span>`;
      frag.appendChild(cell);
    }

    grid.appendChild(frag);
  }

  searchInput.addEventListener('native:input', (e) => {
    renderGrid(/** @type {CustomEvent} */ (e).detail.value);
  });

  // Also handle standard input event as fallback
  searchInput.addEventListener('input', (e) => {
    renderGrid(/** @type {HTMLInputElement} */ (e.target).value);
  });

  renderGrid('');
});
