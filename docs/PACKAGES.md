# Packages

Concise reference for the @nonoun package ecosystem used by native-host. Written for coding agents.

## Overview

native-host depends on 7 @nonoun packages. All are light DOM web component libraries (no shadow DOM). CSS is never bundled with JS and must be loaded separately via `@import` in `<style is:global>` blocks.

## Package Reference

| Package | Version | HTML Tags | JS Registration | CSS Import | Role |
|---------|---------|-----------|-----------------|------------|------|
| @nonoun/native-ui | 0.6.0 | `n-*` (n-button, n-dialog, n-icon, etc.) | `import '@nonoun/native-ui/register'` | `@import '@nonoun/native-ui/css/foundation'` + `@import '@nonoun/native-ui/css/components'` | Core component library |
| @nonoun/native-app | 0.3.0 | n-sidebar, n-sidebar-nav, n-sidebar-nav-item, n-sidebar-group, n-sidebar-group-header, n-sidebar-item, n-sidebar-header, n-sidebar-content, n-sidebar-footer (CSS-only: n-app-breadcrumb, n-app-canvas) | `import '@nonoun/native-app'` | `@import '@nonoun/native-app/css'` | Layout, sidebar, nav |
| @nonoun/native-tokens | 0.5.0 | native-tokens, native-tokens-* | `import '@nonoun/native-tokens'` | `@import '@nonoun/native-tokens/css'` | Inspector widget |
| @nonoun/native-chat | 0.1.1 | n-chat, n-chat-* | `import '@nonoun/native-chat/register'` | `@import '@nonoun/native-chat/css'` | Chat panel |
| @nonoun/native-editor | 0.2.4 | native-editor | `import '@nonoun/native-editor/register'` | -- | Markdown editor (CodeMirror) |
| @nonoun/native-playground | 0.2.4 | native-playground | `import '@nonoun/native-playground/register'` | -- | Live code sandbox |
| @nonoun/native-codemirror | 0.2.5 | native-codemirror | `import '@nonoun/native-codemirror/register'` | `@import '@nonoun/native-codemirror/css'` | CodeMirror element + utilities |

Dev dependency: `@phosphor-icons/core` (icon SVG source, not shipped to client).

## Tag Naming Convention

Two naming schemes:

- **Short `n-*` prefix** -- used by native-ui, native-app, and native-chat. Examples: `n-button`, `n-sidebar`, `n-chat`.
- **Full package name prefix** -- used by native-tokens, native-editor, native-playground, native-codemirror. Examples: `<native-tokens>`, `<native-editor>`, `<native-playground>`, `<native-codemirror>`.

Do NOT mix these up. `n-tokens` and `n-editor` are wrong.

## Registration Order

Registration happens in `src/scripts/setup.ts`, loaded via `BaseLayout.astro`.

```ts
// src/scripts/setup.ts
import '@nonoun/native-ui/register';
import '@nonoun/native-app';
import '@nonoun/native-chat/register';
import { registerAllTraits } from '@nonoun/native-ui';

registerAllTraits();

// n-app-panel: CSS-driven layout panel. native-app 0.3.0 removed the JS class
// but kept the CSS. Register a minimal element so :not(:defined) doesn't hide it
// and layout.ts can call .toggle().
if (!customElements.get('n-app-panel')) {
  customElements.define('n-app-panel', class extends HTMLElement {
    get open() { return this.hasAttribute('open'); }
    set open(v: boolean) { this.toggleAttribute('open', v); }
    toggle() { this.open = !this.open; }
  });
}
```

**n-app-panel special case**: native-app 0.3.0 removed the JS class but kept the CSS. The host registers a minimal stub so `:not(:defined)` selectors don't hide it and `layout.ts` can call `.toggle()`, `.open`.

native-tokens, native-editor, native-playground, and native-codemirror are NOT registered in setup.ts. They are imported on specific pages that use them.

## CSS Loading

All CSS is loaded in layouts via `<style is:global>` with `@import`. Never use `<link>` tags for npm packages -- Vite cannot resolve bare specifiers in link tags.

**BaseLayout.astro** loads the foundation CSS for every page:

```css
/* src/layouts/BaseLayout.astro */
@import '@nonoun/native-ui/css/foundation';
@import '@nonoun/native-ui/css/components';
@import '@nonoun/native-app/css';
@import '@nonoun/native-chat/css';
```

**SidebarLayout.astro** adds the inspector CSS:

```css
/* src/layouts/SidebarLayout.astro */
@import '@nonoun/native-tokens/css';
```

native-editor, native-playground, and native-codemirror have no separate CSS imports.

## Icon System

121 Phosphor icons are registered in `src/scripts/icons.ts` using `registerIcon()` from native-ui. Icons are inlined at build time via Vite's `?raw` import.

Two weight categories:
- **Regular weight** -- 116 icons
- **Fill weight** -- 5 icons (chat-dots-fill, code-fill, dots-three-outline-fill, sidebar-simple-fill, sliders-horizontal-fill)

### Pattern for adding a new icon

1. Import the SVG with `?raw`:

```ts
// Regular weight
import myIcon from '@phosphor-icons/core/assets/regular/my-icon.svg?raw';

// Fill weight
import myIconFill from '@phosphor-icons/core/assets/fill/my-icon-fill.svg?raw';
```

2. Add to the `icons` object:

```ts
const icons: Record<string, string> = {
  // ... existing entries
  'my-icon': myIcon,
  'my-icon-fill': myIconFill,  // fill variant
};
```

3. The loop at the bottom registers all icons automatically:

```ts
for (const [name, svg] of Object.entries(icons)) {
  registerIcon(name, svg);
}
```

Use in HTML: `<n-icon name="my-icon"></n-icon>`. For fill variant: `<n-icon name="my-icon-fill"></n-icon>` or `<n-icon name="my-icon" weight="fill"></n-icon>`.

## Key Files

| File | Purpose |
|------|---------|
| `src/scripts/setup.ts` | Registers native-ui, native-app, native-chat, traits, and the n-app-panel stub |
| `src/scripts/icons.ts` | Registers 121 Phosphor icons via `registerIcon()` with `?raw` SVG imports |
| `src/layouts/BaseLayout.astro` | HTML shell -- loads foundation + component + app + chat CSS, runs setup.ts and icons.ts |
| `src/layouts/SidebarLayout.astro` | Wraps BaseLayout -- adds native-tokens CSS, sidebar nav, inspector panel, chat panel |
| `package.json` | All @nonoun packages listed under `dependencies`; @phosphor-icons/core under `devDependencies` |

## See Also

For native-ui component API, traits, events, and CSS tokens, see the native-ui repository's own `PACKAGES.md`.
