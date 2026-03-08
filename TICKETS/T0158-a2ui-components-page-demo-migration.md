# T0158: A2UI Components Page — Inline Demo Migration to Card Root Pattern

**Component:** `src/pages/a2ui/a2ui-components.astro`
**Severity:** Medium
**From:** native-ui → host

## Problem

The A2UI Components page (`a2ui-components.astro`) has **18 inline component demos** (lines 52–321) that all use the old `Column` root pattern. With `@nonoun/native-ai@1.0.15`, the canonical A2UI authoring convention is `Card > Header | Body | Footer`. These demos serve as public-facing examples of A2UI usage and should reflect the current conventions.

### Current Pattern (all 18 demos)

```js
adapter.receive({
  updateComponents: {
    surfaceId: 'buttons-demo',
    components: [
      { id: 'root', component: 'Column', children: ['label', 'row'] },  // ← Column root
      { id: 'label', component: 'Text', text: 'Buttons', variant: 'h3' },
      { id: 'row', component: 'Row', children: ['primary', 'default', ...] },
      ...
    ],
  },
}, target);
```

### Required Pattern

```js
adapter.receive({
  updateComponents: {
    surfaceId: 'buttons-demo',
    components: [
      { id: 'root', component: 'Card', children: ['card-header', 'card-body'] },
      { id: 'card-header', component: 'Header', children: ['title'] },
      { id: 'title', component: 'Text', text: 'Buttons', variant: 'h3' },
      { id: 'card-body', component: 'Body', child: 'content' },
      { id: 'content', component: 'Column', children: ['row'] },
      { id: 'row', component: 'Row', children: ['button-primary', 'button-default', ...] },
      ...
    ],
  },
}, target);
```

### All 18 Demos Requiring Migration

| # | Surface ID | Line | Content | Has Actions (Footer)? |
|---|-----------|------|---------|----------------------|
| 1 | `text-demo` | 53 | Text variants (h1–caption) | No |
| 2 | `buttons-demo` | 68 | Button variants | No |
| 3 | `form-demo` | 84 | Form fields (text, password, number, textarea, date, time) | No |
| 4 | `toggles-demo` | 101 | Checkboxes and switches | No |
| 5 | `slider-demo` | 117 | Range slider | No |
| 6 | `list-demo` | 129 | List with options | No |
| 7 | `card-demo` | 144 | Card with title, body, actions | **Yes** — Save/Cancel buttons |
| 8 | `badge-avatar-demo` | 161 | Badges and avatar | No |
| 9 | `divider-demo` | 177 | Divider between text | No |
| 10 | `media-demo` | 190 | Image | No |
| 11 | `icon-demo` | 202 | Icon row | No |
| 12 | `select-demo` | 218 | Select dropdown | No |
| 13 | `choice-picker-demo` | 233 | Segmented choice picker | No |
| 14 | `modal-demo` | 248 | Modal dialog with open/close | **Yes** — Open/Close buttons |
| 15 | `tabs-demo` | 282 | Tabs with 3 panels | No |
| 16 | `video-demo` | 300 | Video player | No |
| 17 | `audio-demo` | 312 | Audio player | No |
| 18 | `binding-demo` | 324 | Data binding with increment | **Yes** — Increment button |

### Additional Issues

**Abbreviated IDs throughout:**
- `check1`/`check2` → `checkbox-terms`/`checkbox-subscribe`
- `switch1`/`switch2` → `switch-notifications`/`switch-dark-mode`
- `badge1`/`badge2`/`badge3` → `badge-count`/`badge-new`/`badge-overflow`
- `avatar1` → `avatar-user`
- `icon1`–`icon4` → `icon-house`/`icon-gear`/`icon-bell`/`icon-search`
- `img1` → `image-landscape`
- `div1` → `divider-main`
- `select1` → `select-option`
- `picker1` → `picker-size`
- `tabs1` → `tabs-product`
- `video1` → `video-flower`
- `audio1` → `audio-sample`
- `save-btn`/`cancel-btn` → `button-save`/`button-cancel`
- `open-btn`/`close-btn` → `button-open-modal`/`button-close-modal`
- `inc-btn` → `button-increment`
- `opt1`/`opt2`/`opt3` → `option-apple`/`option-banana`/`option-cherry`
- `sel-opt1`/`sel-opt2`/`sel-opt3` → `select-option-a`/`select-option-b`/`select-option-c`
- `cp-opt1`/`cp-opt2`/`cp-opt3` → `choice-small`/`choice-medium`/`choice-large`

**Card demo (line 144–158)** uses the old flat children pattern:
```js
{ id: 'card', component: 'Card', children: ['card-title', 'card-body', 'card-actions'] }
```
With `Text`, `Text`, and `Row` as direct children — should use `Header`, `Body`, `Footer`.

**Modal card (line 256)** same issue — Card with flat `Text`/`Text`/`Row` children instead of sub-containers.

## Migration Notes

- Demos that are purely display (no action buttons) can omit `Footer` — use `Card > Header | Body`
- Demos with action buttons need `Card > Header | Body | Footer` where Footer contains a `Row`
- The section heading (e.g., "Buttons") should move into `Header`
- Content should go into `Body > Column`
- Surface IDs should be preserved (they're referenced in bus event handlers for modal-demo and binding-demo)
- The `kernel.bus.on()` handlers for modal-demo (lines 266–279) and binding-demo (lines 359–378) reference specific event types with component IDs — update to match new IDs

## Component Map Updates (automatic)

Since `@nonoun/native-ai@1.0.15`, these A2UI types now map to proper native-ui elements:

| A2UI Type | Old Rendering | New Rendering |
|-----------|--------------|---------------|
| `Row` | `<div class="stack" direction="row">` | `<n-stack direction="row">` |
| `Column` | `<div class="stack">` | `<n-stack>` |
| `Badge` | `<span class="badge">` | `<n-badge>` |
| `Avatar` | `<span class="avatar">` | `<n-avatar>` |
| `Header` | *(new)* | `<n-header>` |
| `Body` | *(new)* | `<n-body>` |
| `Footer` | *(new)* | `<n-footer>` |

These render automatically — no CSS changes needed in the host.

## Files to Modify

| File | Lines | What to Change |
|------|-------|---------------|
| `src/pages/a2ui/a2ui-components.astro` | 52–321 | All 18 `adapter.receive()` calls — Card root + Header/Body/Footer + full-word IDs |
| `src/pages/a2ui/a2ui-components.astro` | 266–279 | Update `kernel.bus.on()` event types for modal if component IDs changed |
| `src/pages/a2ui/a2ui-components.astro` | 359–378 | Update `kernel.bus.on()` event type for binding-demo increment if ID changed |

## Convenience Links

- **Package presets for reference**: `native-ui/packages/native-ai/src/a2ui/a2ui-presets.ts`
- **Component map (type → element)**: `native-ui/packages/native-ai/src/a2ui/protocol/a2ui-component-map.ts`
- **Converter (Card sub-container logic)**: `native-ui/packages/native-ai/src/a2ui/protocol/a2ui-converter.ts`

## Verification

1. All 18 component demos render with Card root structure
2. Card demo shows `n-header`/`n-body`/`n-footer` inside `n-container`
3. Modal open/close still works (bus event types may need updating)
4. Data binding increment still works
5. Badge renders as `<n-badge>` (not `<span class="badge">`)
6. Avatar renders as `<n-avatar>` (not `<span class="avatar">`)
7. Row renders as `<n-stack direction="row">` (not `<div class="stack">`)
