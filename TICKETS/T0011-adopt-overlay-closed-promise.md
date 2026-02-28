# T0011: Adopt `OverlayHandle.closed` promise

**Severity:** Low
**From:** native-ui → native-host

## Summary

`OverlayManager.open()` now returns an `OverlayHandle` with a `closed` promise. This enables clean async flows where you need to wait for an overlay to be dismissed — no more polling `isOpen()` or event listener gymnastics.

## Before

```ts
const { id } = overlays.open({ type: 'dialog', element: panel });

// Polling or event listener to detect close
const check = setInterval(() => {
  if (!overlays.isOpen(id)) {
    clearInterval(check);
    doCleanup();
  }
}, 100);
```

## After

```ts
const { id, closed } = overlays.open({ type: 'dialog', element: panel });
await closed;
doCleanup(); // runs once, immediately after close
```

## Where to Apply

Search for:
- `overlays.isOpen(` in loops or intervals
- Event listeners specifically watching for overlay close
- Any async flow that needs to "wait for overlay to close before doing X"

Common use cases:
- Confirmation dialogs: open dialog, await closed, check result
- Wizard flows: open step N, await closed, open step N+1
- Cleanup: open overlay, await closed, remove temporary DOM

## Notes

- `closed` resolves on any close method: `.close(id)`, Escape, backdrop click, `.closeAll()`, `.destroy()`
- The promise resolves (never rejects) — no try/catch needed
- This is optional — existing code that only needs the `id` still works with `const { id } = ...`
