# Packages

Concise reference for the @nonoun package ecosystem used by native-host. Written for coding agents.

## Overview

native-host depends on 7 @nonoun packages. All are light DOM web component libraries (no shadow DOM). CSS is never bundled with JS and must be loaded separately via `@import` in `<style is:global>` blocks.

## Package Reference

| Package | Version | HTML Tags | JS Registration | CSS Import | Role |
|---------|---------|-----------|-----------------|------------|------|
| @nonoun/native-ui | 0.7.115 | `n-*` (n-button, n-dialog, n-icon, etc.) | `import '@nonoun/native-ui/register'` | `@import '@nonoun/native-ui/css/foundation'` + `@import '@nonoun/native-ui/css/components'` | Core component library |
| @nonoun/native-dashboard | 0.4.21 | native-app, n-sidebar-nav, n-sidebar-nav-item, n-sidebar-group, n-sidebar-group-header, n-sidebar-item, n-sidebar-header, n-sidebar-content, n-sidebar-footer | `import '@nonoun/native-dashboard'` | `@import '@nonoun/native-dashboard/css'` | Layout, sidebar, nav |
| @nonoun/native-design | 0.6.7 | native-tokens, native-tokens-* | `import '@nonoun/native-design'` | `@import '@nonoun/native-design/css'` | Inspector widget |
| @nonoun/native-ai | 1.0.59 | n-chat, n-chat-* | `import '@nonoun/native-ai/register'` | `@import '@nonoun/native-ai/css'` | Chat + A2UI builder |
| @nonoun/native-code | 1.0.8 | native-editor, native-playground, native-codemirror | `import '@nonoun/native-code/register'` | `@import '@nonoun/native-code/css'` | Editor + playground + CodeMirror |
| @nonoun/native-data-viz | 0.2.5 | n-chart | `import '@nonoun/native-data-viz/register'` | `@import '@nonoun/native-data-viz/css'` | Charts (SVG) |

Dev dependency: `@phosphor-icons/core` (icon SVG source, not shipped to client).

## Tag Naming Convention

Two naming schemes:

- **Short `n-*` prefix** -- used by native-ui, native-dashboard, native-ai, and native-data-viz. Examples: `n-button`, `n-sidebar`, `n-chat`, `n-chart`.
- **Full package name prefix** -- used by native-tokens (design), native-editor, native-playground, native-codemirror (code). Examples: `<native-tokens>`, `<native-editor>`, `<native-playground>`, `<native-codemirror>`.

Do NOT mix these up. `n-tokens` and `n-editor` are wrong.

## Registration Order

Registration happens in `src/scripts/setup.ts`, loaded via `BaseLayout.astro`.

```ts
// src/scripts/setup.ts
import '@nonoun/native-ui/register';
import '@nonoun/native-dashboard';
import '@nonoun/native-ai/register';
import '@nonoun/native-design';
import '@nonoun/native-code/register';
import '@nonoun/native-data-viz/register';
import { registerAllTraits } from '@nonoun/native-ui';

registerAllTraits();
```

All 7 packages are now registered in setup.ts. All traits (29 total) are registered via `registerAllTraits()`.

## CSS Loading

All CSS is loaded in layouts via `<style is:global>` with `@import`. Never use `<link>` tags for npm packages -- Vite cannot resolve bare specifiers in link tags.

**BaseLayout.astro** loads the foundation CSS for every page:

```css
/* src/layouts/BaseLayout.astro */
@import '@nonoun/native-ui/css/foundation';
@import '@nonoun/native-ui/css/components';
@import '@nonoun/native-dashboard/css';
@import '@nonoun/native-ai/css';
```

**SidebarLayout.astro** adds the inspector CSS:

```css
/* src/layouts/SidebarLayout.astro */
@import '@nonoun/native-design/css';
```

native-data-viz CSS is only imported on the chart page. native-code CSS is imported on pages using CodeMirror.

## Icon System

~122 Phosphor icons are registered in `src/scripts/icons.ts` using `registerIcon()` from native-ui. Icons are inlined at build time via Vite's `?raw` import.

Two weight categories:
- **Regular weight** -- ~117 icons
- **Fill weight** -- ~5 icons (chat-dots-fill, code-fill, dots-three-outline-fill, sidebar-simple-fill, sliders-horizontal-fill, play-fill, star-fill)

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
| `src/scripts/setup.ts` | Registers all 7 @nonoun packages + all 29 traits |
| `src/scripts/icons.ts` | Registers ~122 Phosphor icons via `registerIcon()` with `?raw` SVG imports |
| `src/layouts/BaseLayout.astro` | HTML shell -- loads foundation + component + dashboard CSS, runs setup.ts and icons.ts |
| `src/layouts/SidebarLayout.astro` | Wraps BaseLayout -- adds global + chrome + content + demo + ai + design CSS, sidebar nav |
| `package.json` | All @nonoun packages listed under `dependencies`; @phosphor-icons/core under `devDependencies` |

## See Also

For native-ui component API, traits, events, and CSS tokens, see the native-ui repository's own `PACKAGES.md`.
