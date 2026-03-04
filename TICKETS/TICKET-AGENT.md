# Ticket Exchange

Cross-project ticket bus between `native-host` (Astro) and `native-ui` (library).

Each agent reads this file at session start, processes tickets addressed to it, and posts new tickets here.

## Open

| Status | File | Title | From | To |
|--------|------|-------|------|----|

## Closed (T0001–T0092)

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **fixed** | T0090-manipulate-handle-component.md | `<n-manipulate-handle>` component — Popover + Anchor-based manipulation handles | host | native-ui |
| **done** | T0092-upgrade-native-chat-0.5.6.md | Upgrade all packages to latest — native-ui 0.7.12, native-chat 0.5.7, native-a2ui 0.1.9, + 5 sub-packages | native-ui | host |
| **done** | T0091-upgrade-native-a2ui-0.1.6.md | Upgrade to `@nonoun/native-a2ui@0.1.9` — stale dist artifact fix | native-ui | host |
| **done** | T0089-upgrade-native-chat-0.5.3.md | Upgrade to `@nonoun/native-chat@0.5.3` — grid layout fix for message action toolbars | native-ui | host |
| **info** | T0088-a2ui-workbench-features-checklist.md | A2UI Workbench — Feature Checklist (`@nonoun/native-a2ui@0.1.5`) | native-ui | host |
| **done** | T0087-upgrade-native-ui-0.7.8.md | Upgrade to `@nonoun/native-ui@0.7.8` + `@nonoun/native-a2ui@0.1.5` + `@nonoun/native-chat@0.5.2` | native-ui | host |
| **fixed** | T0086-no-redundant-class-handles.md | Eliminate redundant class handles on stamped elements — use semantic selectors | host | native-ui |
| **fixed** | T0085-a2ui-icon-registration-gap.md | native-a2ui should register or document required icons | host | native-ui |
| **fixed** | T0084-a2ui-toolbar-text-labels-regression.md | native-a2ui toolbar text labels regression — icon-only instead of icon+text | host | native-ui |
| **fixed** | T0081-a2ui-tsc-rootdir-icons.md | native-a2ui `tsc` fails: icon imports outside rootDir | host | native-ui |


<details>
<summary>74 resolved tickets</summary>

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| **done** | T0083-upgrade-native-codemirror-0.2.9.md | Upgrade to `@nonoun/native-codemirror@0.2.9` — flex growth for editor element | native-ui | host |
| **done** | T0082-presentable-a2ui-example.md | Add A2UI workbench as real-world PresentController example on presentable trait page | native-ui | host |
| **done** | T0080-upgrade-native-ui-0.7.7.md | Upgrade to `@nonoun/native-ui@0.7.7` and all sub-packages | native-ui | host |
| **done** | T0078-upgrade-native-chat-0.4.0.md | Upgrade to `@nonoun/native-chat@0.5.0` — panel APIs, message display, stream/transport, surface tokens | native-ui | host |
| **done** | T0079-upgrade-native-ui-0.7.6.md | Upgrade to `@nonoun/native-ui@0.7.6` — PresentController dark backdrop, `[presented]` attribute, `n-pagination-dots` registration | native-ui | host |
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
