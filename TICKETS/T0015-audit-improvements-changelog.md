# T0015: Audit improvements changelog (0.2.8)

**Severity:** Informational
**From:** native-ui → native-host

## Summary

82 findings from a competitive audit were fixed in 0.2.8. Most are internal quality improvements (no consumer action needed), but some expand the API surface or fix edge cases the host app may encounter. This ticket documents what changed — no migration required.

## ARIA Fixes

These are silent fixes — existing markup works better now, no changes needed:

- **`internals.ariaRequired` → `setAttribute('aria-required')`** on `ui-checkbox`, `ui-radio-group`. Previously, `ariaRequired` on `ElementInternals` didn't create a DOM attribute, so CSS `[aria-required]` selectors didn't match. Now they do.
- **`ui-field` dynamic `aria-describedby`**: Error slot ID is only included in `aria-describedby` when the field is invalid. Previously always included — screen readers announced invisible error text.
- **`ui-select` / `ui-combobox` `aria-controls`**: Trigger button now links to listbox via `aria-controls`. Missing before.

## CSS Fixes

No consumer action needed — these ship with the updated CSS bundle:

- **Logical properties**: Replaced physical `left`/`right`/`border-radius` corners with logical equivalents in `ui-layout-sidebar`, `ui-tooltip`, `ui-calendar`, `ui-nav`. RTL layouts now work correctly.
- **Split padding**: `ui-listbox`, `ui-tree`, `ui-command`, `ui-calendar` now use `padding-block` + `padding-inline` instead of uniform `padding`. Matches the design system convention for interactive components.
- **Dead CSS removed**: `ui-nav-item[active]` selector was unreachable (component uses `[aria-current]`). Removed.
- **Icon CSS load order**: `ui-icon.css` now loads before component CSS. Fixes `display: none` container-query rules losing to `display: inline-flex` at equal `:where()` specificity (T0007).

## Component Enhancements

### `ui-combobox` and `ui-select` — value attribute

Both coordinators now handle `value` attribute changes in `attributeChangedCallback`. Setting `value="us"` programmatically (or via SSR) now selects the matching option and syncs the trigger label. Previously, `value` only worked if set before `setup()`.

### `ui-accordion` — `multiple` attribute handler

`attributeChangedCallback` now responds to `multiple` attribute changes. Previously, changing `multiple` after setup had no effect.

### `ui-calendar` — `range` and `name` handlers

Calendar now handles `range` and `name` attribute changes dynamically.

### `ui-tree-item` — `expanded`/`selected` property accessors

`ui-tree-item` now exposes `expanded` and `selected` as proper boolean properties (get/set), not just attributes.

### `ui-pagination` — optimized disabled cascade

Disabled state change no longer triggers a full DOM rebuild. Uses `untrack()` to only update button disabled states.

### `ui-slideshow` — `autoplay`/`interval` handlers

Slideshow now responds to `autoplay` and `interval` attribute changes after setup.

### `ui-table-header` — `sortable` attribute handler

Table headers now handle `sortable` attribute changes dynamically.

## Trait Improvements

### Adapter `update()` methods

Six trait adapters now implement `update()` so option changes via `<ui-controller>` attributes are applied live (not just on initial create). Affected: `sortable`, `intersectable`, `hoverable`, `resizable`, `swipeable`, `virtualizable`.

### Numeric coercion guards

Six adapters now guard against `Number("") → 0` — empty string options are treated as undefined rather than zero. Prevents silent misconfiguration.

### Controller cleanup

- **`PopoverController.destroy()`** now cleans up inline styles
- **`SwipeController`** fixes timer orphan on disconnect
- **`ResizeController`** reverts correct axis on cancel
- **`DragController`** consistent cancel behavior
- **`FocusTrapController`** cleanup on destroy
- **`CollapsibleController`** toggle guard when already animating

## Data-Mode Effect Placement

`ui-select` and `ui-combobox` moved 3 data-mode effects (options render, src fetch, placeholder sync) outside `deferChildren`. This fixes a race condition where setting `options` or `src` via JS after setup didn't trigger re-render because the effect was waiting for a microtask that had already passed.

**Impact:** If you're using `<ui-select options='[...]'>` or `<ui-select src="/api/...">` and experienced stale/empty option lists, this is the fix. No markup changes needed.

## Form Reset

`ui-input`, `ui-textarea`, and `ui-range` now correctly restore their initial value on form reset (`<form>.reset()`). `ui-textarea` also restores `contenteditable` content properly.
