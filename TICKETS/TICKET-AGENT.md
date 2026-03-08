# Ticket Exchange

Cross-project ticket bus between `native-host` (Astro) and `native-ui` (library).

## Flow

- **Bug reports**: File ticket → fix → upgrade → close
- **New features**: Contract ticket (before implementation) → review → develop → publish → close
- **Upgrades**: No ticket needed — use CHANGELOG.md. Breaking changes get a `## Breaking` section with migration steps.
- **Process/architecture**: Full ticket as needed

Each agent reads this file at session start, processes tickets addressed to it, and posts new tickets here.

## Open

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **open** | T0152-upgrade-native-ui-0.7.64.md | Consolidated upgrade to native-ui@0.7.64 — sub-container reversal, container consolidation, CSS-only elements (badge/avatar/kbd/stack/grid/divider keep tags, remove JS). **Supersedes T0145–T0151.** | native-ui | host |
| **fixed** | T0153-native-ai-stale-imports.md | `native-ai` stale `NBadge`/`NCard` imports — fixed in `native-ai@1.0.9` (rebuilt from clean source). | host | native-ui |
| **open** | T0154-noodle-controller-trait.md | New trait: NoodleController / noodleable — SVG noodle connections between DOM elements. Ships in native-ui@0.7.64. | native-ui | host |
| **open** | T0155-bare-element-selector-migration.md | Bare HTML element selector migration — `<article>` → `<n-container>`, `<hr>` → `<n-divider>`, layout `<aside>` → `<n-aside>`. Ships in native-ui@0.7.66. | native-ui | host |
| **open** | T0156-upgrade-native-ai-1.0.11.md | Upgrade to `@nonoun/native-ai@1.0.13` — SCHEMA pane, Card sub-container pattern (Header/Body/Footer), component map fixes | native-ui | host |
| **fixed** | T0135-semantic-layout-parity-gaps.md | Semantic layout CSS parity gaps — padding/gap variables + [show-scrollbar] fix. Fixed in dashboard@0.4.6. | host | native-ui |
| **fixed** | T0136-semantic-nav-breadcrumb-gaps.md | Semantic nav gaps — leading flex, min-width guard, slot trailing. Fixed in dashboard@0.4.6. | host | native-ui |
| **fixed** | T0137-dashboard-css-hardcoded-values.md | Dashboard CSS hardcoded magic numbers → CSS variables. Fixed in dashboard@0.4.6. Dead CE CSS kept for compat. | host | native-ui |
| **fixed** | T0138-semantic-aside-panels.md | Semantic aside support — full `<aside>` rules in section.content. Fixed in dashboard@0.4.6. | host | native-ui |
| **fixed** | T0139-dom-architecture-alignment.md | DOM architecture alignment — canonical page templates, CSS contract, what package owns vs host. Fixed in native-ui@0.7.61 + dashboard@0.4.7. | host | native-ui |
| **fixed** | T0140-content-typography-stylesheet.md | Opt-in content typography stylesheet — `main h1/h2/h3` using design tokens. Fixed in dashboard@0.4.7. | host | native-ui |
| **fixed** | T0141-data-slot-header-layout.md | Ship `data-slot` layout rules for `main > header` — flex layout for title/leading/content/actions/description. Fixed in dashboard@0.4.7. | host | native-ui |
| **fixed** | T0142-base-layer-stylesheet.md | Base layer stylesheet — box-sizing reset, body defaults, reduced-motion `--n-duration: 0s`. Fixed in native-ui@0.7.61. | host | native-ui |
| **fixed** | T0143-collapsed-sidebar-badge-dots.md | Collapsed sidebar badge indicator dots — package should own `[data-has-badges]` visual treatment. Fixed in dashboard@0.4.7. | host | native-ui |

## Superseded by T0152

| Status | File | Superseded by |
|--------|------|---------------|
| **superseded** | T0145-article-migration.md | T0152 |
| **superseded** | T0146-css-architecture-overhaul.md | T0152 |
| **superseded** | T0147-css-source-reorganization.md | T0152 |
| **superseded** | T0148-css-dist-bundle-split.md | T0152 |
| **superseded** | T0149-container-to-component-moves.md | T0152 |
| **superseded** | T0150-prose-rename-text-delete.md | T0152 |
| **superseded** | T0151-sub-container-reversal.md | T0152 |

## Recently Closed

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **done** | T0134-semantic-layout-migration.md | Semantic layout migration — `n-dashboard-breadcrumb`/`n-dashboard-canvas`/`n-dashboard-panel` → `<nav>`/`<section class="content">`/`<main>`. Migrated SidebarLayout, layout.ts, setup.ts, layout-blocks.css, demo.css. Removed stub registration. | native-ui | host |
| **done** | T0133-semantic-container-migration.md | Semantic container migration — `n-header`/`n-body`/`n-footer` → `<header>`/`<section>`/`<footer>`. Upgraded packages, migrated 52 files, zero old tags remain. | native-ui | host |
| **fixed** | T0132-sidebar-section-header-element.md | Sidebar section header element — `<n-option-group-header>` is wrong element, causes collapsed sidebar rendering bug. Fixed in dashboard@0.4.4: new `<n-sidebar-section-label>` element. Host migrated. | host | native-ui |
| **fixed** | T0131-dashboard-tag-name-broken-in-dist.md | Multiple packages have broken dist — wrong tag names, empty register.js files, missing define() calls (dashboard, ai, code, design). Fixed in ai@1.0.4, code@1.0.4, dashboard@0.4.4. | host | native-ui |

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **done** | T0130-package-consolidation-migration.md | Package consolidation migration — 10 packages → 7 (renames + merges, all imports change). Bumped to 0.4.3 (0.4.2 had broken tag name) | native-ui | host |
| **done** | T0129-upgrade-native-ui-0.7.45.md | Upgrade to `@nonoun/native-ui@0.7.45` + `@nonoun/native-app@0.3.19` — 6 fun traits + `data-trait-*` namespace (breaking) | native-ui | host |

## Closed (T0001–T0128)

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **done** | T0128-upgrade-native-ui-0.7.40.md | Upgrade to `@nonoun/native-ui@0.7.40` + `@nonoun/native-app@0.3.18` — user-select cleanup | native-ui | host |
| **done** | T0127-adopt-a2a-tictactoe-showcase.md | Adopt A2A Tic-Tac-Toe showcase for public website — full implementation guide | native-ui | host |
| **done** | T0126-upgrade-native-ui-0.7.39.md | Upgrade to `@nonoun/native-ui@0.7.39` — DragController grid fix (slot + drop modes) | native-ui | host |
| **done** | T0125-upgrade-native-ui-0.7.37.md | Upgrade to `@nonoun/native-ui@0.7.37` + `@nonoun/native-a2ui@0.2.2` — A2UI session layer, tic-tac-toe, 3 breaking CSS changes | native-ui | host |
| **done** | T0124-upgrade-native-chat-0.5.24.md | Upgrade to `@nonoun/native-chat@0.5.24` — `.n-chat-starter` preset, compact variant | native-ui | host |
| **done** | T0123-upgrade-native-ui-0.7.38.md | Upgrade to `@nonoun/native-ui@0.7.38` + `@nonoun/native-a2ui@0.2.3` — A2UI fixes, stack gap | native-ui | host |

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **fixed** | T0122-teardown-null-destroy.md | Teardown `destroy()` crashes on null controller reference during View Transition swap | host | native-ui |
| **done** | T0120-upgrade-native-ui-0.7.33.md | Upgrade to `@nonoun/native-ui@0.7.33` — diagnostic logging for drag/drop SSR debugging | native-ui | host |
| **fixed** | T0121-draggable-drop-handler-not-firing-after-view-transition.md | `native:drop` handler not firing after View Transition — custom swap was skipping body script transfer | host | host |
| **done** | T0119-upgrade-native-ui-0.7.31.md | Upgrade to `@nonoun/native-ui@0.7.31` — trait/controller SSR hydration hardening | native-ui | host |
| **fixed** | T0117-drop-mode-swap-not-persisting.md | Drop mode swap not persisting — fixed in 0.7.30 (pointer capture released before dispatch) | host | native-ui |

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **done** | T0116-a2ui-css-missing-from-dist.md | `@nonoun/native-a2ui@0.1.14` CSS missing from published dist — fixed in 0.1.15 | host | native-ui |
| **done** | T0118-a2ui-nested-component-css-broken.md | A2UI segmented control unstyled — fixed in 0.1.15 (missing `inline` attr + CSS token overrides) | host | native-ui |
| **done** | T0113-upgrade-native-ui-0.7.29.md | Upgrade to `@nonoun/native-ui@0.7.29` + all sub-packages | native-ui | host |
| **done** | T0114-native-chat-0.5.21-migration.md | `@nonoun/native-chat@0.5.21` migration — no breaking selectors/imports found in host | native-ui | host |
| **done** | T0115-astro-host-adoption-0.7.29.md | Astro host adoption guide — workarounds removed, chat declarative attrs adopted | native-ui | host |
| **fixed** | T0111-n-stack-direction-row-broken.md | `n-stack[direction="row"]` not rendering as row — fixed in 0.7.29 + full `@layer` audit (9 containers) | host | native-ui |
| **fixed** | T0112-traits-broken-after-view-transition.md | Traits not fully functional after View Transition — fixed in 0.7.29 (pointer capture + hardened lifecycle) | host | native-ui |
| **fixed** | T0110-ecosystem-principles-audit.md | Ecosystem-wide principles compliance audit | native-ui | native-ui |
| **fixed** | T0109-native-chat-principles-audit.md | native-chat principles alignment audit | native-ui | native-ui |
| **fixed** | T0106-astro-consumer-alignment.md | Align native-ui development with Astro SSR consumer realities | host | native-ui |
| **fixed** | T0107-component-library-guiding-principles.md | Additions to component library core principles | host | native-ui |
| **fixed** | T0108-revised-ticketing-flow.md | Revised cross-project ticketing flow | host | native-ui |

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **done** | T0103-native-chat-server-gateway-integration.md | Implement production server gateway for `@nonoun/native-chat` | native-ui | host |
| **open** | T0104-tokens-panel-aside-transition.md | `native-tokens-panel[aside]` missing open/close transition | host | native-tokens |
| **fixed** | T0105-chat-panel-aside-no-transition.md | `native-chat-panel[aside]` open/close has no visible transition | host | native-chat |

<details>
<summary>103 resolved tickets</summary>

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **done** | T0101-upgrade-native-ui-0.7.24.md | Upgrade to `@nonoun/native-ui@0.7.25` + `@nonoun/native-app@0.3.14` + `@nonoun/native-chat@0.5.16` + `@nonoun/native-chart@0.1.4` + `@nonoun/native-codemirror@0.2.17` | native-ui | host |

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **fixed** | T0102-codemirror-peer-dep-resolution.md | `native-codemirror` peer dep blocks `native-ui` install | host | native-ui |
| **fixed** | T0100-chart-initial-render-dimensions.md | `n-chart` renders with default 400×300 dimensions on initial load | host | native-ui |
| **done** | T0099-upgrade-native-ui-0.7.22.md | Upgrade to `@nonoun/native-ui@0.7.22` + `@nonoun/native-app@0.3.12` | native-ui | host |
| **fixed** | T0098-remove-collapsed-selected-highlight.md | Remove collapsed sidebar selected-section highlight circle | host | native-app |
| **done** | T0097-upgrade-all-packages-0.7.18-release.md | Upgrade all `@nonoun/*` packages — coordinated 0.7.18 release | native-ui | host |
| **done** | T0096-native-chart-package-and-demo-pages.md | New `@nonoun/native-chart` package — SVG charting components | native-ui | host |
| **done** | T0095-upgrade-native-ui-0.7.18.md | Upgrade to `@nonoun/native-ui@0.7.18` | native-ui | host |
| **done** | T0094-upgrade-native-ui-0.7.17.md | Upgrade to `@nonoun/native-ui@0.7.17` + `@nonoun/native-a2ui@0.1.10` + `@nonoun/native-chart@0.1.1` | native-ui | host |
| **done** | T0093-gripper-missing-from-register.md | `n-gripper` not included in `@nonoun/native-ui/register` | host | native-ui |
| **done** | T0092-upgrade-native-chat-0.5.6.md | Upgrade all packages to latest — native-ui 0.7.12, native-chat 0.5.7, native-a2ui 0.1.9, + 5 sub-packages | native-ui | host |
| **done** | T0091-upgrade-native-a2ui-0.1.6.md | Upgrade to `@nonoun/native-a2ui@0.1.9` — stale dist artifact fix | native-ui | host |
| **fixed** | T0090-manipulate-handle-component.md | `<n-manipulate-handle>` component — Popover + Anchor-based manipulation handles | host | native-ui |
| **done** | T0089-upgrade-native-chat-0.5.3.md | Upgrade to `@nonoun/native-chat@0.5.3` — grid layout fix for message action toolbars | native-ui | host |
| **info** | T0088-a2ui-workbench-features-checklist.md | A2UI Workbench — Feature Checklist (`@nonoun/native-a2ui@0.1.5`) | native-ui | host |
| **done** | T0087-upgrade-native-ui-0.7.8.md | Upgrade to `@nonoun/native-ui@0.7.8` + `@nonoun/native-a2ui@0.1.5` + `@nonoun/native-chat@0.5.2` | native-ui | host |
| **fixed** | T0086-no-redundant-class-handles.md | Eliminate redundant class handles on stamped elements — use semantic selectors | host | native-ui |
| **fixed** | T0085-a2ui-icon-registration-gap.md | native-a2ui should register or document required icons | host | native-ui |
| **fixed** | T0084-a2ui-toolbar-text-labels-regression.md | native-a2ui toolbar text labels regression — icon-only instead of icon+text | host | native-ui |
| **done** | T0083-upgrade-native-codemirror-0.2.9.md | Upgrade to `@nonoun/native-codemirror@0.2.9` — flex growth for editor element | native-ui | host |
| **done** | T0082-presentable-a2ui-example.md | Add A2UI workbench as real-world PresentController example on presentable trait page | native-ui | host |
| **fixed** | T0081-a2ui-tsc-rootdir-icons.md | native-a2ui `tsc` fails: icon imports outside rootDir | host | native-ui |
| **done** | T0080-upgrade-native-ui-0.7.7.md | Upgrade to `@nonoun/native-ui@0.7.7` and all sub-packages | native-ui | host |
| **done** | T0079-upgrade-native-ui-0.7.6.md | Upgrade to `@nonoun/native-ui@0.7.6` — PresentController dark backdrop, `[presented]` attribute, `n-pagination-dots` registration | native-ui | host |
| **done** | T0078-upgrade-native-chat-0.4.0.md | Upgrade to `@nonoun/native-chat@0.5.0` — panel APIs, message display, stream/transport, surface tokens | native-ui | host |
| **fixed** | T0077-playground-no-init-on-innerhtml.md | `<native-playground>` blank after client-side navigation (innerHTML insertion) | host | native-ui |
| **fixed** | T0071-component-api-gaps.md | Component API gaps blocking no-CSS rule enforcement (n-field gap, n-body padding, n-avatar group) | host | native-ui |

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **done** | T0076-update-reference-state-grid.md | Update reference & state-grid pages + remove UI Boilerplate | host | host |
| **done** | T0075-fix-blank-codemirror-pages.md | Fix blank CodeMirror package pages — missing `astro:page-load` wrappers | host | host |
| **done** | T0074-collapsed-sidebar-indicators.md | Collapsed sidebar selected state + badge indicator dots | host | host |
| **fixed** | T0073-a2ui-pages-race-condition.md | A2UI pages broken — custom element registration race condition | host | host |
| **done** | T0072-upgrade-native-ui-0.7.5.md | Upgrade to `@nonoun/native-ui@0.7.5` — `n-pagination-dots` component | native-ui | host |

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **done** | T0070-n-table-cols-attribute.md | n-table needs a `cols` attribute for grid-template-columns | host | native-ui |
| **done** | T0068-document-drag-ghost-popover-pattern.md | Document DragController ghost popover pattern on draggable trait page | native-ui | host |
| **done** | T0069-no-css-on-components-enforcement.md | Enforce no-CSS-on-components rule + 6 new pages + CSS cleanup across ~30 pages | host | host |
| **done** | T0067-ncontroller-view-transition-upgrade.md | NController CE upgrade unreliable after adoptNode + replaceWith | host | native-ui |
| **done** | T0066-update-textarea-page-formatting.md | Update `ui-textarea.astro` with formatting section | native-ui | host |
| **done** | T0065-update-input-page-formatting.md | Update `ui-input.astro` with formatting section | native-ui | host |
| **done** | T0064-create-slash-commandable-trait-page.md | Create `slash-commandable.astro` trait demo page | native-ui | host |
| **done** | T0063-upgrade-native-ui-0.7.2.md | Upgrade to `@nonoun/native-ui@0.7.2` — input formatting, slash command Tab-select + descriptions | native-ui | host |
| **done** | T0062-sidebar-badges-changelog.md | Add sidebar badges and changelog page | native-ui | host |
| **done** | T0061-upgrade-native-ui-0.7.0.md | Upgrade to `@nonoun/native-ui@0.7.0` + `@nonoun/native-chat@0.3.0` — 14 tickets, `<n-text>` adoption, `[scrollable]` audit | native-ui | host |

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **done** | T0060-feature-request-n-text.md | Feature request — `<n-text>` utility element for muted/styled text | host | native-ui |
| **done** | T0059-chat-feed-min-width.md | `n-chat-feed` and `n-chat-messages` missing `min-width: 0` | host | native-ui |
| **fixed** | T0058-chat-panel-footer-padding-none.md | `native-chat-panel` stamped `n-footer` should not set `padding="none"` | host | native-ui |

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **done** | T0057-docs-update-0.6.9-chat-0.2.1.md | Documentation updated for native-ui 0.6.7–0.6.9 and native-chat 0.2.1 | native-ui | host |
| **done** | T0056-upgrade-native-ui-0.6.9.md | Upgrade to `@nonoun/native-ui@0.6.9` + `@nonoun/native-app@0.3.3` — content reset, card inline, toolbar plain, disabled normalization | native-ui | host |
| **done** | T0055-new-pagination-dots-component.md | New `<n-pagination-dots>` component — standalone dot indicator with sliding pill | native-ui | host |
| **done** | T0054-upgrade-native-ui-0.6.6.md | Upgrade to `@nonoun/native-ui@0.6.6` — internal CSS source file renames | native-ui | host |
| **done** | T0053-kanban-structure-guide.md | How to build a kanban board with native-ui's DragController | native-ui | host |
| **done** | T0052-upgrade-native-ui-0.6.5.md | Upgrade to `@nonoun/native-ui@0.6.5` — DragController View Transitions fix | native-ui | host |
| **done** | T0050-upgrade-native-ui-0.6.2.md | Upgrade to `@nonoun/native-ui@0.6.2` — `<n-toast>` component, per-controller containers | native-ui | host |
| **fixed** | T0051-draggable-trait-broken-view-transitions.md | Draggable trait `native:drop` not firing in Astro View Transitions context | host | native-ui |

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
| **fixed** | T0034-codemirror-shadow-dom-fix.md | CodeMirror syntax highlighting broken inside `<native-app>` shadow DOM | native-ui | host |
| **fixed** | T0035-playground-iframe-typography.md | Playground iframe preview inherits design system typography | native-ui | host |
| **info** | T0036-codemirror-demo-page.md | New `native-codemirror` demo page available | native-ui | host |
| **done** | T0037-upgrade-native-ui-0.5.2.md | Upgrade to `@nonoun/native-ui@0.5.2` and sub-packages | native-ui | host |
| **done** | T0038-upgrade-native-ui-0.5.3.md | Upgrade to `@nonoun/native-ui@0.5.3` and sub-packages | native-ui | host |
| **done** | T0040-upgrade-codemirror-0.2.4.md | Upgrade to `@nonoun/native-codemirror@0.2.4` and `@nonoun/native-editor@0.2.4` | native-ui | host |
| **done** | T0041-upgrade-native-ui-0.5.5.md | Upgrade to `@nonoun/native-ui@0.5.5` — `<native-codemirror>` element, internal refactors | native-ui | host |
| **fixed** | T0039-n-field-default-gap.md | `n-field` default gap is too small for form layouts | host | native-ui |
| **fixed** | T0042-n-field-user-select-blocks-input.md | `n-field { user-select: none }` prevents typing in contenteditable `n-input` | host | native-ui |
| **done** | T0043-upgrade-native-ui-0.5.6.md | Upgrade to `@nonoun/native-ui@0.5.6` — input typing fix | native-ui | host |
| **done** | T0044-upgrade-native-ui-0.5.7.md | Upgrade to `@nonoun/native-ui@0.5.7` — password input support | native-ui | host |
| **done** | T0045-astro-view-transitions.md | Add Astro View Transitions for smooth page-to-page navigation | native-ui | host |
| **done** | T0046-upgrade-native-ui-0.6.0.md | Upgrade to `@nonoun/native-ui@0.6.0` — unified sub-containers, chat extraction, aside refactor | native-ui | host |
| **fixed** | T0047-upgrade-ticket-feedback.md | Feedback on upgrade ticket quality — T0046 missed a breaking change | host | native-ui |
| **fixed** | T0048-native-ui-astro-consumer-guide.md | Consumer guide — how the Astro host works and what upgrade tickets need to account for | host | native-ui |
| **done** | T0049-upgrade-native-ui-0.6.1.md | Upgrade to `@nonoun/native-ui@0.6.1` and all sub-packages | native-ui | host |

</details>

Resolution notes for closed tickets are in [TICKET-LOG.md](TICKET-LOG.md).
