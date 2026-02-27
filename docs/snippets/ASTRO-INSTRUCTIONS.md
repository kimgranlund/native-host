# Instruction Prompt: Rebuild native-ui Demo Site in Astro

## Objective

Rebuild the native-ui component library documentation site as an Astro server project. The current site is a static Vite dev server with 89 HTML demo pages. The Astro version should have file-based routing, a shared layout, and server-side rendering — serving as both documentation and a real application shell.

## Source Material

The `snippets/` directory contains all 89 demo pages with imports already converted to npm paths. These are the source of truth for component markup, demos, and block templates.

```
snippets/
  components/    30 component demo pages
  containers/     9 container demo pages
  blocks/        19 pre-composed UI patterns (auth, forms, data, nav, overlays)
  traits/        22 trait/controller demo pages
  styles/         4 pages (colors, reference, state-grid, ui showcase)
  icons/          1 icon system demo
  kernel/         1 kernel demo
  a2ui/           2 A2UI protocol demos
  context.html    1 context API demo
  nav/            reference files (ui-layout-element.ts, sitemap.json, ui-layout.css)
```

## npm Package

```bash
npm install @nonoun/native-ui
```

### Entry Points

| Import | What |
|--------|------|
| `@nonoun/native-ui` | Tree-shakeable component classes + reactivity + core |
| `@nonoun/native-ui/register` | Side-effect import — registers all ~57 custom elements |
| `@nonoun/native-ui/kernel` | Kernel + A2UI protocol |
| `@nonoun/native-ui/traits` | Trait controllers + reactivity (no components) |
| `@nonoun/native-ui/css` | Foundation + all component CSS |
| `@nonoun/native-ui/css/foundation` | Colors, tokens, themes, base |
| `@nonoun/native-ui/css/components` | Component styles only |
| `@nonoun/native-ui/css/lean` | Production CSS (no force-* debug selectors) |

### Critical: CSS is NOT bundled with JS

Components have no shadow DOM. CSS must be loaded via `<link>` or `@import`. Without CSS, components render as unstyled inline elements.

## Architecture

### Astro Project Structure

```
src/
  layouts/
    BaseLayout.astro          ← <html>, <head>, CSS links, register script
    SidebarLayout.astro       ← sidebar + breadcrumb + canvas (wraps BaseLayout)
  pages/
    index.astro               ← landing / redirect
    components/
      [slug].astro            ← dynamic route for all 30 component demos
    containers/
      [slug].astro
    blocks/
      [slug].astro
    traits/
      [slug].astro
    styles/
      [slug].astro
    icons.astro
    kernel.astro
    a2ui/
      [slug].astro
  data/
    sitemap.json              ← page registry (copy from snippets/nav/sitemap.json, update paths)
  components/
    Sidebar.astro             ← server-rendered sidebar nav
    Breadcrumb.astro          ← server-rendered breadcrumb
```

### BaseLayout.astro

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} — native-ui</title>
    <link rel="stylesheet" href="@nonoun/native-ui/css/foundation" />
    <link rel="stylesheet" href="@nonoun/native-ui/css/components" />
  </head>
  <body>
    <slot />
    <script>
      import '@nonoun/native-ui/register';
    </script>
  </body>
</html>
```

### SidebarLayout.astro

Reconstruct the layout from `snippets/nav/ui-layout-element.ts`. The reference file shows exactly how the dev site builds its shell. The key components to use:

- `<ui-layout-sidebar>` — outer flex layout (sidebar aside + content column)
- `<ui-layout-breadcrumb>` — top bar with leading/label/trailing slots
- `<ui-layout-canvas>` — flex row for body + chat
- `<ui-layout-body>` — scrollable content area
- `<ui-layout-chat>` — optional right panel (hidden by default, toggle with `[open]`)
- `<ui-nav>` with `<ui-nav-group>` / `<ui-nav-item>` — sidebar navigation

The reference file (`snippets/nav/ui-layout-element.ts`) builds all of this imperatively in JS. In Astro, render it as server HTML:

```astro
---
import sitemap from '../data/sitemap.json';
const currentPath = Astro.url.pathname;
const groups = new Map<string, typeof sitemap>();
for (const entry of sitemap) {
  if (!groups.has(entry.group)) groups.set(entry.group, []);
  groups.get(entry.group)!.push(entry);
}
---
<BaseLayout title={title}>
  <ui-layout-sidebar>
    <aside slot="sidebar">
      <!-- header, nav groups, footer — see reference -->
      <ui-nav size="md">
        {[...groups.entries()].map(([groupName, entries]) => (
          <ui-nav-group>
            <ui-nav-group-header><ui-icon name={iconMap[groupName]}></ui-icon>{groupName}</ui-nav-group-header>
            {entries.map(e => (
              <ui-nav-item value={e.path} aria-current={currentPath === e.path ? 'page' : undefined}>
                {e.title}
              </ui-nav-item>
            ))}
          </ui-nav-group>
        ))}
      </ui-nav>
    </aside>
    <div>
      <ui-layout-breadcrumb>
        <!-- sidebar toggle, breadcrumb, theme toggle -->
      </ui-layout-breadcrumb>
      <ui-layout-canvas>
        <ui-layout-body>
          <slot />
        </ui-layout-body>
      </ui-layout-canvas>
    </div>
  </ui-layout-sidebar>
</BaseLayout>
```

### Features from the Reference to Preserve

From `snippets/nav/ui-layout-element.ts`, the dev site has:

1. **Sidebar collapse/expand** — toggle button, persisted in localStorage (`nav-sidebar-collapsed`)
2. **Sidebar resize** — drag handle, persisted width (`nav-sidebar-width`)
3. **Theme toggle** — light/dark via `document.documentElement.style.colorScheme`, persisted (`nav-color-scheme`)
4. **Command palette** (⌘K) — `<ui-dialog>` + `<ui-command>` searching all pages
5. **Nav group open/close state** — persisted per group (`nav-group-states`)
6. **Breadcrumb** — shows group + page title from sitemap
7. **Chat panel toggle** — `<ui-layout-chat>` with `[open]` attribute
8. **Code toggle** — shows/hides `.demo-code` blocks on demo pages
9. **System menu** — team switcher popup in sidebar header
10. **User menu** — account/billing popup in sidebar footer

Items 1-5 should be implemented. Items 6-10 are nice-to-have.

### Dynamic Routes

Each category uses a dynamic `[slug].astro` route. The slug maps to a snippet file. Load the snippet HTML and inject it into the layout:

```astro
---
// src/pages/components/[slug].astro
import SidebarLayout from '../../layouts/SidebarLayout.astro';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export function getStaticPaths() {
  // Generate paths from the snippet files
  const files = import.meta.glob('/snippets/components/*.html', { query: '?raw', import: 'default' });
  return Object.keys(files).map(path => ({
    params: { slug: path.split('/').pop()!.replace('.html', '') },
  }));
}

const { slug } = Astro.params;
const raw = readFileSync(resolve('snippets/components', `${slug}.html`), 'utf-8');

// Extract the <main>...</main> content from the full HTML page
const mainMatch = raw.match(/<main[^>]*>([\s\S]*?)<\/main>/);
const content = mainMatch?.[1] ?? '';
const titleMatch = raw.match(/<title>([^<]+)<\/title>/);
const title = titleMatch?.[1]?.split('—')[0]?.trim() ?? slug;
---
<SidebarLayout title={title}>
  <main set:html={content} />
</SidebarLayout>
```

### Sitemap Adaptation

Copy `snippets/nav/sitemap.json` to `src/data/sitemap.json`. Update paths from Vite dev paths to Astro routes:

| Old path | New path |
|----------|----------|
| `/src/components/ui-button/ui-button.html` | `/components/ui-button` |
| `/src/containers/ui-card/ui-card.html` | `/containers/ui-card` |
| `/src/traits/pressable.html` | `/traits/pressable` |
| `/src/blocks/authentication/auth-login/auth-login.html` | `/blocks/auth-login` |
| `/src/styles/reference.html` | `/styles/reference` |
| `/src/icons/ui-icon.html` | `/icons` |
| `/src/kernel/kernel.html` | `/kernel` |

### Client-Side Interactivity

The snippet HTML files contain `<script type="module">` blocks with event logging, form handling, and copy-to-clipboard. In Astro:

- Move inline scripts to `<script>` tags in the `.astro` page (Astro bundles these automatically)
- The `import '@nonoun/native-ui/register'` goes in the BaseLayout (runs once)
- Per-page scripts (event logging, etc.) stay in the individual page files

### CSS

The demo pages have inline `<style>` blocks for page-level layout (`.demo-row`, `.demo-section`, `.demo-label`, etc.). Extract these into a shared `demo.css` or keep them inline per page. The styles are for documentation layout, not component styling.

### Key Conventions from the Demo Pages

- **Demo sections**: `<h2>` heading + `<div class="demo-section">` with variant grids
- **Demo rows**: `<div class="demo-row">` for horizontal component strips
- **Demo labels**: `<span class="demo-label">` for size/variant labels in grids
- **Code blocks**: `<pre class="demo-code"><code>...</code></pre>` — toggled visible via `[visible]` attribute
- **Event logs**: `<div class="log">` with `.log-entry` children prepended on events
- **Force states**: `force-hover`, `force-active`, `force-focus-visible` attributes for debug state demos

### What NOT to Do

- Don't use shadow DOM — native-ui is light DOM only
- Don't import component classes on the server — they extend HTMLElement which doesn't exist in Node.js
- Don't try to SSR component behavior — just emit the HTML tags, CSS styles them, JS hydrates them
- Don't create `.astro` wrapper components for each `ui-*` element — use the custom elements directly in Astro templates
- Don't bundle the CSS with JS — always load via `<link>` tags

### Icon System

The demo pages use `<ui-icon name="house">` which requires individual icon registration. The npm package includes `<ui-icon>` but the 3,025 Phosphor icon modules are not in the dist (too large). For the Astro site:

Option A: Use the curated built-in icons only (carets, check, x, arrows — ~30 icons bundled in the main JS)
Option B: Install `@phosphor-icons/core` and register icons manually:
```ts
import { registerIcon } from '@nonoun/native-ui';
registerIcon('house', '<svg viewBox="0 0 256 256" fill="currentColor">...</svg>');
```

### Deployment

Astro with `output: 'server'` for SSR, or `output: 'static'` for a pre-rendered docs site. Either works since the components are purely client-side. Static is simpler for a documentation site.
