# native-host Documentation

Astro SSR site and application shell for `@nonoun/native-ui`. ~100 pages, Turso database, View Transitions with custom swap, composable panel system.

## For Coding Agents

Load this file first. Then pull in specific docs as your task requires.

### What are you doing?

| Task | Read first | Then |
|------|-----------|------|
| Add a new component/trait/block page | [PAGES.md](PAGES.md) | [EXAMPLES.md](EXAMPLES.md) |
| Modify layout, sidebar, or breadcrumb | [ARCHITECTURE.md](ARCHITECTURE.md) | [PANELS.md](PANELS.md) |
| Style a page or use design tokens | [CSS.md](CSS.md) | native-ui `docs/DESIGN-SYSTEM.md` |
| Work with SSR, cookies, or caching | [SSR.md](SSR.md) | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Add database tables or queries | [DATABASE.md](DATABASE.md) | [SSR.md](SSR.md) |
| Understand package ecosystem | [PACKAGES.md](PACKAGES.md) | native-ui `docs/PACKAGES.md` |
| Add/modify inspector or chat panel | [PANELS.md](PANELS.md) | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Fix a bug or avoid known pitfalls | [RULES.md](RULES.md) | [CSS.md](CSS.md) |
| See working code patterns | [EXAMPLES.md](EXAMPLES.md) | [PAGES.md](PAGES.md) |

### Cold-start minimum

Load [ARCHITECTURE.md](ARCHITECTURE.md) + [EXAMPLES.md](EXAMPLES.md). These two files give you enough context to understand the project and make changes. Load other files only when the task requires them.

### Build foundational understanding first

Before working on complex systems (View Transitions, custom swap, panel wiring), read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the layout hierarchy and data flow. The complex systems build on that foundation.

## File Index

| File | Covers |
|------|--------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Layout hierarchy, page anatomy, script system, data flow |
| [PAGES.md](PAGES.md) | Adding pages, page patterns, layout-block classes, code blocks |
| [CSS.md](CSS.md) | CSS loading order, architecture, design token consumption |
| [SSR.md](SSR.md) | Preferences, cookies, middleware, View Transitions, custom swap |
| [DATABASE.md](DATABASE.md) | Turso + Drizzle setup, schema, migrations, env vars |
| [PACKAGES.md](PACKAGES.md) | All @nonoun/* packages, registration order, icon system |
| [PANELS.md](PANELS.md) | Composable inspector/chat panels, toggle wiring, custom swap |
| [EXAMPLES.md](EXAMPLES.md) | 10 copy-pasteable Astro patterns with expected DOM results |
| [RULES.md](RULES.md) | Hard rules and known gotchas |

## Cross-references to native-ui

This project consumes `@nonoun/native-ui`. The library has its own documentation. When you need component APIs, trait details, or design token reference, read those docs — native-host docs do NOT duplicate them.

| native-ui doc | When to read it |
|---------------|-----------------|
| `docs/COMPONENTS.md` | Component attributes, slots, events |
| `docs/DESIGN-SYSTEM.md` | Token names, color system, theming |
| `docs/TRAITS.md` | Trait controllers, options, events |
| `docs/PATTERNS.md` | Coordinator pattern, popover wiring, form submission |
| `docs/EXAMPLES.md` | Library-level examples (not Astro-specific) |

## Quick Commands

```
npm run dev          # dev server at localhost:4321
npm run build        # build for Vercel (~10s)
npm run preview      # preview build locally
npm run db:generate  # generate Drizzle migrations
npm run db:migrate   # run migrations against Turso
npm run db:studio    # browse database
```

## Cross-Project Tickets

Bug/feature exchange with native-ui lives in `../../dev-ops/TICKETS/`. Index: `TICKET-AGENT.md`. To file a ticket: create `T{next}-{slug}.md` and add a row to the index.
