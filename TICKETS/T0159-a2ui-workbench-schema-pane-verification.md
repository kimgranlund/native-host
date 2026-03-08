# T0159: A2UI Workbench — SCHEMA Pane & Updated Presets Verification

**Component:** `src/pages/a2ui/a2ui-workbench.astro`
**Severity:** Low
**From:** native-ui → host

## Summary

The A2UI Workbench page (`a2ui-workbench.astro`) uses the `<native-a2ui>` element, which self-contains all its UI (presets, panels, toolbar). Upgrading `@nonoun/native-ai` to `1.0.15` automatically brings all the new features without code changes to this page. This ticket is a **verification-only** task.

## What Changed in `@nonoun/native-ai@1.0.15`

### 1. New SCHEMA Pane (7th chip-toggled panel)

The workbench chip bar now shows 7 panels: **JSON-IN**, **JSON-OUT**, **HTML**, **CSS**, **JS**, **UI** (components), **SCHEMA**.

**SCHEMA pane features:**
- Full registry JSON editor (CodeMirror, same as other panes)
- **Apply** button (play icon) — parses edited JSON, replaces the component registry, re-renders preview with updated mappings
- **Format** button — pretty-prints the JSON
- **Reset** button — restores default registry mappings

The registry is the bidirectional mapping between A2UI abstract types (Button, TextField, Card, etc.) and native-ui elements (`n-button`, `n-input`, `n-container`, etc.). Editing it in the SCHEMA pane immediately affects all subsequent A2UI renders.

### 2. ComponentRegistry API

The `<native-a2ui>` element now uses a mutable `ComponentRegistry` class internally. The schema pane provides the UI for editing it. No host-side API changes needed.

### 3. All 29 Presets Updated

Every preset in the dropdown now uses:
- **Card root** — `{ id: 'root', component: 'Card', children: [...] }`
- **Header/Body/Footer** sub-containers
- **Full-word IDs** — `button-submit` not `submit-btn`, `card-header` not `hdr`
- **Consistent `{context}-{role}` naming** — `patient-name`, `CBC-WBC-value`, etc.

The preset dropdown now includes **8 new travel/hospitality presets**: restaurant, room-service, amenities, room-recs, booking, concierge, checkout, local-guide.

### 4. Component Map Fixes

| A2UI Type | Old Rendering | New Rendering |
|-----------|--------------|---------------|
| `Row` | `<div class="stack" direction="row">` | `<n-stack direction="row">` |
| `Column` | `<div class="stack">` | `<n-stack>` |
| `Badge` | `<span class="badge">` | `<n-badge>` |
| `Avatar` | `<span class="avatar">` | `<n-avatar>` |
| `Header` | *(new type)* | `<n-header>` |
| `Body` | *(new type)* | `<n-body>` |
| `Footer` | *(new type)* | `<n-footer>` |

### 5. Card Sub-Container Pattern

Cards now render with proper native-ui container structure:
```html
<n-container>
  <n-header>...</n-header>
  <n-body>...</n-body>
  <n-footer>...</n-footer>
</n-container>
```

If a Card's children are already `Header`/`Body`/`Footer` types, they pass through directly. If bare content, the converter auto-wraps them.

## Files to Modify

**None** — `a2ui-workbench.astro` only needs `@nonoun/native-ai` bumped in `package.json` (covered by T0156).

## Verification Checklist

1. Open the A2UI Workbench page
2. **SCHEMA chip** — verify it appears in the chip bar after UI
3. **Toggle SCHEMA pane** — click chip, verify full registry JSON is displayed
4. **Format** — click Format, verify JSON is pretty-printed
5. **Edit + Apply** — change a mapping (e.g., change `Button` → `n-input`), click Apply, verify preview re-renders with the changed element
6. **Reset** — click Reset, verify default mappings restored
7. **Preset dropdown** — verify all ~29 presets appear, organized by group
8. **Pick a preset** — select "Lab Results", verify it renders with Card root, `<n-header>`, `<n-body>`, `<n-footer>` visible in HTML pane
9. **Travel presets** — verify new group appears (restaurant, room-service, etc.)
10. **Component map** — in HTML pane, verify Row renders as `<n-stack direction="row">`, Badge as `<n-badge>`, Avatar as `<n-avatar>`

## Convenience Links

- **Workbench element source**: `native-ui/packages/native-ai/src/a2ui/a2ui-element.ts`
- **Workbench CSS**: `native-ui/packages/native-ai/src/a2ui/css/a2ui.css`
- **Presets**: `native-ui/packages/native-ai/src/a2ui/a2ui-presets.ts`
- **ComponentRegistry**: `native-ui/packages/native-ai/src/a2ui/protocol/a2ui-component-registry.ts`
- **Host page**: `src/pages/a2ui/a2ui-workbench.astro` (25 lines, no changes needed)
