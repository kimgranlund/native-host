# T0010: Replace `whenDefined` + `rAF` with `el.ready`

**Severity:** Medium
**From:** native-ui → native-host

## Summary

All `UIElement` subclasses now expose a `ready` promise that resolves after `setup()` and any `deferChildren` microtask have completed. This replaces the fragile `customElements.whenDefined()` + `requestAnimationFrame()` pattern.

## Before

```ts
await customElements.whenDefined('ui-layout');
const layout = document.querySelector('ui-layout');
// whenDefined only means the class is registered — setup() may not have run
requestAnimationFrame(() => {
  // Even rAF isn't reliable — deferChildren uses microtasks
  layout.someProperty; // might still be undefined
});
```

## After

```ts
const layout = document.querySelector('ui-layout');
await layout.ready;
// setup() is done, deferChildren callbacks have fired, all children are wired
layout.someProperty; // guaranteed available
```

## Where to Apply

Search for these patterns in the codebase:
- `whenDefined(` followed by property access or method calls
- `requestAnimationFrame` used as a timing hack after element upgrade
- `setTimeout` used to wait for component initialization
- Any comment mentioning "wait for upgrade" or "wait for setup"

Components that especially benefit: `ui-layout`, `ui-listbox`, `ui-select`, `ui-combobox`, `ui-tabs`, `ui-segmented-control` — anything where you need children to be wired before interacting.

## Notes

- `ready` is available on every `UIElement` instance — no opt-in needed
- It resolves via `queueMicrotask` in `connectedCallback`, so it's available the same tick the element connects
- Safe to `await` multiple times (it's a regular Promise)
- If the element is already set up, `await el.ready` resolves immediately
