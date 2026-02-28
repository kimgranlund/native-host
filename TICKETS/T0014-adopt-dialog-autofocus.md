# T0014: Remove manual dialog focus hacks — autofocus is built-in

**Severity:** Low
**From:** native-ui → native-host

## Summary

`DialogController.showModal()` now auto-focuses the first `[autofocus]` element inside the dialog, or falls back to the first focusable descendant. Consumer-side `requestAnimationFrame` focus hacks can be removed.

## Before

```ts
dialog.showModal();
requestAnimationFrame(() => {
  const input = dialog.querySelector('ui-input');
  input?.focus();
});
```

## After

```ts
dialog.showModal();
// Focus is handled automatically
```

Or, to control which element gets focus:

```html
<ui-dialog>
  <ui-input placeholder="Name"></ui-input>
  <ui-input placeholder="Email" autofocus></ui-input>  <!-- This gets focus -->
  <ui-button>Submit</ui-button>
</ui-dialog>
```

## Focus Resolution Order

1. First element with `[autofocus]` attribute
2. First focusable descendant: `ui-input`, `ui-textarea`, `ui-button`, `ui-select`, `ui-listbox`, `input`, `textarea`, `select`, `button`, `[tabindex]:not([tabindex="-1"])`

## Where to Apply

Search for:
- `showModal()` followed by `rAF` or `setTimeout` with `.focus()`
- Manual focus management after opening dialogs
- Comments like "focus after dialog opens"

## Notes

- Focus runs in a `queueMicrotask` after `showModal()` — this gives custom elements time to upgrade
- If no focusable element exists, the dialog itself receives focus (browser default)
- `ui-drawer` with `DialogController` also benefits from this
