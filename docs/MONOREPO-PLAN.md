# Monorepo Transition Plan

## Current State

```
/nonoun/                          ← NOT a monorepo root (no package.json)
├── native-ui/                    ← monorepo, npm workspaces: packages/*
│   ├── packages/
│   │   ├── native-ai/            → @nonoun/native-ai
│   │   ├── native-cdn/           → (internal)
│   │   ├── native-code/          → @nonoun/native-code
│   │   ├── native-core/          → (internal, base classes)
│   │   ├── native-dashboard/     → @nonoun/native-dashboard
│   │   ├── native-data-viz/      → @nonoun/native-data-viz
│   │   ├── native-design/        → @nonoun/native-design
│   │   ├── native-kernel/        → (internal, signal runtime)
│   │   └── native-traits/        → (internal, re-exported by native-ui)
│   └── package.json              workspaces: ["packages/*"]
│                                 remote: git@github.com:kimgranlund/native-ui.git
│
├── native-host/                  ← standalone Astro app (this repo)
│   └── package.json              consumes 6 @nonoun/* packages from npm
│                                 remote: https://github.com/kimgranlund/native-host.git
│
├── nonoun-chat/                  ← private, local-only (no remote)
├── nonoun-css/                   ← private, local-only (no remote)
├── nonoun-functional/            ← private, local-only (no remote)
├── nonoun-ui/                    ← private, local-only (no remote)
└── _archive/
```

### Pain Points the Monorepo Solves

1. **Version upgrade friction** — every native-ui change requires npm publish → npm install in native-host before testing. Builder CSS must be source-copied manually.
2. **Cross-repo tickets** — bugs found in native-host that need native-ui fixes require a separate checkout, branch, fix, publish, upgrade cycle.
3. **Builder source-copy pattern** — a2ui-builder TS/CSS/JSON are manually synced from native-ai source to native-host. In a monorepo, the host could import directly from source.
4. **Storybook isolation** — Storybook (T0169) currently lives in native-ui but needs host-level integration testing context.
5. **No atomic cross-repo commits** — a component API change and its host migration can't land in one commit.

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
│   ├── native-code/
│   ├── native-core/
│   ├── native-dashboard/
│   ├── native-data-viz/
│   ├── native-design/
│   ├── native-kernel/
│   ├── native-traits/
│   └── native-cdn/
├── dev-ops/                      ← stays at root (already here)
│   └── TICKETS/
└── _archive/
```

The four local-only repos (`nonoun-chat`, `nonoun-css`, `nonoun-functional`, `nonoun-ui`) are not included. They have no remotes and appear to be legacy/experimental. Archive or leave in place.

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

4. **Create root `package.json`:**
   ```json
   {
     "name": "nonoun",
     "private": true,
     "workspaces": ["packages/*", "apps/*"]
   }
   ```

5. **Update native-host's `package.json`:**
   - Change `@nonoun/*` dependency versions from `^0.7.150` (npm) to `workspace:*` (local resolution).
   - Remove any `file:` or version-pinned references.

6. **Run `npm install`** from root — verify hoisted `node_modules` resolves all workspaces.

7. **Verify builds:**
   ```bash
   cd apps/native-host && npm run build   # Astro build
   cd packages/native-ai && npm run build  # (if applicable)
   ```

### Phase 2 — Eliminate Source-Copy Pattern

**Goal:** native-host imports builder files directly from native-ai source, no more manual sync.

1. **Replace copied builder files** in `apps/native-host/src/pages/showcase/a2ui-builder/`:
   - `a2ui-builder.css` → `@import '../../../../packages/native-ai/src/a2ui/builder/a2ui-builder.css'` with a small host override sheet
   - `a2ui-builder.ts` → import from source path, apply host adaptations via a thin wrapper
   - `system-prompt.json` → import directly from source

2. **Document the 6 host adaptations** as a checklist in the wrapper module (icon registration, npm paths, proxy API key, astro:page-load, REGISTRY, ConfettiController).

3. **Bring dev-server pages into native-host** — two internal reference pages currently live in native-ui's dev server (`src/styles/`) and should move into the Astro host where they can be served as proper pages:

   | Source (native-ui) | Destination (native-host) |
   |---|---|
   | `src/styles/state-grid.html` | `apps/native-host/src/pages/styles/state-grid/index.astro` |
   | `src/styles/state-grid.demo.ts` | `apps/native-host/src/pages/styles/state-grid/state-grid.ts` |
   | `src/styles/state-grid.demo.css` | `apps/native-host/src/pages/styles/state-grid/state-grid.css` |
   | `src/styles/reference.html` | `apps/native-host/src/pages/styles/reference/index.astro` |
   | `src/styles/reference.demo.ts` | `apps/native-host/src/pages/styles/reference/reference.ts` |
   | `src/styles/reference.demo.css` | `apps/native-host/src/pages/styles/reference/reference.css` |

   Migration steps:
   - Convert each `.html` to `.astro` (wrap in `SidebarLayout`, add frontmatter)
   - Rename `.demo.ts` → `{name}.ts`, `.demo.css` → `{name}.css` (co-located folder pattern)
   - Update import paths to use workspace-relative `@nonoun/*` imports
   - Add pages to sidebar nav under a "Styles" or "Internals" group
   - Remove originals from native-ui `src/styles/` after migration

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
- [ ] Remove builder source-copy documentation from MEMORY.md

---

## Risk Assessment

| Risk | Mitigation |
|---|---|
| **Lost git history** | Use `git filter-repo` with `--to-subdirectory-filter` to preserve full history for both repos |
| **Broken Vercel deployment** | Update Vercel root directory setting to `apps/native-host` before merging |
| **npm workspace resolution issues** | Test `workspace:*` resolution locally before pushing; keep npm-published versions as fallback |
| **Path breakage in imports** | All `@nonoun/*` imports stay the same (workspace resolution is transparent); only relative paths (like `../../dev-ops/TICKETS/`) need updating |
| **Claude Code context** | Update all `CLAUDE.md` files and memory entries after migration |

## Decision Points

1. **Build orchestrator?** Start without one. Add Turborepo if builds take >30s.
2. **Continue npm publishing?** Only if external consumers exist. If native-host is the sole consumer, `workspace:*` is simpler.
3. **Include sibling repos?** No. `nonoun-chat`, `nonoun-css`, `nonoun-functional`, `nonoun-ui` are local-only with no remotes — keep them separate or archive.
4. **New GitHub repo or reuse?** Create a new `nonoun-mono` repo. Archive the two originals.
