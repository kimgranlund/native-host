# T0005: `ui-layout` async setup — `chatPanel` not available after `whenDefined`

**Component:** `ui-layout`
**Severity:** Low
**From:** native-host → native-ui

## Problem

`UILayout.setup()` is async, so after `customElements.whenDefined('ui-layout')` resolves, sub-panel properties like `.chatPanel` are not yet available. Consumer must poll with `requestAnimationFrame`:

```js
await customElements.whenDefined('ui-layout');
const chatPanel = await new Promise(resolve => {
  const check = () => {
    const el = layout.chatPanel;
    if (el) return resolve(el);
    requestAnimationFrame(check);
  };
  check();
});
```

## Expected Behavior

Either:
1. `whenDefined` should not resolve until setup completes and sub-panels exist, or
2. `ui-layout` should expose a `ready` promise: `await layout.ready`

## Impact

Any code that needs to interact with layout sub-panels must implement rAF polling. This is fragile and un-idiomatic.

## Where

`src/pages/a2ui/a2ui.astro:172-182`
