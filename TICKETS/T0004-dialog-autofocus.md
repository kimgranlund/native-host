# T0004: `ui-dialog` does not auto-focus first input on `showModal()`

**Component:** `ui-dialog`
**Severity:** Low
**From:** native-host → native-ui

## Problem

After calling `dialog.showModal()`, the first focusable descendant is not automatically focused. Manual focus with `requestAnimationFrame` is required:

```js
dialog.showModal();
requestAnimationFrame(() => {
  dialog.querySelector('input')?.focus();
});
```

## Expected Behavior

Follow the native `<dialog>` spec: when `showModal()` is called, focus should move to the first element with `autofocus`, or the first focusable descendant, or the dialog itself. This should work without consumer-side `rAF` hacks.

## Impact

Every dialog usage requires manual focus management boilerplate. Without it, focus stays on the trigger button behind the dialog, which is an a11y issue.

## Where

`src/scripts/layout.ts:200-202`, `src/pages/blocks/overlay-command-palette.astro:136-139`
