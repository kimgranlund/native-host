# T0156: Upgrade to @nonoun/native-ai@1.0.13 — Schema Pane, Sub-Container Card Pattern, Component Map Fixes

**Component:** @nonoun/native-ai
**Severity:** Medium
**From:** native-ui → host

## Changes

### New: SCHEMA pane in A2UI Workbench

The workbench now has a 7th chip-toggled panel — **SCHEMA** — showing the full component registry as editable JSON. This is the bidirectional mapping between A2UI abstract types (Button, TextField, Card, etc.) and native-ui elements (n-button, n-input, n-container, etc.).

**Toolbar actions:**
- **Apply** (play icon) — parse edited JSON, replace registry, re-render preview with updated mappings
- **Format** — pretty-print JSON
- **Reset** — restore default mappings

The registry is now a mutable `ComponentRegistry` class with change tracking via signals. Edits in the schema pane immediately affect subsequent A2UI renders.

### New: ComponentRegistry API (exported)

New exports from `@nonoun/native-ai`:
- `ComponentRegistry` — mutable registry class with `add()`, `update()`, `remove()`, `setCategory()`, `toJSON()`, `fromJSON()`, `clone()`
- `defaultRegistry` — the default singleton instance
- `getComponentCategory()`, `getCompatibleTypes()` — free functions delegating to default
- Type: `RegistrySnapshot`

The registry can be passed via `A2UIAdapterOptions.registry` to thread a custom registry through the full protocol layer (adapter → surface manager → converter).

### New: Card sub-container pattern (Header / Body / Footer)

Three new A2UI component types that map to native-ui's sub-container elements:

| A2UI Type | Native Tag | Purpose |
|-----------|------------|---------|
| `Header` | `<n-header>` | Card/panel header with slot-based layout |
| `Body` | `<n-body>` | Scrollable content region |
| `Footer` | `<n-footer>` | Footer actions row |

**Card children pattern:**
- If Card children are already `Header`, `Body`, or `Footer` types, they pass through directly as `<n-header>`, `<n-body>`, `<n-footer>` inside `<n-container>`
- If Card children are bare content (not sub-container types), the converter auto-wraps them in `<n-body>` and synthesizes `<n-header>` from the Card's `header` or `label` property and `<n-footer>` from the Card's `footer` property

This means AI-generated A2UI streams can use the standard native-ui container pattern:
```html
<n-container>
  <n-header>...</n-header>
  <n-body>...</n-body>
  <n-footer>...</n-footer>
</n-container>
```

All ~53 Card instances across 18 presets now use the explicit Header/Body/Footer children pattern — heading in Header, content in Body, action buttons in Footer. Presets serve as canonical examples of the authoring convention.

### Fixed: Component map now uses proper native-ui elements

| A2UI Type | Old Tag | New Tag |
|-----------|---------|---------|
| Row | `<div class="stack" direction="row">` | `<n-stack direction="row">` |
| Column | `<div class="stack">` | `<n-stack>` |
| Badge | `<span class="badge">` | `<n-badge>` |
| Avatar | `<span class="avatar">` | `<n-avatar>` |

These are CSS-only custom elements with proper attribute APIs (density, size, intent, etc.) — no more class-based hacks on generic HTML elements.

### Fixed: Schema apply now re-renders preview

`#reinitAdapter()` was not resetting the playback cursor before replaying, so the stream replay loop was a no-op. Now correctly resets cursor to 0 and clears the preview before replaying.

## Package Update

```bash
npm install @nonoun/native-ai@1.0.13
```

## Impact

- **A2UI workbench demo page**: SCHEMA chip now appears in the chip bar. Existing panels unchanged.
- **No breaking changes**: All existing APIs preserved. `COMPONENT_MAP` still works as before (alias for `defaultRegistry`).
- **A2UI renders**: Card now renders with proper sub-container structure. Row/Column render as `<n-stack>`. Badge/Avatar render as `<n-badge>`/`<n-avatar>`.

## Host Action Required

1. Update `package.json`: `@nonoun/native-ai` → `1.0.12`
2. If the host has an A2UI workbench demo page, verify the SCHEMA pane appears and works
3. If the host renders A2UI streams, verify Card renders with `<n-header>/<n-body>/<n-footer>` sub-containers
4. Verify Row/Column/Badge/Avatar render correctly with the new tags (they should — the CSS already targets `n-stack`, `n-badge`, `n-avatar`)
