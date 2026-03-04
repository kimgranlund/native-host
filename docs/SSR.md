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

SSR serves two purposes: **authentication** (session validation via `better-auth`) and **preference persistence** (reading cookies/DB to render correct theme, sidebar state, nav groups on first byte). Without SSR, the client would have to read `localStorage` after hydration and patch the DOM, causing visible flicker.

## Authentication

Session validation is handled by `better-auth` in the middleware. See `DATABASE.md` for schema details.

### Middleware session resolution

The middleware (`src/middleware.ts`) resolves the user session on every request before any page renders:

```typescript
// Simplified — see src/middleware.ts for full implementation
const session = await auth.api.getSession({ headers: context.request.headers });
context.locals.user = session?.user ?? null;
context.locals.session = session?.session ?? null;
```

`Astro.locals.user` and `Astro.locals.session` are available in all page frontmatter and API routes.

### Auth pages

| Page | Layout | Purpose |
|---|---|---|
| `/auth/login` | BaseLayout | Email/password + Google OAuth sign-in |
| `/auth/register` | BaseLayout | Registration form + Google OAuth |
| `/account/settings` | SidebarLayout | Profile, password change, account deletion |
| `/` (index) | BaseLayout | Landing with Google/email/Skip buttons |

Auth pages redirect authenticated users away. `/account/settings` redirects unauthenticated users to `/auth/login`.

### API routes

| Route | Purpose |
|---|---|
| `/api/auth/[...all]` | Catch-all for better-auth endpoints (sign-in, sign-up, callback, etc.) |
| `/api/preferences` | GET/POST user preferences (authenticated only) |

## Preference Persistence

### Server side

`SidebarLayout.astro` calls `loadPreferences(Astro.locals, Astro.cookies)` which uses two sources:

- **Authenticated users**: query `userPreferences` DB table, fall back to cookies if no row exists
- **Anonymous users**: `parsePreferences(Astro.cookies)` — cookie-only (unchanged behavior)

```typescript
// src/lib/preferences.ts — key exports

export function parsePreferences(cookies): Preferences;       // cookie-only
export async function loadPreferences(locals, cookies): Preferences; // DB + cookie fallback
```

The returned values drive server-rendered attributes:

| Key | Controls |
|---|---|
| `nav-color-scheme` | `<html style="color-scheme: dark\|light">` |
| `nav-sidebar-collapsed` | `<native-app collapsed>` attribute |
| `nav-group-states` | `<n-sidebar-group open>` per group |
| `demo-show-code` | Code block visibility on page load |

### Client side

Every preference change **dual-writes** to both `localStorage` and a cookie (immediate SSR + anonymous fallback). For authenticated users, changes are also synced to the server:

```typescript
// src/scripts/layout.ts

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;expires=${expires};SameSite=Lax`;
}

// Authenticated sync — debounced POST to /api/preferences (500ms)
function syncPreferences() { ... }
```

Cookie configuration: 365-day expiry, `SameSite=Lax`, `path=/`.

**Preference migration on first login**: when a user logs in and has no `userPreferences` row, the POST handler seeds from current cookie values.

## CDN Caching

The middleware sets caching headers based on authentication state:

- **Authenticated requests**: `Cache-Control: private, no-cache` — forces re-validation on every request (session-dependent content)
- **Anonymous requests**: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` + `Vary: Cookie` — CDN caches for 1 hour, serves stale for up to 24 hours while revalidating

The `Vary: Cookie` header ensures each unique cookie combination gets its own cache entry, so different preference permutations are cached separately.

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
| `src/lib/auth.ts` | better-auth server config (Drizzle adapter, providers, session caching) |
| `src/lib/auth-client.ts` | Client-side auth helper (`createAuthClient()`) |
| `src/lib/preferences.ts` | Cookie keys, `parsePreferences()`, `loadPreferences()` (DB + cookie) |
| `src/middleware.ts` | Session resolution + conditional CDN caching |
| `src/pages/api/auth/[...all].ts` | better-auth catch-all API route |
| `src/pages/api/preferences.ts` | User preferences CRUD (GET/POST) |
| `src/scripts/layout.ts` | Custom swap, sidebar, preference dual-write + auth sync, sign-out |
| `src/layouts/BaseLayout.astro` | `<ClientRouter />`, SSR preference reading, HTML shell |
| `src/layouts/SidebarLayout.astro` | SSR preferences, auth-aware sidebar footer, panel layout |
| `src/env.d.ts` | `App.Locals` types (user, session) + env var types |
| `astro.config.mjs` | `output: 'server'` + `@astrojs/vercel` adapter |

## See Also

- `docs/ARCHITECTURE.md` -- project structure and layout patterns
- `docs/PANELS.md` -- inspector and chat panel configuration
