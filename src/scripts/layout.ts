// Client-side interactivity for the sidebar layout shell.
// Handles: sidebar collapse/expand, theme toggle, command palette (Cmd+K),
// code toggle, copy-buttons, inspector toggle, chat toggle, nav group persistence, and navigation.

import '../scripts/copy-buttons';
import {
  PREF_COLOR_SCHEME,
  PREF_SIDEBAR_COLLAPSED,
  PREF_GROUP_STATES,
  PREF_SHOW_CODE,
} from '../lib/preferences';

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;expires=${expires};SameSite=Lax`;
}

// ── Sidebar collapse/expand ──

const layout = document.getElementById('layout-sidebar') as HTMLElement | null;
const sidebarToggle = document.getElementById('sidebar-toggle') as HTMLElement | null;

// Server renders correct collapsed state and icon — no client-side init needed.

sidebarToggle?.addEventListener('click', () => {
  if (!layout) return;
  const collapsed = layout.hasAttribute('collapsed');
  const icon = sidebarToggle.querySelector('n-icon');
  if (collapsed) {
    layout.removeAttribute('collapsed');
    localStorage.setItem(PREF_SIDEBAR_COLLAPSED, 'false');
    setCookie(PREF_SIDEBAR_COLLAPSED, 'false');
    icon?.removeAttribute('weight');
  } else {
    layout.setAttribute('collapsed', '');
    localStorage.setItem(PREF_SIDEBAR_COLLAPSED, 'true');
    setCookie(PREF_SIDEBAR_COLLAPSED, 'true');
    icon?.setAttribute('weight', 'fill');
  }
});

// ── Theme toggle ──

const themeToggle = document.getElementById('theme-toggle') as HTMLElement | null;

function updateThemeIcon() {
  if (!themeToggle) return;
  const scheme = document.documentElement.style.colorScheme;
  const isDark = scheme === 'dark' || (!scheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  themeToggle.innerHTML = isDark
    ? '<n-icon name="sun" size="md"></n-icon>'
    : '<n-icon name="moon" size="md"></n-icon>';
}

themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.style.colorScheme;
  const isDark = current === 'dark' || (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const next = isDark ? 'light' : 'dark';
  document.documentElement.style.colorScheme = next;
  localStorage.setItem(PREF_COLOR_SCHEME, next);
  setCookie(PREF_COLOR_SCHEME, next);
  updateThemeIcon();
});

// ── Code toggle ──

const codeToggle = document.getElementById('code-toggle') as HTMLElement | null;

function syncCodeState(show: boolean) {
  localStorage.setItem(PREF_SHOW_CODE, String(show));
  setCookie(PREF_SHOW_CODE, String(show));
  const icon = codeToggle?.querySelector('n-icon');
  if (icon) {
    if (show) icon.setAttribute('weight', 'fill');
    else icon.removeAttribute('weight');
  }
  for (const block of document.querySelectorAll('.layout-code')) {
    if (show) block.setAttribute('visible', '');
    else block.removeAttribute('visible');
  }
}

// Show code toggle button only if page has code blocks
if (codeToggle && document.querySelectorAll('.layout-code').length > 0) {
  codeToggle.style.display = '';
  if (localStorage.getItem(PREF_SHOW_CODE) === 'true') syncCodeState(true);
}

codeToggle?.addEventListener('click', () => {
  const willShow = localStorage.getItem(PREF_SHOW_CODE) !== 'true';
  syncCodeState(willShow);
});

// ── Panel toggles (inspector + chat) ──

import '@nonoun/native-tokens';

function wireToggle(btnId: string, panelId: string) {
  const btn = document.getElementById(btnId) as HTMLElement | null;
  const panel = document.getElementById(panelId) as HTMLElement & { toggle(): void } | null;
  btn?.addEventListener('click', () => panel?.toggle());
  if (panel) {
    new MutationObserver(() => {
      const icon = btn?.querySelector('n-icon');
      if (!icon) return;
      if (panel.hasAttribute('open')) icon.setAttribute('weight', 'fill');
      else icon.removeAttribute('weight');
    }).observe(panel, { attributes: true, attributeFilter: ['open'] });
  }
}

wireToggle('inspector-toggle', 'inspector-panel');
wireToggle('chat-toggle', 'chat-panel');

// ── Nav group persistence ──

let groupStates: Record<string, boolean> = {};
try {
  const stored = localStorage.getItem(PREF_GROUP_STATES);
  if (stored) groupStates = JSON.parse(stored);
} catch { /* ignore */ }

// Also read from cookie if localStorage is empty (fresh browser, cookies from SSR)
if (Object.keys(groupStates).length === 0) {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${PREF_GROUP_STATES}=([^;]*)`));
    if (match) groupStates = JSON.parse(decodeURIComponent(match[1]));
  } catch { /* ignore */ }
}

function applyAndObserveGroups() {
  for (const group of document.querySelectorAll('n-sidebar-group')) {
    const header = group.querySelector('n-sidebar-group-header');
    const name = header?.textContent?.trim();
    if (!name) continue;

    // Apply persisted state — default: Components open, others closed
    const defaultOpen = name === 'Components';
    const shouldBeOpen = groupStates[name] ?? defaultOpen;
    (group as any).open = shouldBeOpen;

    // Observe future user-driven changes
    let skipNext = true; // skip the mutation from the apply above
    new MutationObserver(() => {
      if (skipNext) { skipNext = false; return; }
      groupStates[name] = group.hasAttribute('open');
      const json = JSON.stringify(groupStates);
      localStorage.setItem(PREF_GROUP_STATES, json);
      setCookie(PREF_GROUP_STATES, json);
    }).observe(group, { attributes: true, attributeFilter: ['open'] });
  }
}

if (customElements.get('n-sidebar-group')) {
  applyAndObserveGroups();
} else {
  customElements.whenDefined('n-sidebar-group').then(applyAndObserveGroups);
}

// ── Nav item navigation ──

const nav = document.querySelector('n-sidebar-content n-sidebar-nav');
nav?.addEventListener('native:change', ((e: CustomEvent) => {
  window.location.href = e.detail.value;
}) as EventListener);

// ── Command palette (Cmd+K) ──

const dialog = document.getElementById('nav-cmd-dialog') as HTMLElement & { showModal(): void; close(): void; open: boolean } | null;
const searchBtn = document.getElementById('nav-search-btn');

function openDialog() {
  if (!dialog) return;
  dialog.showModal();
}

searchBtn?.addEventListener('click', openDialog);

dialog?.addEventListener('close', () => {
  const input = dialog.querySelector<HTMLInputElement>('n-command-input input');
  if (input) {
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
});

const uiCommand = dialog?.querySelector('n-command');
uiCommand?.addEventListener('native:change', ((e: CustomEvent) => {
  dialog!.close();
  window.location.href = e.detail.value;
}) as EventListener);

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (!dialog) return;
    if (dialog.open) dialog.close();
    else openDialog();
  }
});
