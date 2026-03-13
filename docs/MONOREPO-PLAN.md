# Monorepo Transition Plan

> Last updated: 2026-03-12

## Current State

```
/nonoun/                          ← NOT a monorepo root (no package.json)
├── native-ui/                    ← monorepo, npm workspaces: packages/*
│   ├── src/                      ← ~45 UI components + containers + styles demos
│   ├── packages/
│   │   ├── native-ai/            → @nonoun/native-ai@1.0.128
│   │   ├── native-cdn/           → (internal)
│   │   ├── native-code/          → @nonoun/native-code@1.0.12
│   │   ├── native-core/          → (internal, reactivity + element base)
│   │   ├── native-dashboard/     → @nonoun/native-dashboard@0.4.23
│   │   ├── native-data-viz/      → @nonoun/native-data-viz@0.2.5
│   │   ├── native-design/        → @nonoun/native-design@0.6.7
│   │   ├── native-kernel/        → (internal, GenUI engine)
│   │   └── native-traits/        → @nonoun/native-traits@0.1.15
│   └── package.json              workspaces: ["packages/*"]
│                                 remote: git@github.com:kimgranlund/native-ui.git
│
├── native-host/                  ← standalone Astro app (this repo)
│   └── package.json              consumes 7 @nonoun/* packages from npm
│                                 remote: https://github.com/kimgranlund/native-host.git
│
├── dev-ops/                      ← cross-project tickets
│   └── TICKETS/
├── nonoun-chat/                  ← private, local-only (no remote)
├── nonoun-css/                   ← private, local-only (no remote)
├── nonoun-functional/            ← private, local-only (no remote)
├── nonoun-ui/                    ← private, local-only (no remote)
└── _archive/
```

### Foundational Systems Inventory

These are the internal packages that power the entire stack. In the monorepo, they become workspace siblings instead of npm-published dependencies.

#### native-core (reactivity + element base)
- **Reactivity:** `signal`, `computed`, `effect`, `batch`, `untrack` — graph-based dependency tracking with automatic cleanup
- **NativeElement:** Base HTMLElement with lifecycle (setup/teardown), effect auto-disposal, trait controller protocol
- **ReactiveProp:** Attribute-bound signals — `prop(this, 'disabled', { type: 'boolean' })`
- **Context:** `ContextProvider`/`ContextConsumer` mixins — event-driven context bubbling
- **DataListController:** List data management — filtering, sorting, selection, empty state
- **Registries:** trait registry, plugin registry, icon registry

#### native-kernel (GenUI engine)
- **CommandBus:** pub/sub with handlers, filters, middleware, undo/redo history
- **WorkflowEngine:** xstate-like state machine with signals for currentState, context, history
- **Planner:** converts UIIntent → UIPlan with accessibility auditing
- **SCHEMA_CATALOG:** pre-defined schemas for all components (attributes, slots, events, aria)
- **DataStore:** HTTP fetches with caching, retries, abort handling
- **PolicyEngine:** capability-based access control + rate limiting
- **Workflow templates:** formWizard, confirmFlow, crudLifecycle, authFlow, toggleFlow

#### native-traits (45+ behavior controllers)
- **Interaction:** PressController, HoverController, DragController, SwipeController, TossController
- **Selection:** SelectionController, RangeSelectController, SortController, VirtualScrollController
- **UI behavior:** PopoverController, DialogController, CollapsibleController, FocusTrapController, ToastController
- **Text editing:** SlashCommandController, MentionController, BacktickWrapController, LinkPasteController
- **Advanced:** CSSInspectController, ConfettiController, NoodleController, ParallaxController, MagnetController
- **Runtime:** TraitRuntime singleton (DismissStack, GestureRouter), adapter pattern with conflict detection

### Page Coverage Audit (2026-03-12)

**122 of 128** native-ui HTML demos already have 1:1 Astro equivalents in native-host.

Missing pages (6):

| Native-UI Demo | Category | Priority |
|---|---|---|
| `src/styles/ui.html` | Style reference | Low — superseded by existing reference.astro |
| `src/components/gripper/n-gripper.html` | Component | Low — internal resize handle |
| `packages/native-ai/src/a2ui/a2ui-protocol.html` | A2UI docs | Medium — protocol reference |
| `packages/native-ai/src/a2ui/a2a-catalog.html` | A2A | Medium — catalog viewer |
| `packages/native-ai/src/a2ui/a2a-ownership.html` | A2A | Medium — ownership demo |
| `packages/native-ai/src/a2ui/a2a-sessions.html` | A2A | Medium — sessions demo |

### Pain Points the Monorepo Solves

1. **Version upgrade friction** — every native-ui change requires npm publish → npm install in native-host before testing. Currently at native-ui@0.7.221, native-ai@1.0.128 — upgrades happen weekly.
2. **Cross-repo tickets** — bugs found in native-host that need native-ui fixes require a separate checkout, branch, fix, publish, upgrade cycle. T0258 (missing npm exports for `parseJsonFromResponse`, `stripFences`, `matchPatterns`, `CatalogEntry`) is a current example — would be moot in a monorepo.
3. **Source-copy pattern (2 pages)** — both a2ui-builder AND a2ui-training are manually synced from native-ai source to native-host (~1600 lines each, 6 host adaptations per page). In a monorepo, both could import directly from source.
4. **Shared pipeline module** — `pipeline.ts` is shared between builder and training library via relative import (`../a2ui-builder/pipeline.ts`). In a monorepo, both would import from `packages/native-ai/src/`.
5. **Storybook isolation** — Storybook (T0169) currently lives in native-ui but needs host-level integration testing context.
6. **No atomic cross-repo commits** — a component API change and its host migration can't land in one commit.

### What a Monorepo Does NOT Solve

- CI/CD for unrelated sibling repos (nonoun-chat, nonoun-css, etc.) — these are independent projects and should stay separate unless they share dependencies with native-ui.
- npm publishing workflow — @nonoun/* packages still need to be published for external consumers (if any exist beyond native-host).

---

## Proposed Structure

```
/nonoun/                          ← monorepo root
├── package.json                  workspaces: ["packages/*", "apps/*"]
├── apps/
│   └── native-host/             ← this Astro app (moved from top-level)
├── packages/
│   ├── native-ai/               ← moved from native-ui/packages/
│   ├── native-cdn/
│   ├── native-code/
│   ├── native-core/             ← reactivity, element base, context, registries
│   ├── native-dashboard/
│   ├── native-data-viz/
│   ├── native-design/
│   ├── native-kernel/           ← command bus, workflow, planner, schema catalog
│   ├── native-traits/           ← 45+ behavior controllers
│   └── native-ui/               ← components + aggregator (re-exports core/kernel/traits)
├── dev-ops/                      ← moved from /nonoun/dev-ops/
│   └── TICKETS/
└── _archive/
```

The four local-only repos (`nonoun-chat`, `nonoun-css`, `nonoun-functional`, `nonoun-ui`) are not included. They have no remotes and appear to be legacy/experimental. Archive or leave in place.

**Key difference from native-ui's current structure:** native-ui's `src/` (components, containers, styles demos, index.ts, register-all.ts) becomes `packages/native-ui/` — the aggregator package that re-exports core + kernel + traits + components.

---

## Migration Phases

### Phase 0 — Prerequisites (do first)

- [ ] **Audit external consumers**: Confirm native-host is the only consumer of `@nonoun/*` packages. If external consumers exist, npm publishing must continue.
- [ ] **Freeze feature work** on both repos for the duration of Phase 1 (~1 day).
- [ ] **Ensure both repos are clean**: all work committed, no dangling branches.

### Phase 1 — Structural Merge

**Goal:** Single git repo, two workspace groups (`apps/*`, `packages/*`), working `npm install`.

1. **Create the monorepo root:**
   ```bash
   cd /nonoun
   git init nonoun-mono
   cd nonoun-mono
   ```

2. **Import native-ui with full history:**
   ```bash
   git remote add native-ui ../native-ui
   git fetch native-ui
   git merge native-ui/main --allow-unrelated-histories -m "Import native-ui history"
   # Move packages/* to top level (they're already there)
   # Move src/ into packages/native-ui/ (the aggregator package)
   # Remove native-ui's root package.json, replace with monorepo root
   ```

3. **Import native-host with full history into `apps/native-host/`:**
   ```bash
   # In native-host, rewrite paths into apps/native-host/ prefix
   cd ../native-host
   git filter-repo --to-subdirectory-filter apps/native-host

   cd ../nonoun-mono
   git remote add native-host ../native-host
   git fetch native-host
   git merge native-host/main --allow-unrelated-histories -m "Import native-host history"
   ```

4. **Import dev-ops:**
   ```bash
   git remote add dev-ops ../dev-ops
   git fetch dev-ops
   git merge dev-ops/main --allow-unrelated-histories -m "Import dev-ops history"
   # dev-ops/TICKETS/ is already at root level
   ```

5. **Create root `package.json`:**
   ```json
   {
     "name": "nonoun",
     "private": true,
     "workspaces": ["packages/*", "apps/*"]
   }
   ```

6. **Update native-host's `package.json`:**
   - Change `@nonoun/*` dependency versions from `^0.7.221` (npm) to `workspace:*` (local resolution).
   - Remove any `file:` or version-pinned references.

7. **Run `npm install`** from root — verify hoisted `node_modules` resolves all workspaces.

8. **Verify builds:**
   ```bash
   cd apps/native-host && npm run build   # Astro build
   cd packages/native-ai && npm run build  # (if applicable)
   ```

### Phase 2 — Eliminate Source-Copy Pattern

**Goal:** native-host imports builder and training library files directly from source, no more manual sync.

#### A. Builder (`a2ui-builder/`)

1. **Replace copied builder files** in `apps/native-host/src/pages/showcase/a2ui-builder/`:
   - `a2ui-builder.css` → `@import '../../../../packages/native-ai/src/a2ui/builder/a2ui-builder.css'` with a small host override sheet
   - `a2ui-builder.ts` → import from source path, apply host adaptations via a thin wrapper
   - `system-prompt.json` → import directly from source

#### B. Training Library (`a2ui-training/`)

2. **Replace copied training library files** in `apps/native-host/src/pages/showcase/a2ui-training/`:
   - `training-library.css` → `@import '../../../../packages/native-ai/src/a2ui/training-library.demo.css'` with host overrides
   - `training-library.ts` → import from source path, apply host adaptations via thin wrapper
   - `copilot-prompt.json` → import directly from source

#### C. Shared pipeline

3. **Remove local `pipeline.ts` copy** from `a2ui-builder/` — both builder and training library import directly from `packages/native-ai/src/a2ui/builder/pipeline.ts`.

#### D. Host adaptations (6 per page)

4. **Document the 6 host adaptations** as a checklist in each wrapper module:
   1. No icon/registration imports (handled by `setup.ts`)
   2. npm package paths → workspace-relative paths
   3. `apiKey: 'proxy'` for LLM adapters
   4. `astro:page-load` wrapper with element guard
   5. REGISTRY from npm `COMPONENT_MAP` export
   6. Package-specific (ConfettiController for builder, Pipeline for training library)

#### E. Dev-server pages

5. **Bring remaining dev-server pages into native-host** — reference pages currently in native-ui's dev server:

   | Source (native-ui) | Destination (native-host) |
   |---|---|
   | `src/styles/state-grid.html` | `apps/native-host/src/pages/styles/state-grid/index.astro` |
   | `src/styles/state-grid.demo.ts` | `apps/native-host/src/pages/styles/state-grid/state-grid.ts` |
   | `src/styles/state-grid.demo.css` | `apps/native-host/src/pages/styles/state-grid/state-grid.css` |
   | `src/styles/reference.html` | `apps/native-host/src/pages/styles/reference/index.astro` |
   | `src/styles/reference.demo.ts` | `apps/native-host/src/pages/styles/reference/reference.ts` |
   | `src/styles/reference.demo.css` | `apps/native-host/src/pages/styles/reference/reference.css` |

   Note: `state-grid.astro` and `reference.astro` already exist in native-host as flat files. Convert to co-located folders if they have associated TS/CSS.

#### F. Missing pages (optional, low priority)

6. **Port remaining 6 demos** when needed:
   - `gripper` → `/components/gripper/index.astro`
   - `ui.html` → `/styles/ui/index.astro` (if not redundant with reference)
   - `a2ui-protocol` → `/a2ui/a2ui-protocol.astro`
   - `a2a-catalog`, `a2a-ownership`, `a2a-sessions` → `/showcase/a2a-*.astro`

### Phase 3 — Tooling & CI

**Goal:** Shared tooling, single CI pipeline, coordinated releases.

1. **Turborepo or Nx** (optional): Add a build orchestrator if build times become a concern. For now, npm workspaces + scripts may suffice.

2. **CI pipeline** (GitHub Actions):
   - Single workflow triggered on push to main
   - Matrix strategy: `packages/*` run lint/test, `apps/native-host` runs build
   - Cache `node_modules` and Astro build artifacts

3. **Changesets** (optional): If npm publishing continues, use `@changesets/cli` for versioning:
   ```bash
   npx changeset   # developer describes change
   npx changeset version  # bumps versions
   npx changeset publish  # publishes to npm
   ```

4. **Deployment**: native-host Vercel project points to `apps/native-host/` root directory in Vercel project settings.

### Phase 4 — Cleanup

- [ ] Archive old `native-ui` and `native-host` repos on GitHub (mark read-only)
- [ ] Update all `CLAUDE.md` and `docs/` references to new paths
- [ ] Update `dev-ops/TICKETS/` paths (now at monorepo root)
- [ ] Update git remotes in any local tooling or scripts
- [ ] Remove builder + training library source-copy documentation from MEMORY.md
- [ ] Close T0258 (missing npm exports — no longer needed with workspace resolution)
- [ ] Close T0170 if co-located folder pattern is fully adopted

---

## Risk Assessment

| Risk | Mitigation |
|---|---|
| **Lost git history** | Use `git filter-repo` with `--to-subdirectory-filter` to preserve full history for both repos |
| **Broken Vercel deployment** | Update Vercel root directory setting to `apps/native-host` before merging |
| **npm workspace resolution issues** | Test `workspace:*` resolution locally before pushing; keep npm-published versions as fallback |
| **Path breakage in imports** | All `@nonoun/*` imports stay the same (workspace resolution is transparent); only relative paths (like `../../dev-ops/TICKETS/`) need updating |
| **Claude Code context** | Update all `CLAUDE.md` files and memory entries after migration |
| **native-ui src/ restructure** | Moving `src/` → `packages/native-ui/` may break internal dev-server references; test Vite dev server after move |

## Decision Points

1. **Build orchestrator?** Start without one. Add Turborepo if builds take >30s.
2. **Continue npm publishing?** Only if external consumers exist. If native-host is the sole consumer, `workspace:*` is simpler.
3. **Include sibling repos?** No. `nonoun-chat`, `nonoun-css`, `nonoun-functional`, `nonoun-ui` are local-only with no remotes — keep them separate or archive.
4. **New GitHub repo or reuse?** Create a new `nonoun-mono` repo. Archive the two originals.
5. **dev-ops inclusion?** Yes — import with full history. Cross-project tickets benefit from living in the same repo.

## What Does NOT Need Migration

The foundational systems (signals, reactivity, context, store, kernel, traits) require **zero code changes**. They move from npm `node_modules` resolution to `workspace:*` resolution — the import specifiers (`@nonoun/native-ui`, `@nonoun/native-ai`, etc.) are identical. Only the version field in `package.json` changes (e.g., `"^0.7.221"` → `"workspace:*"`).
