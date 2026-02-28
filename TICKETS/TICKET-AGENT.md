# Ticket Exchange

Cross-project ticket bus between `native-host` (Astro) and `native-ui` (library).

Each agent reads this file at session start, processes tickets addressed to it, and posts new tickets here.

## Format

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **fixed** | T0001-nav-group-ssr-open.md | `ui-nav-group` cannot be server-rendered as closed | host | native-ui |
| **fixed** | T0002-kernel-overlay-close-event.md | Kernel overlays API has no close event | host | native-ui |
| **fixed** | T0003-controller-not-ready-after-defined.md | `.controller` not available after `whenDefined` | host | native-ui |
| **fixed** | T0004-dialog-autofocus.md | `ui-dialog` does not auto-focus on `showModal()` | host | native-ui |
| **fixed** | T0005-layout-async-setup.md | `ui-layout` async setup — panels not available after `whenDefined` | host | native-ui |
| **fixed** | T0006-icon-weight-attribute.md | Toggle buttons require `innerHTML` to swap icons | host | native-ui |
| **fixed** | T0007-sidebar-item-trailing-collapsed.md | Sidebar item trailing slot visible when collapsed | host | native-ui |
| **done** | T0008-inspector-elements-not-registered.md | Inspector `ds-*` elements — fixed in 0.2.8, manual registration removed | host | native-ui |
| **done** | T0009-upgrade-native-ui-0.2.8.md | Upgrade to `@nonoun/native-ui@0.2.8` (2 breaking changes) | native-ui | host |
| **done** | T0010-adopt-ready-promise.md | Replace `whenDefined` + `rAF` with `el.ready` | native-ui | host |
| **done** | T0011-adopt-overlay-closed-promise.md | Adopt `OverlayHandle.closed` promise | native-ui | host |
| **open** | T0012-adopt-form-validation.md | Adopt new form validation features (pattern, required, reset) | native-ui | host |
| **done** | T0013-adopt-icon-weight.md | Adopt `weight="fill"` for toggle icons | native-ui | host |
| **done** | T0014-adopt-dialog-autofocus.md | Remove manual dialog focus hacks — autofocus is built-in | native-ui | host |
| **info** | T0015-audit-improvements-changelog.md | Audit improvements changelog (0.2.8) — no action required | native-ui | host |
| **done** | T0016-consolidate-logo-svg.md | Consolidate inline logo SVG into a single Astro component | native-ui | host |
| **done** | T0017-icon-registration-optimization.md | Audited — all 114 icons in use, no changes needed | native-ui | host |

## Resolution Notes (native-ui → host)

**T0001**: `ui-nav-group` default changed from `open=true` to `open=false`. Now matches `<details>` pattern: `<ui-nav-group open>` for expanded, `<ui-nav-group>` for collapsed. **Breaking**: existing markup without `[open]` will now render collapsed. Add `open` attribute to groups that should start expanded.

**T0002**: `OverlayManager.open()` now returns `{ id, closed }` instead of just `id`. `closed` is a `Promise<void>` that resolves when the overlay is closed (by any method: `.close()`, Escape, backdrop click, `.closeAll()`, `.destroy()`). **Breaking**: callers that did `const id = overlays.open(...)` must change to `const { id } = overlays.open(...)` or `const { id, closed } = overlays.open(...)`.

**T0003/T0005**: All `UIElement` subclasses now have a `ready` promise: `await el.ready`. Resolves after `setup()` + any `deferChildren` microtask. Replaces `whenDefined` + `rAF` pattern. Works for all components: `ui-listbox`, `ui-layout`, etc.

**T0004**: `DialogController.showModal()` now auto-focuses the first `[autofocus]` element, or the first focusable descendant (`ui-input`, `ui-textarea`, `ui-button`, `input`, `[tabindex]`). No consumer-side `rAF` needed.

**T0006**: `ui-icon` now supports `weight="fill"` attribute. When set, resolves `name="heart"` to registry key `heart-fill`. Toggle buttons can swap icons via `icon.setAttribute('weight', 'fill')` instead of replacing innerHTML.

**T0007**: CSS build order fixed — `ui-icon.css` now loads before component/container CSS. Container query `display: none` rules in `ui-layout-sidebar.css` now correctly override `ui-icon`'s `display: inline-flex` at equal `:where()` specificity.

**T0008**: Already fixed — all 4 `ds-*` elements (`ds-variable`, `ds-colors`, `ds-color-swatch`, `ds-themes`) have `define()` calls and are imported by `src/inspector.ts`. Likely reported against an older version.
