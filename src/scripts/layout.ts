// Client-side interactivity for the sidebar layout shell.
// Handles: sidebar collapse/expand, theme toggle, command palette (Cmd+K),
// code toggle, inspector toggle, chat toggle, nav group persistence, and navigation.

const STORAGE_COLLAPSED = 'nav-sidebar-collapsed';
const STORAGE_COLOR_SCHEME = 'nav-color-scheme';
const STORAGE_GROUP_STATES = 'nav-group-states';
const CODE_STORAGE = 'demo-show-code';

// ── Sidebar collapse/expand ──

const layout = document.getElementById('layout-sidebar') as HTMLElement | null;
const sidebarToggle = document.getElementById('sidebar-toggle') as HTMLElement | null;

// Collapsed state is set by an is:inline script in SidebarLayout.astro
// (runs before element upgrade). Here we just sync the toggle icon.
if (layout?.hasAttribute('collapsed') && sidebarToggle) {
  sidebarToggle.innerHTML = '<ui-icon name="sidebar-simple-fill" size="md"></ui-icon>';
}

sidebarToggle?.addEventListener('click', () => {
  if (!layout) return;
  const collapsed = layout.hasAttribute('collapsed');
  if (collapsed) {
    layout.removeAttribute('collapsed');
    localStorage.setItem(STORAGE_COLLAPSED, 'false');
    sidebarToggle.innerHTML = '<ui-icon name="sidebar-simple" size="md"></ui-icon>';
  } else {
    layout.setAttribute('collapsed', '');
    localStorage.setItem(STORAGE_COLLAPSED, 'true');
    sidebarToggle.innerHTML = '<ui-icon name="sidebar-simple-fill" size="md"></ui-icon>';
  }
});

// ── Theme toggle ──

const themeToggle = document.getElementById('theme-toggle') as HTMLElement | null;
// Color scheme is restored by an is:inline script in BaseLayout.astro (before paint).

function updateThemeIcon() {
  if (!themeToggle) return;
  const scheme = document.documentElement.style.colorScheme;
  const isDark = scheme === 'dark' || (!scheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  themeToggle.innerHTML = isDark
    ? '<ui-icon name="sun" size="md"></ui-icon>'
    : '<ui-icon name="moon" size="md"></ui-icon>';
}
updateThemeIcon();

themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.style.colorScheme;
  const isDark = current === 'dark' || (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const next = isDark ? 'light' : 'dark';
  document.documentElement.style.colorScheme = next;
  localStorage.setItem(STORAGE_COLOR_SCHEME, next);
  updateThemeIcon();
});

// ── Code toggle ──

const codeToggle = document.getElementById('code-toggle') as HTMLElement | null;

function syncCodeState(show: boolean) {
  localStorage.setItem(CODE_STORAGE, String(show));
  if (codeToggle) {
    codeToggle.innerHTML = show
      ? '<ui-icon name="code-fill" size="md"></ui-icon>'
      : '<ui-icon name="code" size="md"></ui-icon>';
  }
  for (const block of document.querySelectorAll('.layout-code')) {
    if (show) block.setAttribute('visible', '');
    else block.removeAttribute('visible');
  }
}

// Show code toggle button only if page has code blocks
if (codeToggle && document.querySelectorAll('.layout-code').length > 0) {
  codeToggle.style.display = '';
  if (localStorage.getItem(CODE_STORAGE) === 'true') syncCodeState(true);
}

codeToggle?.addEventListener('click', () => {
  const willShow = localStorage.getItem(CODE_STORAGE) !== 'true';
  syncCodeState(willShow);
});

// ── Inspector toggle ──

import { buildInspector } from '@nonoun/native-ui/inspector';

const inspectorToggle = document.getElementById('inspector-toggle') as HTMLElement | null;
const inspector = document.querySelector('ui-layout-inspector') as HTMLElement & { toggle(): void } | null;

if (inspector) {
  buildInspector(inspector);
}

inspectorToggle?.addEventListener('click', () => {
  inspector?.toggle();
});

if (inspector) {
  new MutationObserver(() => {
    if (!inspectorToggle) return;
    const isOpen = inspector.hasAttribute('open');
    inspectorToggle.innerHTML = isOpen
      ? '<ui-icon name="sliders-horizontal-fill" size="md"></ui-icon>'
      : '<ui-icon name="sliders-horizontal" size="md"></ui-icon>';
  }).observe(inspector, { attributes: true, attributeFilter: ['open'] });
}

// ── Chat toggle ──

const chatToggle = document.getElementById('chat-toggle') as HTMLElement | null;
const chat = document.querySelector('ui-layout-chat') as HTMLElement & { toggle(): void } | null;

chatToggle?.addEventListener('click', () => {
  chat?.toggle();
});

if (chat) {
  new MutationObserver(() => {
    if (!chatToggle) return;
    const isOpen = chat.hasAttribute('open');
    chatToggle.innerHTML = isOpen
      ? '<ui-icon name="chat-dots-fill" size="md"></ui-icon>'
      : '<ui-icon name="chat-dots" size="md"></ui-icon>';
  }).observe(chat, { attributes: true, attributeFilter: ['open'] });
}

// ── Nav group persistence ──

let groupStates: Record<string, boolean> = {};
try {
  const stored = localStorage.getItem(STORAGE_GROUP_STATES);
  if (stored) groupStates = JSON.parse(stored);
} catch { /* ignore */ }

function applyGroupStates() {
  for (const group of document.querySelectorAll('ui-nav-group')) {
    const header = group.querySelector('ui-nav-group-header');
    const name = header?.textContent?.trim();
    if (!name) continue;

    // Apply persisted state — default: Components open, others closed
    const defaultOpen = name === 'Components';
    const shouldBeOpen = groupStates[name] ?? defaultOpen;
    (group as any).open = shouldBeOpen;

    // Observe user-driven changes (skip the initial sync)
    let syncing = false;
    const obs = new MutationObserver(() => {
      if (syncing) return;
      groupStates[name] = group.hasAttribute('open');
      localStorage.setItem(STORAGE_GROUP_STATES, JSON.stringify(groupStates));
    });
    obs.observe(group, { attributes: true, attributeFilter: ['open'] });
  }
}

// Wait for ui-nav-group to be defined so .open property is available
if (customElements.get('ui-nav-group')) {
  applyGroupStates();
} else {
  customElements.whenDefined('ui-nav-group').then(applyGroupStates);
}

// ── Nav item navigation ──

const nav = document.querySelector('.nav-links');
nav?.addEventListener('ui-change', ((e: CustomEvent) => {
  window.location.href = e.detail.value;
}) as EventListener);

// ── Command palette (Cmd+K) ──

const dialog = document.getElementById('nav-cmd-dialog') as HTMLElement & { showModal(): void; close(): void; open: boolean } | null;
const searchBtn = document.getElementById('nav-search-btn');

function openDialog() {
  if (!dialog) return;
  dialog.showModal();
  requestAnimationFrame(() => {
    dialog.querySelector<HTMLInputElement>('ui-command-input input')?.focus();
  });
}

searchBtn?.addEventListener('click', openDialog);

dialog?.addEventListener('close', () => {
  const input = dialog.querySelector<HTMLInputElement>('ui-command-input input');
  if (input) {
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
});

const uiCommand = dialog?.querySelector('ui-command');
uiCommand?.addEventListener('ui-change', ((e: CustomEvent) => {
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
