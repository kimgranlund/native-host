# Pages

Guide for adding and modifying pages in the native-host Astro project.

## Overview

~100 `.astro` pages across 7 groups: Components (~31), Containers, Traits, Blocks (~22), Core, Packages, and Other (styles, icons, kernel, a2ui). Each page is a standalone file with its own markup, scripts, and styles. Pages are auto-discovered via `import.meta.glob` in `src/data/pages.ts` -- just create a file in the right directory and it appears in the sidebar nav, breadcrumb, and command palette. No registration step needed.

Directory-to-group mapping:

| Directory | Group |
|-----------|-------|
| `src/pages/components/` | Components |
| `src/pages/containers/` | Containers |
| `src/pages/traits/` | Traits |
| `src/pages/blocks/` | Blocks |
| `src/pages/core/` | Core |
| `src/pages/packages/` | Packages |
| `src/pages/styles/`, `src/pages/a2ui/` | Other |

## Adding a New Page

Step-by-step:

1. **Create the file** in the correct directory. Filename becomes the URL slug: `src/pages/components/tooltip.astro` serves at `/components/tooltip`.

2. **Import the layout** in frontmatter:
   ```astro
   ---
   import SidebarLayout from '../../layouts/SidebarLayout.astro';
   ---
   ```

3. **Wrap content** in `<SidebarLayout title="Title">` with a `<main>` element inside:
   ```astro
   <SidebarLayout title="Tooltip">
     <main>
       <h1>&lt;n-tooltip&gt;</h1>
       <!-- page content -->
     </main>
   </SidebarLayout>
   ```

4. **Add `<script>`** with `astro:page-load` wrapper for any client-side interactivity:
   ```astro
   <script>
     document.addEventListener('astro:page-load', () => {
       const el = document.querySelector('#my-demo');
       // wire up demo interactions
     });
   </script>
   ```

5. **Add `<style is:global>`** for page-specific styles. All `<style>` blocks targeting `n-*` or `native-*` elements must use `is:global` -- Astro's scoped styles break custom element selectors.
   ```astro
   <style is:global>
     .my-demo-class {
       /* page-specific styles */
     }
   </style>
   ```

6. **Done.** The page auto-appears in the sidebar nav under its group. No manual registration needed.

7. **If the auto-derived title is wrong**, add a `titleOverrides` entry in `src/data/pages.ts`:
   ```ts
   const titleOverrides: Record<string, string> = {
     '/components/tooltip': 'Tooltip',   // only if auto-title is wrong
     // ...
   };
   ```

## Page Patterns

### Component Demo Page

~65 pages. Uses `SidebarLayout` with default panels (inspector + chat). Structured with `<h1>` for component name, `<h2>` for sections, `.layout-section` for bordered demo cards, `.layout-row` for flex rows, `.label` for inline size/variant labels, and `.code-block` for togglable code blocks.

Full template:

```astro
---
import SidebarLayout from '../../layouts/SidebarLayout.astro';

const codeExamples = {
  basic: `&lt;n-tooltip text="Hello"&gt;
  &lt;n-button&gt;&lt;span slot="label"&gt;Hover me&lt;/span&gt;&lt;/n-button&gt;
&lt;/n-tooltip&gt;`,
};
---
<SidebarLayout title="Tooltip">
  <main>
    <h1>&lt;n-tooltip&gt;</h1>
    <p style="color: var(--n-ink-muted-neutral); font-size: 0.875rem; margin-bottom: 1.5rem;">
      Short description of the component.
    </p>

    <h2>Variants</h2>
    <div class="layout-section">
      <div class="layout-row">
        <span class="label">Default</span>
        <n-tooltip text="Hello">
          <n-button size="sm"><span slot="label">Hover me</span></n-button>
        </n-tooltip>
      </div>
      <pre class="code-block"><code set:html={codeExamples.basic} /><n-button class="copy-btn" size="sm" variant="ghost" aria-label="Copy"><n-icon name="copy"></n-icon></n-button></pre>
    </div>
  </main>
</SidebarLayout>

<script>
  document.addEventListener('astro:page-load', () => {
    // client-side demo wiring
  });
</script>

<style is:global>
  /* page-specific styles (if needed) */
</style>
```

### Block Page

~22 pages. Uses `SidebarLayout` with `panels={[]}` to hide the inspector and chat panels. Block pages showcase full UI compositions (auth forms, dashboards, etc.) with more extensive page-specific styles.

Full template:

```astro
---
import SidebarLayout from '../../layouts/SidebarLayout.astro';
---
<SidebarLayout title="Auth Login" panels={[]}>
  <main>
    <h1>Sign In</h1>
    <p class="desc">
      Login block with provider login, centered card, and split layout variants.
    </p>

    <h2>Provider Login</h2>
    <div class="section">
      <!-- full block composition here -->
    </div>

    <h2>Card Login</h2>
    <div class="section">
      <!-- another variant -->
    </div>
  </main>
</SidebarLayout>

<style is:global>
  .desc {
    color: var(--n-ink-muted-neutral);
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }
  .section {
    /* variant container styles */
  }
</style>
```

### Standalone Page

2-3 pages (`index.astro`, `signup.astro`). Uses `BaseLayout` directly -- no sidebar. Must import `layout.css` manually since `SidebarLayout` is not wrapping the page.

Full template:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Log In">
  <style is:global>
    @import '../styles/layout.css';
  </style>

  <main class="login-screen">
    <!-- full-page standalone content -->
  </main>
</BaseLayout>
```

## Layout Block Classes

Shared documentation layout utilities from `src/styles/layout-blocks.css`. Scoped under `n-app-panel` where applicable. Available on all pages using `SidebarLayout`.

| Class | What it renders |
|-------|----------------|
| `.layout-section` | Bordered card with 1.5rem padding. Main demo container. Background, border, and border-radius. |
| `.layout-row` | Flex row with 0.5rem gap, wrapping, vertically centered. For inline demos. |
| `.label` | Small uppercase label (0.625rem, muted color, fixed 5rem width). Inline size/variant label. |
| `.code-block` | Code block wrapper. Hidden by default, shown when `[visible]` attribute is set (via code toggle). |
| `.grid` | CSS grid, `auto-fill` columns at 320px min. For multi-column layouts. |
| `.layout-col` | Flex column with 0.5rem gap. Grid child. |
| `.col-label` | Small uppercase label for columns (0.625rem, muted). |
| `.box` | Demo box with border, background, centered text. Generic placeholder. |
| `.card` | Card with center alignment, transitions for hover/press states. Interactive demo target. |
| `.hint` | Small hint text (0.75rem, muted color) below content. |
| `.log` | Monospace log container (max-height 10rem, scrollable). For event log demos. |
| `.log-entry` | Individual log line with bottom border separator. |
| `.copy-btn` | Copy button floated right inside `.code-block` blocks. |

Heading styles are also scoped to `n-app-panel`:
- `h1` -- 1.25rem, bold. Component name.
- `h2` -- 1rem, bold, 2rem top margin. Section heading.
- `h3` -- 0.75rem, uppercase, semibold. Sub-section label.

## Code Blocks and Copy Buttons

Code blocks use `.code-block` wrappers that are hidden by default and toggled visible via the code toggle button in the layout chrome.

Structure:

```html
<pre class="code-block"><code>&lt;n-button variant="primary"&gt;
  &lt;span slot="label"&gt;Click me&lt;/span&gt;
&lt;/n-button&gt;</code><n-button class="copy-btn" size="sm" variant="ghost" aria-label="Copy"><n-icon name="copy"></n-icon></n-button></pre>
```

Key details:

- The copy button handler is wired globally by `layout.ts`'s `setupPage()` function. No per-page import needed.
- On click, the handler copies the sibling `<code>` text content to clipboard and swaps the icon to a checkmark for 1.5 seconds.
- For dynamic code content (Astro expressions in frontmatter), define code strings with HTML entities (`&lt;` for `<`, `&gt;` for `>`) and use `set:html` on `<code>`:

```astro
---
const codeExamples = {
  basic: `&lt;n-button variant="primary"&gt;
  &lt;span slot="label"&gt;Click me&lt;/span&gt;
&lt;/n-button&gt;`,
};
---
<pre class="code-block"><code set:html={codeExamples.basic} /><n-button class="copy-btn" size="sm" variant="ghost" aria-label="Copy"><n-icon name="copy"></n-icon></n-button></pre>
```

## Event Logging

For demo pages that show event output, use the shared utilities from `src/scripts/event-log.ts`.

Two modes:

| Function | Behavior | Container class |
|----------|----------|-----------------|
| `logPrepend(el, msg)` | Newest entry on top | `.log` |
| `logAppend(el, msg, maxEntries?)` | Oldest on top, auto-scrolls, caps at `maxEntries` (default 20) | `.output` or `.log` |

Usage:

```astro
<!-- In the template -->
<div class="layout-section">
  <n-button id="demo-btn"><span slot="label">Click me</span></n-button>
  <div id="event-log" class="log"></div>
</div>

<!-- In the script -->
<script>
  import { logPrepend } from '../../scripts/event-log';

  document.addEventListener('astro:page-load', () => {
    const btn = document.querySelector('#demo-btn');
    const logEl = document.querySelector('#event-log');

    btn?.addEventListener('native:press', () => {
      logPrepend(logEl, 'native:press fired');
    });
  });
</script>
```

Each entry is rendered as a `<div class="log-entry">` with a bottom border separator. The `.log` container is monospace, capped at 10rem height, and scrollable.

## Title Overrides

`src/data/pages.ts` auto-derives page titles from the filename slug:

- **Components and Containers**: strip `ui-` prefix, title case. `ui-button` becomes "Button", `ui-input-otp` becomes "Input Otp".
- **Traits**: PascalCase. `roving-focusable` becomes "RovingFocusable" (but needs override -- see below).
- **Blocks and Other**: title case. `auth-login` becomes "Auth Login".

When the auto-derived title is wrong, add an entry to `titleOverrides` in `pages.ts`:

```ts
const titleOverrides: Record<string, string> = {
  '/components/input-otp': 'Input OTP',    // auto: "Input Otp" (wrong case)
  '/components/kbd': 'Kbd',                 // auto: correct, but explicit for clarity
  '/containers/header': 'Header / Body / Footer',  // page covers 3 elements
  '/packages/native-editor': 'Editor',         // strip package prefix
  '/blocks/data-dashboard-stats': 'Dashboard Stats',  // simplify slug
  // ... see pages.ts for full list
};
```

The key is the URL path without `.astro` extension: `/components/tooltip`, `/blocks/auth-login`, etc.

## Key Files

| File | Purpose |
|------|---------|
| `src/data/pages.ts` | Auto-discovers pages, derives titles, builds sitemap for nav + command palette |
| `src/layouts/SidebarLayout.astro` | Sidebar nav, breadcrumb, inspector/chat panels, command palette |
| `src/layouts/BaseLayout.astro` | HTML shell, loads foundation CSS, registers all custom elements |
| `src/styles/layout-blocks.css` | Shared layout utility classes (`.layout-section`, `.layout-row`, etc.) |
| `src/scripts/copy-buttons.ts` | Global copy-to-clipboard handler for `.copy-btn` elements |
| `src/scripts/event-log.ts` | `logPrepend` / `logAppend` utilities for demo event logging |
| `src/scripts/layout.ts` | Client-side layout interactivity (sidebar toggle, theme, code toggle) |

## See Also

- [ARCHITECTURE.md](ARCHITECTURE.md) -- project structure, layout system, CSS loading rules
- [CSS.md](CSS.md) -- CSS architecture, import patterns, custom property conventions
