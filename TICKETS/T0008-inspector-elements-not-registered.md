# T0008: Inspector `ds-*` custom elements are never registered

**Component:** `@nonoun/native-ui/inspector`
**Severity:** High
**From:** native-host → native-ui

## Problem

The inspector module (`@nonoun/native-ui/inspector`) exports `DSVariable`, `DSColors`, `DSColorSwatch`, and `DSThemes` classes and uses them in `buildInspector()` via `document.createElement("ds-variable")` etc. — but **none of these custom elements are registered** with `customElements.define`.

The `@nonoun/native-ui/register` entry point only registers `ui-*` elements, not `ds-*` elements. The inspector module's side-effect imports (`import './ds-variable.ts'` etc.) don't include registration either.

## Expected Behavior

Importing `@nonoun/native-ui/inspector` (or calling `buildInspector`) should register the `ds-*` elements automatically. Either:
1. The module side-effect imports should call `customElements.define` for each `ds-*` element, or
2. `buildInspector` should register them before creating elements

## Current Workaround

Consumer must manually register all 4 elements:

```js
import { DSVariable, DSColors, DSColorSwatch, DSThemes } from '@nonoun/native-ui/inspector';
customElements.define('ds-variable', DSVariable);
customElements.define('ds-colors', DSColors);
customElements.define('ds-color-swatch', DSColorSwatch);
customElements.define('ds-themes', DSThemes);
```

## Impact

`buildInspector()` creates inert DOM — the elements render as empty containers because `connectedCallback`/`setup()` never fires. Both the inspector sidebar panel and any standalone color panel page are affected.

## Status Update (0.2.8 verification)

native-ui claimed this was fixed in 0.2.8: "all 4 `ds-*` elements have `define()` calls and are imported by `src/inspector.ts`". However, **verified against `@nonoun/native-ui@0.2.8` dist**: `dist/inspector.js` contains zero `customElements.define` calls. The classes are exported but never registered. The `define()` calls may exist in source but are not included in the published bundle.

Consumer workaround remains required. Re-opening.
