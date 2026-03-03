# SSR and View Transitions

Astro SSR renders pages on the server so user preferences (theme, sidebar state) are baked into the initial HTML, eliminating flash of incorrect content. View Transitions then handle client-side navigation without full page reloads.

## Overview

The site runs in Astro's `output: 'server'` mode with the `@astrojs/vercel` adapter:

```js
// astro.config.mjs
export default defineConfig({
  output: 'server',
  adapter: vercel(),
});
```

SSR exists primarily for **preference persistence**. The server reads cookies, renders the correct `color-scheme`, sidebar collapsed state, and nav group open/closed states on the very first byte. Without SSR, the client would have to read `localStorage` after hydration and patch the DOM, causing visible flicker.

## Preference Persistence

### Server side

Both `BaseLayout.astro` and `SidebarLayout.astro` call `parsePreferences(Astro.cookies)` in their frontmatter to read user preferences before rendering:

```typescript
// src/lib/preferences.ts

export const PREF_COLOR_SCHEME = 'nav-color-scheme';
export const PREF_SIDEBAR_COLLAPSED = 'nav-sidebar-collapsed';
export const PREF_GROUP_STATES = 'nav-group-states';
export const PREF_SHOW_CODE = 'demo-show-code';

export interface Preferences {
  colorScheme: string;
  sidebarCollapsed: boolean;
  groupStates: Record<string, boolean>;
  showCode: boolean;
}

const DEFAULT_GROUP_STATES: Record<string, boolean> = { Components: true };

export function parsePreferences(cookies: {
  get(name: string): { value: string } | undefined;
}): Preferences {
  const colorScheme = cookies.get(PREF_COLOR_SCHEME)?.value || '';
  const sidebarCollapsed = cookies.get(PREF_SIDEBAR_COLLAPSED)?.value === 'true';

  let groupStates = DEFAULT_GROUP_STATES;
  try {
    const raw = cookies.get(PREF_GROUP_STATES)?.value;
    if (raw) groupStates = JSON.parse(decodeURIComponent(raw));
  } catch { /* use default */ }

  const showCode = cookies.get(PREF_SHOW_CODE)?.value === 'true';

  return { colorScheme, sidebarCollapsed, groupStates, showCode };
}
```

The returned values drive server-rendered attributes:

| Key | Controls |
|---|---|
| `nav-color-scheme` | `<html style="color-scheme: dark\|light">` |
| `nav-sidebar-collapsed` | `<native-app collapsed>` attribute |
| `nav-group-states` | `<n-sidebar-group open>` per group |
| `demo-show-code` | Code block visibility on page load |

### Client side

Every preference change **dual-writes** to both `localStorage` and a cookie. This ensures the server sees the latest value on the next request while the client can also read it synchronously:

```typescript
// src/scripts/layout.ts

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;expires=${expires};SameSite=Lax`;
}

// Example: theme toggle
const next = isDark ? 'light' : 'dark';
document.documentElement.style.colorScheme = next;
localStorage.setItem(PREF_COLOR_SCHEME, next);
setCookie(PREF_COLOR_SCHEME, next);
```

Cookie configuration: 365-day expiry, `SameSite=Lax`, `path=/`.

## CDN Caching

The middleware adds caching headers so Vercel's CDN can serve pre-rendered responses without hitting the origin on every request:

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=86400'
  );
  response.headers.set('Vary', 'Cookie');
  return response;
});
```

- **`s-maxage=3600`** -- CDN considers the response fresh for 1 hour.
- **`stale-while-revalidate=86400`** -- For the next 24 hours after that, the CDN serves the stale response immediately while fetching a fresh one in the background.
- **`Vary: Cookie`** -- Each unique cookie combination (i.e., each preference permutation) gets its own cache entry. A user with `nav-color-scheme=dark` and one with `nav-color-scheme=light` are cached separately.

## View Transitions

`BaseLayout.astro` includes `<ClientRouter />` which enables Astro's client-side navigation:

```astro
---
import { ClientRouter } from 'astro:transitions';
const prefs = parsePreferences(Astro.cookies);
---
<html lang="en" style={prefs.colorScheme ? `color-scheme: ${prefs.colorScheme}` : undefined}>
  <head>
    <ClientRouter />
    ...
  </head>
  ...
</html>
```

### Key behavior

- Module `<script>` blocks execute **once per session**, not on every navigation. Top-level code in `layout.ts`, `setup.ts`, and `icons.ts` runs only on the initial page load.
- Page-specific DOM wiring **must** use the `astro:page-load` event, which fires on initial load AND after every client-side navigation.

## Custom Swap

The default View Transitions swap replaces the entire `<body>`. This would destroy the sidebar's DOM state (scroll position, open/closed groups, wired event listeners). `layout.ts` registers a custom `astro:before-swap` handler that preserves the sidebar:

```typescript
// src/scripts/layout.ts

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
```

### What the custom swap does

1. **Both pages have sidebar** -- preserves the sidebar `<aside>`, swaps only the content panel (`n-app-panel:not([aside])`), breadcrumb text, and breadcrumb trailing buttons. Updates the active nav item via `value` attribute and `aria-current`.
2. **Panel config differs** (e.g., a page with `panels={[]}` navigating to one with `panels={['inspector', 'chat']}`) -- swaps the entire `n-app-canvas` so aside panels appear or disappear correctly.
3. **Sidebar to non-sidebar transition** (e.g., index page to a component page, or vice versa) -- falls through to Astro's default full-body swap since `currentSidebar` or `newSidebar` will be `null`.

## Writing Page Scripts

Every page with client-side interactivity must follow this pattern to work correctly with View Transitions:

```typescript
// In a page's <script> block

// 1. Imports at top level (outside the listener) — run once per session
import { logPrepend } from '../../scripts/event-log';

// 2. astro:page-load wrapper — runs on initial load + every navigation
document.addEventListener('astro:page-load', () => {

  // 3. Guard with early return on a unique element ID
  //    This prevents the handler from running on pages that don't have this content
  const myEl = document.getElementById('my-unique-el');
  if (!myEl) return;

  // 4. Page-specific wiring
  myEl.addEventListener('native:change', (e) => {
    logPrepend('log', `Changed: ${(e as CustomEvent).detail.value}`);
  });
});
```

### Rules

- **Imports go outside** the event listener. Module-level imports execute once; putting them inside `astro:page-load` has no effect since ES modules cache their result.
- **Always guard** with an element ID check. Without the guard, your handler runs on every page in the site.
- **No cleanup needed** for listeners on elements inside the swapped content panel. Those DOM nodes are replaced on navigation, so their listeners are garbage-collected automatically.
- **Do clean up** global listeners (`document`, `window`) or intervals/timeouts if your page creates them, otherwise they accumulate across navigations.

### What NOT to do

```typescript
// WRONG — this runs only once, never again on navigation
const el = document.getElementById('my-el');
el?.addEventListener('click', handler);

// WRONG — missing guard, runs on every page
document.addEventListener('astro:page-load', () => {
  document.querySelectorAll('.my-class').forEach(/* ... */);
});
```

## Key Files

| File | Role |
|---|---|
| `src/lib/preferences.ts` | Shared cookie key names, `Preferences` type, `parsePreferences()` |
| `src/middleware.ts` | CDN caching headers (`Cache-Control`, `Vary: Cookie`) |
| `src/scripts/layout.ts` | Custom swap handler, sidebar wiring, preference dual-write, per-page setup |
| `src/layouts/BaseLayout.astro` | `<ClientRouter />`, SSR preference reading, HTML shell |
| `src/layouts/SidebarLayout.astro` | SSR preference-driven attributes, sidebar nav, panel layout |
| `astro.config.mjs` | `output: 'server'` + `@astrojs/vercel` adapter |

## See Also

- `docs/ARCHITECTURE.md` -- project structure and layout patterns
- `docs/PANELS.md` -- inspector and chat panel configuration
