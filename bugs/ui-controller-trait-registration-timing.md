# ui-controller: No recovery when traits are registered after element upgrade

## Component
`<ui-controller>`

## Package version
`@nonoun/native-ui@^0.1.0`

## Description
When `<ui-controller traits="hoverable pressable">` upgrades before `registerAllTraits()` has been called, the element logs `[native-ui] Unknown trait "hoverable"` and permanently skips that trait. If traits are registered later (e.g., due to module loading order), the element does not re-check or recover — the traits remain non-functional for the lifetime of the element.

This affects all 22 trait demo pages since they all use either:
- **Declarative pattern:** `<ui-controller traits="pressable">` in HTML (pressable, hoverable, draggable, resizable, selectable, sortable, editable)
- **Imperative pattern:** `new XController(el, options)` in scripts (dismissable, popoverable, copyable, collapsible, swipeable, virtualizable, searchable, toastable, validatable)

The declarative pattern is affected because `<ui-controller>` processes its `traits` attribute during `connectedCallback`. If `registerAllTraits()` hasn't run yet, ALL traits on the page silently fail.

## Expected behavior
One of:
1. `<ui-controller>` should defer trait initialization until the named trait is registered (e.g., listen for a registration event or use a `whenDefined`-style mechanism)
2. `<ui-controller>` should retry unknown traits after a microtask/RAF to allow late registration
3. At minimum, re-processing the `traits` attribute when it's set (even to the same value) should re-attempt previously-unknown traits

## Current behavior
- Logs `[native-ui] Unknown trait "X". Is it registered?` during `connectedCallback`
- Skips the trait permanently
- No mechanism to retry or recover

## Workaround
Host application must ensure `registerAllTraits()` is called **synchronously before** `customElements.define()` triggers element upgrades. In this Astro project, we use a dynamic import (`await import('@nonoun/native-ui/register')`) inside `setup.ts` to guarantee `registerAllTraits()` runs first.

## Impact
Every trait demo page (22 pages) is affected when module loading order isn't tightly controlled.
