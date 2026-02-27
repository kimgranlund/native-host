# native-host

Astro static site for the `@nonoun/native-ui` web component library. Serves as both documentation and an application shell.

## Quick Reference

- **Dev:** `npm run dev`
- **Build:** `npm run build` (90 pages, ~1.2s)
- **Preview:** `npm run preview`

## Architecture

89 HTML demo pages live in `docs/snippets/`. Dynamic `[slug].astro` routes load them at build time via `import.meta.glob` with `?raw`, extract `<main>` content, and inject it into a shared `SidebarLayout`.

### Key Files

| File | Purpose |
|---|---|
| `src/layouts/BaseLayout.astro` | HTML shell, loads foundation + component CSS, registers all custom elements |
| `src/layouts/SidebarLayout.astro` | Sidebar nav, breadcrumb, canvas, command palette — wraps BaseLayout |
| `src/lib/snippets.ts` | Snippet loader — globs HTML files, parses out main/styles/scripts |
| `src/scripts/layout.ts` | Client-side interactivity (sidebar toggle, theme, Cmd+K, code toggle) |
| `src/data/sitemap.json` | Page registry — maps titles/paths/groups to snippet files |

### CSS Loading

All CSS uses `<style is:global>` with `@import`. Never use `<link>` for npm packages — Vite doesn't resolve bare specifiers in link tags.

```astro
<!-- Correct -->
<style is:global>
  @import '@nonoun/native-ui/css/foundation';
</style>

<!-- Wrong — won't resolve -->
<link rel="stylesheet" href="@nonoun/native-ui/css/foundation" />
```

## Rules

- **All `<style>` blocks targeting `ui-*` elements MUST use `is:global`** — Astro's scoped styles add `[data-astro-cid-xxx]` attributes that break custom element selectors
- **Never import component classes on the server** — they extend `HTMLElement` which doesn't exist in Node.js
- **Don't wrap `ui-*` elements in Astro components** — use the custom elements directly in templates
- **CSS is not bundled with JS** — components are light DOM, CSS must always be loaded separately
- Content injected via `set:html` bypasses Astro's bundler — bare npm specifiers in inline scripts won't work
