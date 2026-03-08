# Architecture

Astro SSR documentation site and application shell for the `@nonoun/native-ui` web component library, deployed to Vercel.

## Overview

~100-page Astro site (`output: 'server'`, `@astrojs/vercel`). Every page is a standalone `.astro` file with its own markup, scripts, and styles. Two layout layers (BaseLayout, SidebarLayout) provide the app shell. Page discovery is automatic via `import.meta.glob`, and View Transitions (`<ClientRouter />`) enable SPA-style navigation with a custom swap that preserves the sidebar DOM across page loads.

| Metric | Value |
|---|---|
| Total `.astro` pages | ~102 |
| Sitemap entries (nav) | ~98 (index excluded) |
| Page groups | Components (31), Containers (9), Traits (22), Blocks (22), Core (1), Packages (3), Other (6+) |
| Registered Phosphor icons | 121 |

## Layout Hierarchy

```
BaseLayout.astro
  <html lang="en" style="color-scheme: {pref}">
    <head>
      <title>{title} -- native-ui</title>
      <ClientRouter />                         ← View Transitions
      <style is:global>
        @import 'native-ui/css/foundation'
        @import 'native-ui/css/components'
        @import 'native-app/css'
        @import 'native-chat/css'
      </style>
    </head>
    <body>
      <script>
        import 'icons.ts'                      ← 114 Phosphor icons (once)
        import 'setup.ts'                      ← component registration (once)
      </script>
      <slot />                                 ← SidebarLayout or standalone content
    </body>

SidebarLayout.astro (wraps BaseLayout)
  <BaseLayout title={title}>
    <style is:global>
      @import 'layout.css'                     ← app chrome styles
      @import 'layout-blocks.css'              ← doc layout utilities
      @import 'native-tokens/css'              ← inspector panel styles
    </style>

    <native-app id="layout-sidebar" collapsed={pref}>
      <aside slot="sidebar" transition:animate="none">
        <n-sidebar-header>
          ├─ Logo + team switcher (n-listbox popover)
          └─ Search button (opens command palette)
        <n-sidebar-content>
          <n-sidebar-nav value={currentPath}>
            ├─ n-sidebar-group "Components"
            ├─ n-sidebar-group "Containers"
            ├─ n-sidebar-group "Traits"
            ├─ n-sidebar-group "Blocks"
            ├─ n-sidebar-group "Core"
            ├─ n-sidebar-group "Packages"
            └─ n-sidebar-group "Other"
        <n-sidebar-footer>
          └─ User menu (n-listbox popover)
      </aside>

      <div>                                    ← main area
        <n-app-breadcrumb>
          [leading]  sidebar toggle button
          [center]   n-breadcrumb: {group} > {title}
          [trailing] inspector toggle, chat toggle,
                     code toggle, theme toggle

        <n-app-canvas>
          <n-app-panel>                        ← main content (<slot />)
          <native-tokens-panel aside>          ← inspector
          <native-chat-panel aside>            ← chat
    </native-app>

    <n-dialog id="nav-cmd-dialog">             ← command palette (Cmd+K)
      <n-command> with sitemap as n-command-items

    <script> import 'layout.ts' </script>      ← shell interactivity (once)
  </BaseLayout>
```

**SidebarLayout props:**
- `title: string` -- page title (shown in `<title>` and breadcrumb)
- `panels?: ('inspector' | 'chat')[]` -- default `['inspector', 'chat']`. Pass `[]` to hide both (block pages).

## Page Anatomy

Three patterns.

### Pattern 1: Component demo page (~65 pages)

SidebarLayout with default panels. Content in `<main>` using `.layout-*` classes.

```astro
---
import SidebarLayout from '../../layouts/SidebarLayout.astro';
---
<SidebarLayout title="Button">
  <main>
    <h1>&lt;n-button&gt;</h1>
    <p style="color: var(--n-ink-muted-neutral); font-size: 0.875rem; margin-bottom: 1.5rem;">
      One-line component description.
    </p>

    <h2>Section Title</h2>
    <div class="layout-section">
      <h3>Subsection</h3>
      <div class="layout-row">
        <!-- live demo elements -->
      </div>
      <pre class="code-block"><code><!-- escaped HTML --></code>
        <n-button class="copy-btn" size="sm" variant="ghost" aria-label="Copy">
          <n-icon name="copy"></n-icon>
        </n-button>
      </pre>
    </div>
  </main>

  <script>
    document.addEventListener('astro:page-load', () => {
      if (!document.getElementById('unique-guard-id')) return;
      // page-specific interactivity
    });
  </script>

  <style is:global>
    /* page-specific styles */
  </style>
</SidebarLayout>
```

Rules:
- `<style is:global>` is mandatory for styles targeting `n-*` / `native-*` elements
- Scripts must wrap in `astro:page-load` with a guard element ID check
- Heading hierarchy: `h1` (page), `h2` (section), `h3` (subsection)
- Layout classes: `.layout-section`, `.layout-row`, `.label`, `.code-block`, `.grid`, `.layout-col`, `.box`, `.card`, `.hint`, `.log`

### Pattern 2: Block page (~22 pages)

Full-page demos. SidebarLayout with `panels={[]}` for full width.

```astro
<SidebarLayout title="Auth Login" panels={[]}>
```

### Pattern 3: Auth page (login, register)

Bypasses the sidebar. Uses BaseLayout directly. Wires forms to `authClient` methods.

```astro
<BaseLayout title="Log In">
  <style is:global>@import '../styles/layout.css';</style>
  <!-- centered card with auth form -->
  <script>
    import { authClient } from '../lib/auth-client';
    // Wire form to authClient.signIn.email() / signIn.social()
  </script>
</BaseLayout>
```

### Pattern 4: Account page (settings)

SidebarLayout with `panels={[]}`. Requires authentication — redirects to `/auth/login` if anonymous.

```astro
---
if (!Astro.locals.user) return Astro.redirect('/auth/login');
---
<SidebarLayout title="Account Settings" panels={[]}>
  <!-- profile, password, danger zone sections -->
</SidebarLayout>
```

## Script System

Four layers, each with a distinct lifecycle.

### setup.ts -- Component registration (runs once)

Loaded by BaseLayout. Registers all custom elements:

- `import '@nonoun/native-ui/register'` -- all `n-*` components
- `import '@nonoun/native-dashboard'` -- sidebar/nav elements
- `import '@nonoun/native-ai/register'` -- chat components
- `registerAllTraits()` -- Pressable, Focusable, etc.
- Defines a minimal `n-app-panel` stub (CSS-driven element removed from native-app 0.3.0 JS, but CSS still targets it)

### icons.ts -- Icon registration (runs once)

Registers 121 Phosphor icons via `registerIcon()` with `?raw` SVG imports (Vite inlines at build time). Both regular and fill variants are imported for icons that use `weight="fill"`.

### layout.ts -- Shell interactivity (runs once via ClientRouter)

Loaded by SidebarLayout. Persists across navigations.

**Document-level (once):**
- Cmd+K / Ctrl+K keyboard shortcut for command palette
- `astro:before-swap` custom swap handler (see View Transitions)
- `@nonoun/native-design` import

**Per-sidebar-instance (`wireSidebar`, once per DOM instance):**
- Sidebar collapse/expand (writes localStorage + cookie)
- Theme toggle light/dark (writes localStorage + cookie)
- Code toggle: show/hide `.code-block` blocks
- Nav group open/close persistence (MutationObserver on `n-sidebar-group[open]`)
- Nav item navigation via `native:change` event
- Command palette open/close and selection

**Per-page (`setupPage`, every `astro:page-load`):**
- Wire inspector/chat panel toggles (WeakSet tracks wired panels)
- Show/hide code toggle based on `.code-block` presence
- Wire copy-to-clipboard buttons

**Auth-aware features:**
- Debounced preference sync to `/api/preferences` when `data-authenticated` attribute is present
- Sign-out handler calls `authClient.signOut()` then redirects to `/`

### Per-page `<script>` -- Page-specific interactivity

Must use the guard pattern because `astro:page-load` fires on every navigation but the module stays loaded:

```ts
document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('unique-element-id')) return;
  // ... page-specific wiring
});
```

## View Transitions

Custom `astro:before-swap` in `layout.ts` optimizes sidebar-to-sidebar navigations:

1. Head, root attributes, and scripts swap normally
2. If aside panel config changed (different `panels` prop), the entire `<n-app-canvas>` is replaced
3. If same panel config, only the main `<n-app-panel>` content is swapped
4. Breadcrumb text and trailing buttons are swapped
5. Nav active item (`value` + `aria-current`) is updated
6. Sidebar DOM (groups, scroll position, open/closed states) is preserved

For sidebar-to-standalone transitions, falls through to Astro's default full-body swap.

## Data Flow

### pages.ts -- Sitemap

`src/data/pages.ts` is the single source of truth for nav, breadcrumbs, and command palette.

```
import.meta.glob('/src/pages/**/*.astro')
  -> filter out /index
  -> parse directory -> group (dirGroup map)
  -> parse filename -> title (slugToTitle + titleOverrides)
  -> sort by groupOrder, then alphabetically
  -> export sitemap: PageEntry[]
```

**PageEntry:** `{ title: string, path: string, group: string }`

**Title derivation:**
- Components/Containers: strip `ui-` prefix, Title Case (`ui-button` -> `Button`)
- Traits: PascalCase (`roving-focusable` -> `RovingFocusable`)
- Blocks/Other: Title Case (`auth-login` -> `Auth Login`)
- Special cases in `titleOverrides` map (`ui-input-otp` -> `Input OTP`, `native-editor` -> `Editor`, etc.)

**Group order:** Components, Containers, Traits, Blocks, Core, Packages, Other

**Consumers:** SidebarLayout (nav groups), command palette (search), breadcrumb (current page)

### Preference persistence

Triple-layer strategy for flash-free SSR with auth sync:

1. **Client writes** `localStorage` + cookies (via `setCookie()` in `layout.ts`) — immediate, works for anonymous
2. **Authenticated sync** debounced POST to `/api/preferences` (via `syncPreferences()` in `layout.ts`)
3. **Server reads** `loadPreferences(locals, cookies)` — DB for authenticated, cookies for anonymous
4. **CDN** authenticated → `private, no-cache`; anonymous → `s-maxage=3600` + `Vary: Cookie`

| Key | Default |
|---|---|
| `nav-color-scheme` | `''` (system) |
| `nav-sidebar-collapsed` | `'false'` |
| `nav-group-states` | `{ Components: true }` |
| `demo-show-code` | `'false'` |

## Key Files

| File | Purpose |
|---|---|
| `src/layouts/BaseLayout.astro` | HTML shell, CSS imports, script imports, `<ClientRouter />` |
| `src/layouts/SidebarLayout.astro` | Sidebar nav, breadcrumb, panels, command palette -- wraps BaseLayout |
| `src/scripts/setup.ts` | Component registration (native-ui, native-app, native-chat, traits, n-app-panel stub) |
| `src/scripts/icons.ts` | Phosphor icon registration (121 icons via `?raw` SVG imports) |
| `src/scripts/layout.ts` | Shell interactivity: sidebar, theme, Cmd+K, panels, code toggle, copy, custom swap |
| `src/data/pages.ts` | Page auto-discovery via `import.meta.glob`, builds `sitemap: PageEntry[]` |
| `src/lib/auth.ts` | better-auth server config (Drizzle adapter, providers) |
| `src/lib/auth-client.ts` | Client-side auth helper (`createAuthClient()`) |
| `src/lib/preferences.ts` | Cookie keys, `parsePreferences()`, `loadPreferences()` (DB + cookie) |
| `src/middleware.ts` | Session resolution + conditional CDN caching |
| `src/pages/api/auth/[...all].ts` | better-auth catch-all API route |
| `src/pages/api/preferences.ts` | User preferences CRUD (GET/POST, authenticated only) |
| `src/env.d.ts` | `App.Locals` types (user, session) + env var types |
| `src/components/Logo.astro` | NativeUI logo SVG with `size` prop |
| `src/styles/layout.css` | App chrome styles |
| `src/styles/layout-blocks.css` | Doc layout utilities (`.layout-*`) scoped under `n-app-panel` |
| `src/scripts/event-log.ts` | Shared `logPrepend`/`logAppend` for demo event logging |

## See Also

- `CLAUDE.md` -- Project rules and quick reference (root)
- `docs/PACKAGES.md` -- Package versions, namespaces, and import patterns
- `docs/RULES.md` -- CSS and component authoring rules
- `docs/DATABASE.md` -- Turso database, Drizzle ORM, schema, migrations
- `TICKETS/TICKET-AGENT.md` -- Cross-project ticket index
