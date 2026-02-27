# native-host

Documentation site for the [@nonoun/native-ui](https://www.npmjs.com/package/@nonoun/native-ui) web component library, built with [Astro](https://astro.build).

## Getting Started

```sh
npm install
npm run dev
```

Open [localhost:4321](http://localhost:4321) — redirects to the ui-button demo page.

## Commands

| Command | Action |
|:--|:--|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build static site to `./dist/` |
| `npm run preview` | Preview the build locally |

## Project Structure

```
src/
  layouts/
    BaseLayout.astro            HTML shell, CSS, component registration
    SidebarLayout.astro         Sidebar nav + breadcrumb + content area
  pages/
    index.astro                 Redirects to /components/ui-button
    components/[slug].astro     30 component demo pages
    containers/[slug].astro     9 container demo pages
    blocks/[slug].astro         19 block pattern pages
    traits/[slug].astro         22 trait/controller demo pages
    styles/[slug].astro         4 style reference pages
    a2ui/[slug].astro           2 A2UI protocol demos
    icons.astro                 Icon system demo
    kernel.astro                Kernel demo
    core/context.astro          Context API demo
  data/
    sitemap.json                Page registry (title, path, group, snippet)
  lib/
    snippets.ts                 Snippet file loader and HTML parser
  scripts/
    layout.ts                   Client-side sidebar, theme, command palette
  styles/
    demo.css                    Shared demo page layout styles
    layout.css                  Sidebar chrome styles
docs/
  snippets/                     89 HTML demo pages (source of truth)
```

## How It Works

The 89 demo pages in `docs/snippets/` are full HTML files from the original Vite dev server, with imports already converted to npm paths. At build time:

1. Dynamic `[slug].astro` routes use `import.meta.glob` to load snippet HTML as raw strings
2. A parser extracts `<main>` content, inline `<style>`, and `<script>` blocks
3. Content is injected into the `SidebarLayout` via Astro's `set:html` directive
4. The sidebar nav is generated server-side from `sitemap.json`
5. Client-side JS handles sidebar toggle, theme switching, command palette (Cmd+K), and navigation

## Features

- Sidebar navigation with collapsible groups (persisted in localStorage)
- Light/dark theme toggle
- Command palette search (Cmd+K / Ctrl+K)
- Code block toggle for demo pages
- Breadcrumb showing current group and page
- 90 pre-rendered pages, builds in ~1.2 seconds
