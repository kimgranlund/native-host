// Client-side interactivity for the sidebar layout shell.
// Handles: sidebar collapse/expand, theme toggle, command palette (Cmd+K),
// code toggle, copy-buttons, inspector toggle, chat toggle, and navigation.
//
// With Astro View Transitions (<ClientRouter />), this module runs once.
// Custom swap keeps the sidebar DOM intact across navigations — only the
// content panel and breadcrumb are replaced.  Sidebar-level wiring runs once
// per DOM instance; per-page wiring (copy buttons, code state) runs on every
// astro:page-load.

import { navigate, swapFunctions } from 'astro:transitions/client';
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

// ── Keyboard shortcut (Cmd+K) — document-level, never lost ──

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    const dialog = document.getElementById('nav-cmd-dialog') as HTMLElement & { showModal(): void; close(): void; open: boolean } | null;
    if (!dialog) return;
    if (dialog.open) dialog.close();
    else dialog.showModal();
  }
});

// ── Inspector import (once) ──

import '@nonoun/native-tokens';

// ── Custom swap — preserve sidebar DOM across navigations ──
//
// When both the current and incoming pages use the sidebar layout, we swap
// only the content panel and breadcrumb text.  The sidebar aside (nav groups,
// scroll position, open/closed states) stays untouched in the live DOM.
// For sidebar ↔ non-sidebar transitions the default full-body swap is used.

document.addEventListener('astro:before-swap', ((e: any) => {
  const currentSidebar = document.getElementById('layout-sidebar');
  const newSidebar = (e.newDocument as Document).getElementById('layout-sidebar');

  // Fall through to default swap when either page lacks the sidebar layout
  if (!currentSidebar || !newSidebar) return;

  e.swap = () => {
    swapFunctions.deselectScripts(e.newDocument);
    swapFunctions.swapRootAttributes(e.newDocument);
    swapFunctions.swapHeadElements(e.newDocument);
    const restore = swapFunctions.saveFocus();

    // Compare aside panel config between current and incoming pages
    const currentCanvas = currentSidebar.querySelector(':scope > div > n-app-canvas');
    const newCanvas = newSidebar.querySelector(':scope > div > n-app-canvas');
    const currentAsides = currentCanvas?.querySelectorAll(':scope > [aside]').length ?? 0;
    const newAsides = newCanvas?.querySelectorAll(':scope > [aside]').length ?? 0;

    if (currentAsides !== newAsides && currentCanvas && newCanvas) {
      // Panel config changed — swap entire canvas so panels appear/disappear
      currentCanvas.replaceWith(document.adoptNode(newCanvas));
    } else {
      // Same panel structure — swap only the main content panel
      const currentPanel = currentCanvas?.querySelector('n-app-panel:not([aside])');
      const newPanel = newCanvas?.querySelector('n-app-panel:not([aside])');
      if (currentPanel && newPanel) {
        currentPanel.replaceWith(document.adoptNode(newPanel));
      }
    }

    // Swap breadcrumb trailing buttons (panel toggles may differ)
    const currentTrailing = currentSidebar.querySelector('n-app-breadcrumb [slot="trailing"]');
    const newTrailing = newSidebar.querySelector('n-app-breadcrumb [slot="trailing"]');
    if (currentTrailing && newTrailing) {
      currentTrailing.replaceWith(document.adoptNode(newTrailing));
    }

    // Swap breadcrumb text
    const currentBreadcrumb = currentSidebar.querySelector('n-app-breadcrumb n-breadcrumb');
    const newBreadcrumb = newSidebar.querySelector('n-app-breadcrumb n-breadcrumb');
    if (currentBreadcrumb && newBreadcrumb) {
      currentBreadcrumb.replaceWith(document.adoptNode(newBreadcrumb));
    }

    // Update nav active item + aria-current
    const nav = currentSidebar.querySelector('n-sidebar-nav');
    const newNav = newSidebar.querySelector('n-sidebar-nav');
    if (nav && newNav) {
      const newValue = newNav.getAttribute('value');
      if (newValue) {
        nav.setAttribute('value', newValue);
        for (const item of nav.querySelectorAll('n-sidebar-nav-item[aria-current]')) {
          item.removeAttribute('aria-current');
        }
        nav.querySelector(`n-sidebar-nav-item[value="${CSS.escape(newValue)}"]`)
          ?.setAttribute('aria-current', 'page');
      }
    }

    restore();
  };
}) as EventListener);

// ── Sidebar wiring — runs once per sidebar DOM instance ──

let wiredLayout: HTMLElement | null = null;

function wireSidebar(layout: HTMLElement) {

  // ── Sidebar collapse toggle ──

  const sidebarToggle = document.getElementById('sidebar-toggle');
  sidebarToggle?.addEventListener('click', () => {
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

  const themeToggle = document.getElementById('theme-toggle');

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

  // ── Code toggle (click handler — visibility set per-page in setupPage) ──

  const codeToggle = document.getElementById('code-toggle');

  codeToggle?.addEventListener('click', () => {
    const willShow = localStorage.getItem(PREF_SHOW_CODE) !== 'true';
    localStorage.setItem(PREF_SHOW_CODE, String(willShow));
    setCookie(PREF_SHOW_CODE, String(willShow));
    const icon = codeToggle.querySelector('n-icon');
    if (icon) {
      if (willShow) icon.setAttribute('weight', 'fill');
      else icon.removeAttribute('weight');
    }
    for (const block of document.querySelectorAll('.layout-code')) {
      if (willShow) block.setAttribute('visible', '');
      else block.removeAttribute('visible');
    }
  });

  // ── Nav group state persistence (write-only for SSR cookies) ──
  // The sidebar DOM persists across navigations, so we never need to read
  // and reapply group states — groups stay open/closed as the user left them.
  // We only observe mutations to keep cookies in sync for the next hard load.

  function observeGroups() {
    for (const group of layout.querySelectorAll('n-sidebar-group')) {
      new MutationObserver(() => {
        const states: Record<string, boolean> = {};
        for (const g of layout.querySelectorAll('n-sidebar-group')) {
          const h = g.querySelector('n-sidebar-group-header');
          const n = h?.textContent?.trim();
          if (n) states[n] = g.hasAttribute('open');
        }
        const json = JSON.stringify(states);
        localStorage.setItem(PREF_GROUP_STATES, json);
        setCookie(PREF_GROUP_STATES, json);
      }).observe(group, { attributes: true, attributeFilter: ['open'] });
    }
  }

  if (customElements.get('n-sidebar-group')) {
    observeGroups();
  } else {
    customElements.whenDefined('n-sidebar-group').then(observeGroups);
  }

  // ── Nav item navigation ──

  const nav = layout.querySelector('n-sidebar-content n-sidebar-nav');
  nav?.addEventListener('native:change', ((e: CustomEvent) => {
    navigate(e.detail.value);
  }) as EventListener);

  // ── Command palette ──

  const dialog = document.getElementById('nav-cmd-dialog') as HTMLElement & { showModal(): void; close(): void; open: boolean } | null;
  const searchBtn = document.getElementById('nav-search-btn');

  searchBtn?.addEventListener('click', () => dialog?.showModal());

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
    navigate(e.detail.value);
  }) as EventListener);
}

// ── Panel toggle wiring ──
// Panels can change between navigations (pages opt in via `panels` prop),
// so we wire per-page but track wired elements to avoid duplicate listeners.

const wiredPanels = new WeakSet<HTMLElement>();

function wireToggle(btnId: string, panelId: string) {
  const btn = document.getElementById(btnId);
  const panel = document.getElementById(panelId);
  if (!panel || wiredPanels.has(panel)) return;
  wiredPanels.add(panel);
  btn?.addEventListener('click', () => panel.toggleAttribute('open'));
  new MutationObserver(() => {
    const icon = btn?.querySelector('n-icon');
    if (!icon) return;
    if (panel.hasAttribute('open')) icon.setAttribute('weight', 'fill');
    else icon.removeAttribute('weight');
  }).observe(panel, { attributes: true, attributeFilter: ['open'] });
}

// ── Per-page setup (runs on initial load + every client-side navigation) ──

function setupPage() {
  const layout = document.getElementById('layout-sidebar') as HTMLElement | null;

  // Wire sidebar once per DOM instance (skipped when sidebar persists)
  if (layout && layout !== wiredLayout) {
    wiredLayout = layout;
    wireSidebar(layout);
  }

  // ── Panel toggles (per-page: panels may differ between pages) ──

  wireToggle('inspector-toggle', 'inspector-panel');
  wireToggle('chat-toggle', 'chat-panel');

  // ── Code toggle visibility (per-page: depends on page content) ──

  const codeToggle = document.getElementById('code-toggle') as HTMLElement | null;
  if (codeToggle) {
    const hasCode = document.querySelectorAll('.layout-code').length > 0;
    codeToggle.style.display = hasCode ? '' : 'none';
    if (hasCode && localStorage.getItem(PREF_SHOW_CODE) === 'true') {
      for (const block of document.querySelectorAll('.layout-code')) {
        block.setAttribute('visible', '');
      }
      const icon = codeToggle.querySelector('n-icon');
      if (icon) icon.setAttribute('weight', 'fill');
    }
  }

  // ── Copy buttons (per-page: new content has new buttons) ──

  for (const btn of document.querySelectorAll('.copy-btn')) {
    btn.addEventListener('click', async () => {
      const code = btn.closest('.layout-code')?.querySelector('code');
      if (!code) return;
      await navigator.clipboard.writeText(code.textContent ?? '');
      const icon = btn.querySelector('n-icon');
      if (icon) {
        icon.setAttribute('name', 'check');
        setTimeout(() => icon.setAttribute('name', 'copy'), 1500);
      }
    });
  }
}

// Fire on initial load + every client-side navigation
document.addEventListener('astro:page-load', setupPage);
