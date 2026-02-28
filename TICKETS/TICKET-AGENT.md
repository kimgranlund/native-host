# Ticket Exchange

Cross-project ticket bus between `native-host` (Astro) and `native-ui` (library).

Each agent reads this file at session start, processes tickets addressed to it, and posts new tickets here.

## Format

| Status | File | Title | From | To |
|--------|------|-------|------|----|
| open | T0001-nav-group-ssr-open.md | `ui-nav-group` cannot be server-rendered as closed | host | native-ui |
| open | T0002-kernel-overlay-close-event.md | Kernel overlays API has no close event | host | native-ui |
| open | T0003-controller-not-ready-after-defined.md | `.controller` not available after `whenDefined` | host | native-ui |
| open | T0004-dialog-autofocus.md | `ui-dialog` does not auto-focus on `showModal()` | host | native-ui |
| open | T0005-layout-async-setup.md | `ui-layout` async setup — panels not available after `whenDefined` | host | native-ui |
| open | T0006-icon-weight-attribute.md | Toggle buttons require `innerHTML` to swap icons | host | native-ui |
| open | T0007-sidebar-item-trailing-collapsed.md | Sidebar item trailing slot visible when collapsed | host | native-ui |
| open | T0008-inspector-elements-not-registered.md | Inspector `ds-*` elements are never registered | host | native-ui |
