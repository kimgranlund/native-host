# T0002: Kernel overlays API has no close event

**Component:** `Kernel.overlays`
**Severity:** Medium
**From:** native-host → native-ui

## Problem

When an overlay is closed externally (Escape key, click outside), there is no event or callback to notify the consumer. The only way to detect closure is polling:

```js
const checkInterval = setInterval(() => {
  if (!kernel.overlays.isOpen(id)) {
    box.remove();
    clearInterval(checkInterval);
  }
}, 100);
```

## Expected Behavior

The overlay manager should fire a `close` event (or accept a callback) when an overlay is dismissed:

```js
kernel.overlays.on('close', (closedId) => {
  if (closedId === id) box.remove();
});
```

Or return a promise/disposer from `.open()`:

```js
const { id, closed } = kernel.overlays.open({ type, element, owner });
await closed;
box.remove();
```

## Impact

Consumers must poll with `setInterval` to detect external closure, which is wasteful, racy, and un-idiomatic.

## Where

`src/pages/kernel.astro:633-639`
