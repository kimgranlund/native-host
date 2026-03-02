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
| **fixed** | T0008-inspector-elements-not-registered.md | Inspector `ds-*` elements NOT registered — still broken in 0.2.8 | host | native-ui |
| **done** | T0009-upgrade-native-ui-0.2.8.md | Upgrade to `@nonoun/native-ui@0.2.8` (2 breaking changes) | native-ui | host |
| **done** | T0010-adopt-ready-promise.md | Replace `whenDefined` + `rAF` with `el.ready` | native-ui | host |
| **done** | T0011-adopt-overlay-closed-promise.md | Adopt `OverlayHandle.closed` promise | native-ui | host |
| **done** | T0012-adopt-form-validation.md | Adopt new form validation features (pattern, required, reset) | native-ui | host |
| **done** | T0013-adopt-icon-weight.md | Adopt `weight="fill"` for toggle icons | native-ui | host |
| **done** | T0014-adopt-dialog-autofocus.md | Remove manual dialog focus hacks — autofocus is built-in | native-ui | host |
| **info** | T0015-audit-improvements-changelog.md | Audit improvements changelog (0.2.8) — no action required | native-ui | host |
| **done** | T0016-consolidate-logo-svg.md | Consolidate inline logo SVG into a single Astro component | native-ui | host |
| **done** | T0017-icon-registration-optimization.md | Audited — all 114 icons in use, no changes needed | native-ui | host |
| **done** | T0018-draggable-preview-grid-animation.md | Preview mode requires consumer-side view-transition wiring for grid animation | host | native-ui |
| **done** | T0019-inspector-component.md | Ship `<ds-inspector>` as a self-registering component (supersedes T0008) | host | native-ui |
| **fixed** | T0020-drag-controller-abort-error.md | DragController leaks unhandled AbortError on rapid drag in preview mode | host | native-ui |
| **done** | T0021-extract-nui-tokens.md | Inspector extracted to `@nonoun/nui-tokens` — upgrade to `@nonoun/native-ui@0.4.0` | native-ui | host |
| **done** | T0022-adopt-nui-app-package.md | Layout components extracted to `@nonoun/nui-app` — upgrade to `@nonoun/native-ui@0.4.0` | native-ui | host |
| **done** | T0023-native-ui-0.4.0-features.md | New features and fixes in `@nonoun/native-ui` 0.2.9–0.4.0 | native-ui | host |
| **done** | T0024-upgrade-native-ui-0.5.0.md | Upgrade to `@nonoun/native-ui@0.5.0` — master migration guide | native-ui | host |
| **done** | T0025-rename-html-element-tags.md | Rename all HTML element tags: `ui-*` → `n-*` | native-ui | host |
| **done** | T0026-rename-css-tokens.md | Rename all CSS custom properties: `--ui-*`/`--_*` → `--n-*` | native-ui | host |
| **done** | T0027-rename-events.md | Rename all custom events: `ui-*` → `native:*` | native-ui | host |
| **done** | T0028-rename-js-imports.md | Rename JS class imports: `UI*` → `N*` | native-ui | host |
| **done** | T0029-rename-packages.md | Rename package dependencies: `nui-*` → `native-*` | native-ui | host |
| **done** | T0030-rename-native-app-elements.md | Migrate native-app sidebar elements: `nui-*` → `n-*` | native-ui | host |
| **done** | T0031-new-features-0.5.0.md | New features, bug fixes, and visual changes in v0.5.0 | native-ui | host |
| **fixed** | T0032-native-packages-broken-exports.md | `@nonoun/native-app` and `@nonoun/native-tokens` have broken exports | host | native-ui |
| **done** | T0033-upgrade-native-ui-0.5.1.md | Upgrade to `@nonoun/native-ui@0.5.1` and all sub-packages | native-ui | host |

Resolution notes for closed tickets are in [TICKET-LOG.md](TICKET-LOG.md).
