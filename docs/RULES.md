# Rules and Gotchas

Concise reference for coding agents working on the native-host Astro project. Read this before writing or modifying any page.

## Hard Rules

These are non-negotiable. Violating any of them will break the build or the UI.

1. **All `<style>` targeting `n-*`/`native-*` MUST use `is:global`** -- Astro scoped styles add `[data-astro-cid-xxx]` attributes that break custom element selectors.

2. **Never import component classes on the server** -- they extend `HTMLElement` which does not exist in Node.js. Keep component imports inside `<script>` blocks (client-side only).

3. **Do not wrap `n-*`/`native-*` in Astro components** -- use the custom elements directly in templates.

4. **CSS is NOT bundled with JS** -- components are light DOM. Always load CSS separately via `@import`.

5. **Scope bare element selectors** -- `main`, `h1`-`h3`, etc. must be scoped to `n-app-panel` to avoid leaking into sidebar, breadcrumb, and dialog chrome.

6. **Use `:where()` for low-specificity overrides** -- follow the library's CSS pattern.

7. **Do NOT write JS/CSS workarounds for component bugs** -- file a ticket in `/TICKETS/` instead and let native-ui fix it.

8. **Never style `n-*`/`native-*` elements with raw CSS** -- use the component's attribute API (`size`, `variant`, `intent`, `muted`, `spacing`, `bordered`, etc.) exclusively. Never apply `style=""`, `padding`, `margin`, `color`, `width`, `max-width`, `flex`, `font-size`, or any other raw CSS property directly on a native-ui element. If you need a layout constraint (e.g. `max-width`, `flex: 1`), wrap the component in a plain `<div>` or use a container like `<n-stack>`.

## CSS Gotchas

**Use `@import`, never `<link>`, for npm packages.** Vite does not resolve bare specifiers in `<link>` tags.

```astro
<!-- Correct -->
<style is:global>
  @import '@nonoun/native-ui/css/foundation';
</style>

<!-- Wrong -- won't resolve -->
<link rel="stylesheet" href="@nonoun/native-ui/css/foundation" />
```

**Astro boolean attributes render as `="true"`.** Custom elements may expect an empty string.

```astro
<!-- Correct: renders as <n-sidebar-group open> -->
<n-sidebar-group open={isOpen ? '' : undefined}>

<!-- Wrong: renders as <n-sidebar-group open="true"> -->
<n-sidebar-group open={isOpen}>
```

**Curly braces in `<code>` blocks need HTML entities.** Astro interprets `{`/`}` as JSX expressions. Use `&#123;` and `&#125;`.

**`n-body` inside `n-card` without headers/footers creates double padding.** Only use `<n-body>` when the card also has `<n-header>` or `<n-footer>`.

**`CollapsibleController` needs consumer CSS.** It sets a `[collapsed]` attribute after animation ends but removes inline styles. Without CSS, content pops back to visible:

```css
my-element[collapsed] { height: 0; overflow: clip; }
```

## Script Gotchas

**Module scripts execute once** (View Transitions). Page-specific DOM code must be inside an `astro:page-load` handler. Guard with an early return on a unique element ID:

```js
import { logPrepend } from '../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const el = document.getElementById('unique-page-element');
  if (!el) return;
  // DOM code here
});
```

- Imports go OUTSIDE the event listener.
- DOM code goes INSIDE the event listener.

**Controllers and classes must be explicitly imported** -- no implicit globals:

```js
import { NativeElement, define, FocusTrapController } from '@nonoun/native-ui';
```

**Avoid TypeScript in `<script>` blocks.** esbuild may parse them as JS, causing errors for `as any`, `e: Event`, etc. Use plain JavaScript.

## Build Gotchas

**Clear the Vite dep cache after bulk dependency changes.** `rm -rf node_modules/.vite` then restart the dev server. May also need `Cmd+Shift+R` in the browser.

**`import.meta.glob` with `?raw` bundles everything.** Use static `import ... from '...svg?raw'` for selective loading -- only referenced files end up in the bundle.

## Tickets

Cross-project tickets for `@nonoun/native-ui` bugs live in `/TICKETS/`.

- **Index:** `TICKET-AGENT.md` (read this at session start)
- **Resolution log:** `TICKET-LOG.md`
- **Individual tickets:** `T{number}-{slug}.md`

To file a new ticket: create `T{next}-{slug}.md` and add a row to `TICKET-AGENT.md`.

## Key Files

| File | Purpose |
|---|---|
| `src/layouts/BaseLayout.astro` | HTML shell, loads foundation + component CSS, registers all custom elements |
| `src/layouts/SidebarLayout.astro` | Sidebar nav, breadcrumb, inspector/chat panels, command palette |
| `src/scripts/layout.ts` | Client-side interactivity (sidebar toggle, theme, Cmd+K, code toggle) |
| `src/scripts/setup.ts` | Component + trait registration |
| `src/scripts/icons.ts` | Phosphor icon registration (static `?raw` imports) |
| `src/data/pages.ts` | Auto-discovers `.astro` pages via `import.meta.glob` for nav |
| `src/styles/layout.css` | App-specific sidebar/chrome styles |
| `src/styles/layout-blocks.css` | Documentation layout utilities (`.layout-section`, `.layout-row`, etc.) |
| `src/lib/preferences.ts` | Cookie parsing for SSR preference persistence |

## See Also

- `CLAUDE.md` -- project entry point and quick reference
- `docs/ARCHITECTURE.md` -- layout hierarchy, script system, data flow
- `docs/CSS.md` -- CSS loading order and design tokens
