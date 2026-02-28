# T0007: `ui-layout-sidebar-item` trailing slot visible in collapsed sidebar

**Component:** `ui-layout-sidebar-item`
**Severity:** Medium
**From:** native-host → native-ui

## Problem

When the sidebar is collapsed (icon rail mode), the `[slot="trailing"]` content (e.g., a caret icon) remains visible in the header item. The container query rule at `@container sidebar (max-width: 80px)` should hide all direct children except `[slot="icon"]`:

```css
:where(ui-layout-sidebar-item) > :where(:not([slot="icon"]):not(ui-listbox[popover]):not(.nav-group-flyout)) {
  display: none;
}
```

This rule targets direct children, so `<ui-icon name="caret-up-down" slot="trailing">` as a direct child of `ui-layout-sidebar-item` should be hidden — but it isn't.

## Expected Behavior

In collapsed mode (48px icon rail), only `[slot="icon"]` and `ui-listbox[popover]` should be visible. All other direct children — including `[slot="label"]` and `[slot="trailing"]` — should be hidden.

## Markup

```html
<ui-layout-sidebar-item>
  <span class="nav-logo" slot="icon">...</span>
  <span slot="label">NativeUI</span>
  <ui-icon name="caret-up-down" slot="trailing"></ui-icon>  <!-- still visible -->
  <ui-listbox popover="manual">...</ui-listbox>
</ui-layout-sidebar-item>
```

## Where

`src/layouts/SidebarLayout.astro:41-67` — header sidebar item with team selector
