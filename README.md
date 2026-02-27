# native-host

Documentation and application shell for the [@nonoun/native-ui](https://www.npmjs.com/package/@nonoun/native-ui) web component library, built with [Astro](https://astro.build).

## Getting Started

```sh
npm install
npm run dev
```

Open [localhost:4321](http://localhost:4321).

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
    SidebarLayout.astro         Sidebar nav, breadcrumb, inspector/chat panels, command palette
  pages/
    index.astro                 Landing page with group overview and features
    components/*.astro          30 component demo pages
    containers/*.astro          9 container demo pages
    blocks/*.astro              19 block pattern pages
    traits/*.astro              22 trait/controller demo pages
    styles/*.astro              4 style reference pages
    a2ui/*.astro                2 A2UI protocol demos
    icons.astro                 Icon system demo
    kernel.astro                Kernel demo
    core/context.astro          Context API demo
  data/
    pages.ts                    Auto-discovers .astro pages for nav and command palette
  scripts/
    layout.ts                   Client-side sidebar, theme, command palette, inspector, chat
    icons.ts                    Phosphor icon registration (~108 icons)
    setup.ts                    Trait registration, window globals, component registration
    event-log.ts                Shared event logging utilities for demo pages
    copy-buttons.ts             Shared copy-to-clipboard button handler
  styles/
    layout.css                  App-specific sidebar content and command dialog overrides
    layout-blocks.css           Shared documentation layout utilities (.layout-section, .layout-row, etc.)
```

## Architecture

90 individual `.astro` pages — one per component, trait, block, and style page. Each page is a standalone file with its own markup, scripts, and optional `<style is:global>` block. All pages share `SidebarLayout` which provides the sidebar nav, breadcrumb bar, inspector panel, chat panel, and command palette.

## Features

- Sidebar navigation with collapsible groups (persisted in localStorage)
- Light/dark theme toggle
- Command palette search (Cmd+K / Ctrl+K)
- Code block toggle for demo pages
- Design inspector panel with color system explorer
- Chat panel
- Breadcrumb showing current group and page
- 90 pre-rendered static pages
