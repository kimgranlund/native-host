# Composable Panels

SidebarLayout provides two opt-in aside panels -- Inspector and Chat -- that pages declare via the `panels` prop and layout.ts wires at runtime.

## Overview

Every page rendered through `SidebarLayout` can control which aside panels appear alongside its main content. The `panels` prop accepts an array of panel names (`'inspector'` and/or `'chat'`). Both are enabled by default; pages that want fewer panels (or none) pass an explicit subset. Toggle buttons in the breadcrumb bar appear or disappear to match the declared panels, and the custom swap logic adjusts its strategy based on whether panel configuration changes between navigations.

## Panel Architecture

```
<n-app-canvas>
  <n-app-panel>                          main content (always present)
  <n-app-panel aside id="inspector-panel">   inspector (optional)
  <n-app-panel aside id="chat-panel">        chat (optional)
</n-app-canvas>
```

Key structural details:

- **`n-app-panel` is CSS-only in `@nonoun/native-app` 0.3.0** -- the package removed the JS class but kept the CSS. The host registers a minimal custom element stub in `setup.ts` so that `:not(:defined)` does not hide the panel and `layout.ts` can call `.toggle()`:

  ```typescript
  // src/scripts/setup.ts
  if (!customElements.get('n-app-panel')) {
    customElements.define('n-app-panel', class extends HTMLElement {
      get open() { return this.hasAttribute('open'); }
      set open(v: boolean) { this.toggleAttribute('open', v); }
      toggle() { this.open = !this.open; }
    });
  }
  ```

- **Aside panels open/close via the `[open]` attribute.** CSS transitions the panel width from `0` to `360px`; the resize handle allows the user to drag between `280px` and `480px`.

- **Each aside panel contains a `.layout-resize-handle`** as its first child, enabling drag-to-resize.

- **The main `<n-app-panel>` (without `aside`)** is the slot target for page content and carries Astro's `transition:animate="fade"` attribute for View Transition support.

## Usage

### Default (both panels)

When no `panels` prop is passed, both Inspector and Chat panels render. This is the standard configuration for component demo pages:

```astro
---
import SidebarLayout from '../layouts/SidebarLayout.astro';
---
<SidebarLayout title="Button">
  <main>
    <!-- page content -->
  </main>
</SidebarLayout>
```

### No panels

Block pages (full-width demos like auth forms, dashboards, kanban boards) pass an empty array to suppress all aside panels:

```astro
---
import SidebarLayout from '../layouts/SidebarLayout.astro';
---
<SidebarLayout title="Auth Login" panels={[]}>
  <main>
    <!-- full-width block demo -->
  </main>
</SidebarLayout>
```

All ~22 block pages in `src/pages/blocks/` use this pattern.

### Inspector only

Pages that need the inspector but not the chat panel pass a single-element array:

```astro
<SidebarLayout title="Colors" panels={['inspector']}>
  <main>...</main>
</SidebarLayout>
```

The `'chat'` value works the same way for chat-only pages.

### Custom panel content

Named slots override the default panel content. The panel chrome (aside wrapper, resize handle) is still provided by the layout -- only the inner content changes:

```astro
<SidebarLayout title="Editor" panels={['inspector']}>
  <main>
    <!-- page content -->
  </main>
  <div slot="inspector">
    <custom-inspector-content />
  </div>
</SidebarLayout>
```

A `slot="chat"` works identically for the chat panel.

## Inspector Panel

The default inspector content is `<native-tokens>` from `@nonoun/native-tokens`. It is self-registering -- `layout.ts` imports `@nonoun/native-tokens` as a side effect, and `SidebarLayout` loads the CSS via `@import '@nonoun/native-tokens/css'`. No manual `customElements.define()` call is needed.

The inspector can be overridden on a per-page basis via `slot="inspector"` (see Custom panel content above).

## Chat Panel

The default chat content is:

```html
<n-chat size="sm">
  <n-chat-content></n-chat-content>
</n-chat>
```

This comes from `@nonoun/native-chat`, registered in `setup.ts` via `import '@nonoun/native-chat/register'`. The chat panel can be overridden via `slot="chat"`.

## Toggle Wiring

Toggle wiring lives in `layout.ts` and connects breadcrumb trailing buttons to their corresponding aside panels.

### Breadcrumb buttons

SidebarLayout conditionally renders toggle buttons based on the `panels` prop:

```astro
<!-- Only rendered when showInspector is true -->
<n-button variant="ghost" size="sm" id="inspector-toggle">
  <n-icon name="sliders-horizontal" size="md"></n-icon>
</n-button>

<!-- Only rendered when showChat is true -->
<n-button variant="ghost" size="sm" id="chat-toggle">
  <n-icon name="chat-dots" size="md"></n-icon>
</n-button>
```

### wireToggle()

The `wireToggle(btnId, panelId)` function in `layout.ts`:

1. Looks up the button and panel elements by ID.
2. Checks if the panel has already been wired (via a `WeakSet<HTMLElement>` called `wiredPanels`) and skips if so -- this prevents duplicate listeners when the same panel DOM node persists across navigations.
3. Adds a `click` listener on the button that calls `panel.toggle()`.
4. Attaches a `MutationObserver` on the panel watching for `[open]` attribute changes, syncing the button icon's `weight` attribute (`"fill"` when open, removed when closed).

```typescript
const wiredPanels = new WeakSet<HTMLElement>();

function wireToggle(btnId: string, panelId: string) {
  const btn = document.getElementById(btnId);
  const panel = document.getElementById(panelId) as HTMLElement & { toggle(): void } | null;
  if (!panel || wiredPanels.has(panel)) return;
  wiredPanels.add(panel);
  btn?.addEventListener('click', () => panel.toggle());
  new MutationObserver(() => {
    const icon = btn?.querySelector('n-icon');
    if (!icon) return;
    if (panel.hasAttribute('open')) icon.setAttribute('weight', 'fill');
    else icon.removeAttribute('weight');
  }).observe(panel, { attributes: true, attributeFilter: ['open'] });
}
```

### Wiring lifecycle

Toggle wiring runs in `setupPage()` (called on every `astro:page-load`), **not** in `wireSidebar()`. This is intentional: the sidebar DOM persists across navigations, but panel configuration can change between pages (e.g., a component page with both panels navigating to a block page with none). The `WeakSet` ensures that panels that survive the swap are not re-wired.

## Custom Swap and Panels

The custom swap in `layout.ts` (`astro:before-swap` handler) uses the panel count to decide its replacement strategy:

1. **Same panel count** -- When the current and incoming pages have the same number of `n-app-panel[aside]` elements, the swap replaces **only the main content panel** (`n-app-panel:not([aside])`). Aside panels stay in the live DOM, preserving their open/closed state and any user-resized widths.

2. **Different panel count** -- When the aside count differs (e.g., navigating from a block page with `panels={[]}` to a component page with the default two panels), the swap replaces the **entire `<n-app-canvas>`** to get the correct panel structure.

3. **Breadcrumb trailing buttons** -- The swap always replaces the breadcrumb `[slot="trailing"]` container so that toggle buttons match the incoming page's panel configuration.

The detection logic (see [SSR.md](SSR.md) for the full swap handler):

```typescript
const currentAsides = currentCanvas?.querySelectorAll('n-app-panel[aside]').length ?? 0;
const newAsides = newCanvas?.querySelectorAll('n-app-panel[aside]').length ?? 0;

if (currentAsides !== newAsides && currentCanvas && newCanvas) {
  // Panel config changed -- swap entire canvas
  currentCanvas.replaceWith(document.adoptNode(newCanvas));
} else {
  // Same structure -- swap only the main content panel
  const currentPanel = currentCanvas?.querySelector('n-app-panel:not([aside])');
  const newPanel = newCanvas?.querySelector('n-app-panel:not([aside])');
  if (currentPanel && newPanel) {
    currentPanel.replaceWith(document.adoptNode(newPanel));
  }
}
```

## Key Files

| File | Role |
|---|---|
| `src/layouts/SidebarLayout.astro` | Declares `panels` prop, conditionally renders aside panels and toggle buttons, provides named slots |
| `src/scripts/layout.ts` | `wireToggle()`, `wiredPanels` WeakSet, custom swap panel-count detection, `setupPage()` lifecycle |
| `src/scripts/setup.ts` | Registers the minimal `n-app-panel` custom element stub with `toggle()` / `open` getter-setter |
| `src/styles/layout.css` | App chrome styles (sidebar, breadcrumb, command palette) |
| `src/styles/layout-blocks.css` | Documentation layout utilities scoped under `n-app-panel` |

## See Also

- [ARCHITECTURE.md](ARCHITECTURE.md) -- layout hierarchy and full project structure
- [SSR.md](SSR.md) -- preference persistence and View Transitions
