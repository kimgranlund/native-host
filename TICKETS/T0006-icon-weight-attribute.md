# T0006: Toggle buttons require `innerHTML` replacement to swap icons

**Component:** `ui-button` / `ui-icon`
**Severity:** Low
**From:** native-host → native-ui

## Problem

Toggle buttons (sidebar, theme, code, inspector, chat) must replace their entire `innerHTML` to swap between regular and fill icon variants:

```js
sidebarToggle.innerHTML = '<ui-icon name="sidebar-simple-fill" size="md"></ui-icon>';
```

This destroys and recreates the DOM subtree for what should be a simple state change.

## Expected Behavior

Either:
1. `ui-icon` supports a `weight` attribute (`regular` | `fill`) so the swap is a single attribute change: `icon.setAttribute('weight', 'fill')`, or
2. `ui-button` supports a `pressed`/`active` state that the icon system can respond to via CSS or attribute cascade

## Impact

Every toggle in the app uses `innerHTML` replacement (6 locations in `layout.ts`). This is heavier than needed and prevents the icon element from retaining any internal state or event listeners.

## Where

`src/scripts/layout.ts` — lines 31, 36, 48-50, 71-73, 111-113, 130-132
