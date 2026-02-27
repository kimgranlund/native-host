# ui-segmented-control: Initial value not reflected visually

## Component
`<ui-segmented-control>`, `<ui-segment>`

## Package version
`@nonoun/native-ui@^0.1.0`

## Description
When `<ui-segmented-control value="month">` is rendered with a matching `<ui-segment value="month">`, the selected segment does not show the elevated/highlighted visual state. All segments appear identical (no selection indicator).

Clicking a segment does activate it, but the initial `value` attribute is not reflected on first render.

## Reproduction

```html
<ui-segmented-control value="month">
  <ui-segment value="day">Day</ui-segment>
  <ui-segment value="week">Week</ui-segment>
  <ui-segment value="month">Month</ui-segment>
  <ui-segment value="year">Year</ui-segment>
</ui-segmented-control>
```

**Expected:** "Month" segment renders with the elevated/selected indicator (white pill on dark, as shown in the reference screenshot).

**Actual:** All four segments render identically with no visual selection state.

## Likely related
This may share a root cause with the `<ui-tabs>` panel visibility bug — both involve the component not reflecting its initial `value` attribute on first render. See `ui-tabs-panels-not-visible.md`.

## Environment
- Astro 5.18.0, static output
- Content injected via `set:html`
- CSS loaded: `@nonoun/native-ui/css/foundation` + `@nonoun/native-ui/css/components`
- Components registered: `@nonoun/native-ui/register`
