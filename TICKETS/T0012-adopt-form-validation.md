# T0012: Adopt new form validation features

**Severity:** Medium
**From:** native-ui → native-host

## Summary

The 0.2.8 audit added several form validation capabilities that were previously missing. These bring native-ui form components closer to parity with native HTML form controls.

## New Capabilities

### 1. `pattern` attribute on `ui-input` and `ui-textarea`

Regex validation via the standard `pattern` attribute. Reports `patternMismatch` to the Constraint Validation API.

```html
<ui-field>
  <span slot="label">Email</span>
  <ui-input pattern="[^@]+@[^@]+\.[^@]+" required></ui-input>
  <span slot="error">Please enter a valid email</span>
</ui-field>
```

- Works with `ui-field` — the error slot shows when validation fails
- `patternMismatch` is available via `el.validity.patternMismatch`
- Validates on every keystroke (same as `valueMissing`)

### 2. `required` attribute on `ui-switch`

Switches now support `required` — reports `valueMissing` when required and not checked.

```html
<ui-field>
  <ui-switch required>Accept terms</ui-switch>
  <span slot="error">You must accept the terms</span>
</ui-field>
```

### 3. `required` attribute on `ui-range`

Range sliders now support `required` — reports `valueMissing` when required.

```html
<ui-range required min="1" max="10" name="rating"></ui-range>
```

### 4. `ui-range` min/max/step property reflection

Setting `min`, `max`, or `step` via JS properties now reflects to attributes:

```ts
range.min = 0;    // also sets min="0" attribute
range.max = 200;  // also sets max="200" attribute
range.step = 5;   // also sets step="5" attribute
```

### 5. `ui-textarea` maxlength validation (tooLong)

Previously, `maxlength` silently truncated input. Now it reports `tooLong` via Constraint Validation — the user sees the error, the value isn't clipped.

### 6. `ui-field` dynamic error describedby

`ui-field` now dynamically adds/removes the error slot's ID from `aria-describedby` when validation state changes. Previously, the error ID was always included (even when hidden), which caused screen readers to announce invisible error text.

## Where to Apply

- Any forms currently using native `<input pattern="...">` can now use `<ui-input pattern="...">`
- Terms/consent switches can add `required`
- Rating/slider inputs can add `required`
- Forms relying on `maxlength` truncation on `ui-textarea` should be tested — behavior changed from silent truncation to validation error

## Notes

- All validation integrates with `ui-field`'s `[invalid]` state and error slot
- All validation uses the standard Constraint Validation API (`el.validity`, `el.validationMessage`, `el.checkValidity()`)
- Form reset now correctly restores initial values for `ui-input`, `ui-textarea`, and `ui-range`
