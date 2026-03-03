# CSS Architecture

How CSS is loaded, layered, and scoped in the native-host Astro project.

## Overview

All styling flows through `<style is:global>` blocks using CSS `@import`. Three layers:

1. **Foundation + component CSS** from npm packages (loaded once in `BaseLayout.astro`)
2. **App chrome + documentation utilities** (loaded once in `SidebarLayout.astro`)
3. **Per-page styles** (inline `<style is:global>` at the bottom of each `.astro` page)

Every `<style>` block targeting `n-*` or `native-*` elements **must** use `is:global`. Astro's scoped styles inject `[data-astro-cid-xxx]` selectors that break custom element matching.

## Loading Order

```
BaseLayout.astro
  @import '@nonoun/native-ui/css/foundation'   -- tokens, reset, base typography
  @import '@nonoun/native-ui/css/components'    -- all n-* component styles
  @import '@nonoun/native-app/css'              -- sidebar, nav, breadcrumb, canvas
  @import '@nonoun/native-chat/css'             -- chat component styles

SidebarLayout.astro
  @import '../styles/layout.css'                -- app chrome (reset, logo, search, command dialog)
    @import './demo.css'                        -- demo page base styles (.demo-* classes)
  @import '../styles/layout-blocks.css'         -- documentation layout utilities (.layout-* classes)
  @import '@nonoun/native-tokens/css'           -- inspector panel styles

Per-page .astro files
  <style is:global>                             -- page-specific demo styles
```

Foundation tokens load first because everything downstream references `--n-*` custom properties.

## Why @import, Never `<link>`

Vite resolves bare specifiers (`@nonoun/...`) inside CSS `@import` within `<style>` blocks. `<link>` tags bypass Vite's resolver and fail for npm package paths.

```astro
<!-- Correct -->
<style is:global>
  @import '@nonoun/native-ui/css/foundation';
</style>

<!-- Wrong -- Vite won't resolve bare specifiers in <link> tags -->
<link rel="stylesheet" href="@nonoun/native-ui/css/foundation" />
```

## App Chrome (`layout.css`)

**File:** `src/styles/layout.css` -- imports `src/styles/demo.css`.

Contains a `@layer ui` block with universal reset (box-sizing, font smoothing, body background/color, reduced-motion zeroing of `--n-duration`), then unlayered app chrome:

- `.nav-logo` / `.auth-logo` -- flex container for SVG logo, strong ink
- `.nav-search-hint` -- muted color for sidebar search trigger
- `.nav-cmd-dialog` -- command palette: backdrop opacity, centering, shadow, width

### Demo utilities (`demo.css`)

Imported by `layout.css`. Base heading styles (`h1`-`h3`) and `.demo-*` classes:

- `.demo-section` -- bordered card (same visual as `.layout-section`)
- `.demo-row` -- flex row with wrap and gap
- `.demo-label` -- small uppercase label, 5rem fixed width
- `.demo-desc` / `.demo-caption` / `.demo-hint` -- muted text at various sizes
- `.demo-col`, `.demo-col-sm`, `.demo-col-lg`, `.demo-col-xl` -- flex column stacks with varying gap
- `.demo-actions` -- flex row for buttons
- `.demo-wrap` -- flex wrap container, 1.5rem gap
- `.demo-code` -- hidden by default, shown via `[visible]` attribute
- `.demo-event-log` -- monospace event log area

## Layout Block Utilities (`layout-blocks.css`)

**File:** `src/styles/layout-blocks.css`

Shared across 65+ demo pages. Scoped to `n-app-panel` where applicable.

**Scoped headings:** `n-app-panel h1` (1.25rem/700), `h2` (1rem/700, 2rem top margin), `h3` (0.75rem/600, uppercase). All use `--n-ink-strong-neutral` or `--n-ink-neutral`.

**Classes:**

| Class | Description |
|---|---|
| `.layout-section` | Bordered card. `--n-body-neutral` bg, `--n-border-muted-neutral` border, `--n-radius`, 1.5rem padding. |
| `.layout-row` | Flex row, wrap, center-aligned, 0.5rem gap. |
| `.layout-label` | 0.625rem uppercase label, 5rem fixed width, muted ink. Row prefix. |
| `.layout-code` | Hidden (`display: none`). Shown via `[visible]` attr. Monospace `<code>` block inside. |
| `.layout-grid` | CSS grid: `repeat(auto-fill, minmax(320px, 1fr))`, 1.5rem gap. |
| `.layout-col` | Flex column, 0.5rem gap. |
| `.layout-col-label` | Small uppercase label for grid columns. |
| `.layout-box` | Panel bg, muted border, 0.375rem radius, centered text. |
| `.layout-card` | Interactive card with transitions. Supports `[hovered]` / `[pressed]` attrs. |
| `.layout-hint` | 0.75rem muted text. |
| `.log` | Monospace event log, panel bg, `max-height: 10rem`, scrollable. |
| `.log-entry` | Log line with bottom border separator. |
| `.copy-btn` | Floated copy button inside `.layout-code`. |

**Typical page structure:**

```html
<main>
  <h1>&lt;n-component&gt;</h1>
  <p class="demo-desc">Description.</p>

  <h2>Section</h2>
  <div class="layout-section">
    <h3>Subsection</h3>
    <div class="layout-row">
      <span class="layout-label">variant</span>
      <!-- demo elements -->
    </div>
    <pre class="layout-code"><code>...</code></pre>
  </div>
</main>
```

## Per-Page Styles

Each `.astro` page can add a `<style is:global>` block. Scope with class prefixes to prevent leaking:

```astro
<style is:global>
  .auth-form { ... }
  .auth-logo { ... }
</style>
```

Prefixes in use: `auth-*`, `demo-*`, `kanban-*`, `layout-*`.

Rules:
- Always `<style is:global>` -- never plain `<style>` for `n-*` / `native-*` selectors
- Scope bare element selectors (`main`, `h1`-`h3`) to `n-app-panel`
- Use `:where()` for low-specificity overrides
- Place `<style>` at the bottom of the file

## Design Token Quick Reference

Most-used `--n-*` tokens. Full reference in native-ui `DESIGN-SYSTEM.md`.

**Ink (text):**
`--n-ink-neutral` (body text), `--n-ink-strong-neutral` (headings), `--n-ink-muted-neutral` (secondary/labels/hints), `--n-ink-accent`, `--n-surface-ink-accent` (text on accent bg)

**Surfaces (backgrounds):**
`--n-doc-neutral` (page bg), `--n-body-neutral` (content area), `--n-panel-neutral` (elevated: code blocks, boxes), `--n-surface-accent` (active/selected), `--n-panel-hover-neutral` (hover)

**Borders:**
`--n-border-neutral` (standard), `--n-border-muted-neutral` (subtle: sections, cards), `--n-border-accent` (active)

**Layout:**
`--n-radius`, `--n-space`, `--n-font-family`, `--n-text-line-height`, `--n-duration` (zeroed for reduced motion)

**Effects:**
`--n-focus-ring`, `--n-shadow-xl` (command palette), `--n-backdrop-opacity`

## Key Files

| File | Role |
|---|---|
| `src/layouts/BaseLayout.astro` | Loads foundation, component, app, and chat CSS |
| `src/layouts/SidebarLayout.astro` | Loads layout chrome, block utilities, and inspector CSS |
| `src/styles/layout.css` | App chrome: reset, logo, search hint, command dialog |
| `src/styles/demo.css` | Demo page base styles and `.demo-*` utilities |
| `src/styles/layout-blocks.css` | Documentation layout: `.layout-*` classes, scoped headings |

## See Also

- **native-ui `DESIGN-SYSTEM.md`** -- full token reference, cascading attributes
- **`CLAUDE.md`** -- project rules including `is:global` requirement
- **`docs/PACKAGES.md`** -- CSS import paths for each `@nonoun/*` package
