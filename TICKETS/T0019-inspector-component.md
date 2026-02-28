# T0019: Ship `<ds-inspector>` as a self-registering component

**Component:** `@nonoun/native-ui/inspector`
**Severity:** Medium
**From:** native-host → native-ui

## Problem

Using the inspector requires 7 lines of boilerplate in every consumer:

```js
import { DSVariable, DSColors, DSColorSwatch, DSThemes, buildInspector } from '@nonoun/native-ui/inspector';

if (!customElements.get('ds-variable')) customElements.define('ds-variable', DSVariable);
if (!customElements.get('ds-colors')) customElements.define('ds-colors', DSColors);
if (!customElements.get('ds-color-swatch')) customElements.define('ds-color-swatch', DSColorSwatch);
if (!customElements.get('ds-themes')) customElements.define('ds-themes', DSThemes);

const panel = document.getElementById('color-panel');
if (panel) buildInspector(panel);
```

This is because:
1. `buildInspector()` is a loose function, not a component
2. The 4 `ds-*` sub-elements are exported as classes but never registered (T0008 — still broken in 0.2.8)
3. Every call site must manually register all 4 elements before calling `buildInspector`

In native-host, this registration is duplicated in both `layout.ts` (sidebar inspector) and `colors.astro` (standalone page).

## Expected Behavior

Ship a `<ds-inspector>` custom element that:

1. **Self-registers** all `ds-*` sub-elements as a side effect of import (like `ui-*` elements do via `@nonoun/native-ui/register`)
2. **Calls `buildInspector(this)`** in its `setup()` method
3. **Registers itself** via `customElements.define('ds-inspector', DSInspector)`

Consumer usage becomes:

```html
<ds-inspector></ds-inspector>
```

Or with the existing `ui-layout-inspector` integration:

```html
<ui-layout-inspector>
  <ds-inspector></ds-inspector>
</ui-layout-inspector>
```

No JS imports, no manual registration, no `buildInspector` call.

## Suggested Implementation

```ts
// inspector.ts — add at module level (side effects)
customElements.define('ds-variable', DSVariable);
customElements.define('ds-colors', DSColors);
customElements.define('ds-color-swatch', DSColorSwatch);
customElements.define('ds-themes', DSThemes);

// New component
class DSInspector extends UIElement {
  setup() {
    super.setup();
    buildInspector(this);
  }
}
customElements.define('ds-inspector', DSInspector);
```

This also resolves T0008 — the sub-element registration becomes automatic.

## Impact

Eliminates 7 lines of duplicated boilerplate per consumer. Prevents the T0008 footgun where `buildInspector()` silently creates inert DOM if registration is forgotten.
