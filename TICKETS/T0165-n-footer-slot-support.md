# T0165: n-footer needs slot="leading" / slot="trailing" support

**Component:** `n-footer` (layout.containers.css)
**Severity:** Medium
**From:** host → native-ui

## Problem

`n-header` has full grid-based slot support:

```css
:where(n-header):has(> [slot="leading"]):has(> [slot="trailing"]) {
  grid-template-columns: auto 1fr minmax(0, auto);
}
:where(n-header) > :where([slot="leading"]) { grid-column: 1; ... }
:where(n-header) > :where([slot="trailing"]) { grid-column: -1; ... }
:where(n-header) > :where([slot="content"]) { grid-column: 1 / -1; ... }
```

`n-footer` has none of this — it's just:

```css
:where(n-footer) {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: calc(var(--n-space) * 2);
  min-height: calc(var(--n-size) + var(--n-padding-block) * 2);
  ...
}
```

This means `slot="leading"` and `slot="trailing"` on `n-footer` children are ignored. The host has to add manual flex overrides to get left/right footer content (e.g. badge on the left, label on the right).

## Expected

`n-footer` should support the same `slot="leading"` / `slot="trailing"` pattern as `n-header`, using either grid or flex with margin-auto spacing:

### Option A: Grid (like n-header)
```css
:where(n-footer):has(> [slot="leading"]):has(> [slot="trailing"]) {
  display: grid;
  grid-template-columns: auto 1fr auto;
}
:where(n-footer) > :where([slot="leading"]) { grid-column: 1; }
:where(n-footer) > :where([slot="trailing"]) { grid-column: -1; }
```

### Option B: Flex with auto margin
```css
:where(n-footer):has(> [slot="leading"]) {
  justify-content: flex-start;
}
:where(n-footer) > :where([slot="trailing"]) {
  margin-inline-start: auto;
}
```

Option A is preferred for consistency with `n-header`.

## Use Case

Stat cards with a trend badge on the left and a change label on the right:

```html
<n-footer>
  <n-badge slot="leading" intent="success">
    <n-icon name="trend-up"></n-icon>
    +20.1%
  </n-badge>
  <span slot="trailing" class="change-label">from last month</span>
</n-footer>
```

Also applies to table footers (pagination on right, info text on left), card action bars, etc.

## Files to Modify

| File | What |
|------|------|
| `src/styles/css/layout.containers.css` | Add slot-based grid/flex rules for `n-footer` |
