# ui-tabs: Active panel content not visible, no underline indicator

## Component
`<ui-tabs>`, `<ui-tab-panel>`, `<ui-tab-panels>`

## Package version
`@nonoun/native-ui@^0.1.0`

## Description
Tab labels render and appear interactive (the active tab is visually distinguishable), but:

1. **Panel content is not shown** — `<ui-tab-panel>` elements are present in the DOM with correct `value` attributes, but none are visible. The area below the tab strip is empty.
2. **No sliding underline indicator** — the active tab has no underline/indicator bar.

## Reproduction

```html
<ui-tabs value="overview">
  <ui-tab value="overview">Overview</ui-tab>
  <ui-tab value="features">Features</ui-tab>
  <ui-tab value="pricing">Pricing</ui-tab>
  <ui-tab-panels>
    <ui-tab-panel value="overview">
      <p>This is the overview panel.</p>
    </ui-tab-panel>
    <ui-tab-panel value="features">
      <p>Features panel.</p>
    </ui-tab-panel>
    <ui-tab-panel value="pricing">
      <p>Pricing panel.</p>
    </ui-tab-panel>
  </ui-tab-panels>
</ui-tabs>
```

## Verified
- The HTML markup is correct (all elements present with proper attributes)
- CSS is loaded (`@nonoun/native-ui/css/foundation` + `@nonoun/native-ui/css/components`)
- Components are registered (`@nonoun/native-ui/register`)
- This affects all tab variants on the demo page: horizontal, vertical, with icons, disabled, sizes, events

## Environment
- Astro 5.18.0, static output
- Content injected via `set:html` (no shadow DOM interference)
- Browser: appears consistent (not browser-specific)
