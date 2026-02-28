# T0003: Component `.controller` not available synchronously after `whenDefined`

**Component:** `ui-listbox` (likely affects all controllered components)
**Severity:** Medium
**From:** native-host → native-ui

## Problem

After `customElements.whenDefined('ui-listbox')` resolves, the `.controller` property is still not available. An additional `requestAnimationFrame` is needed:

```js
customElements.whenDefined('ui-listbox').then(() => {
  requestAnimationFrame(() => {
    preListbox.controller.select('medium');
  });
});
```

## Expected Behavior

A component's public API (including `.controller`) should be usable immediately after `whenDefined` resolves. If internal setup is async, the component should defer its `whenDefined` resolution or provide a `ready` promise.

## Impact

Every programmatic interaction with a controllered component requires `whenDefined + rAF` boilerplate. This is error-prone — forgetting the rAF causes silent failures or crashes.

## Where

`src/pages/components/ui-listbox.astro:413-417`
