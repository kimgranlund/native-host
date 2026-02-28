# T0016: Consolidate inline logo SVG into a single source

**Severity:** Low
**From:** native-ui → native-host

## Problem

The NativeUI brand logo (rounded-rect "N" monogram) is duplicated as inline SVG in at least 4 locations with different sizes:

| File | Size | Context |
|------|------|---------|
| `src/layouts/SidebarLayout.astro` ~L43 | 20×20 | Sidebar header logo |
| `src/layouts/SidebarLayout.astro` ~L55 | 16×16 | Team option logo |
| `src/data/layouts/SidebarLayout.astro` ~L41 | 20×20 | Data sidebar header logo |
| `src/data/layouts/SidebarLayout.astro` ~L53 | 16×16 | Data team option logo |
| `src/pages/index.astro` ~L43 | 28×28 | Home page hero |
| `public/favicon.svg` | 512×512 | Favicon (different format — filled bg) |

The SVG path data is identical across all instances:

```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2"/>
  <path d="M8 16V8l8 8V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

If the logo ever changes, all 5 inline copies must be updated manually.

## Suggested Approach

Create an Astro component that encapsulates the logo SVG with a `size` prop:

```astro
---
// src/components/Logo.astro
interface Props {
  size?: number;
}
const { size = 20 } = Astro.props;
---
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2"/>
  <path d="M8 16V8l8 8V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

Then replace all inline copies:

```astro
<span class="nav-logo" slot="icon"><Logo size={20} /></span>
<span class="nav-logo" slot="icon"><Logo size={16} /></span>
<h1><Logo size={28} /> native-ui</h1>
```

## Notes

- The SVG uses `currentColor` — it inherits text color automatically, no fill/stroke props needed
- The `viewBox="0 0 24 24"` stays fixed — `width`/`height` control rendered size
- The favicon uses a different format (filled black background + white stroke) — it stays separate
