# T0157: A2UI Protocol Page — Inline Preset Migration to Card Root Pattern

**Component:** `src/pages/a2ui/a2ui.astro`
**Severity:** Medium
**From:** native-ui → host

## Problem

The A2UI Protocol page (`a2ui.astro`) has **stale hardcoded inline presets** that use old conventions from before `@nonoun/native-ai@1.0.15`. The page has three categories of issues:

### 1. Stale PRESETS Object (lines 269–491)

The `PRESETS` object contains 8 presets using **old conventions**:

| Issue | Old Pattern | New Pattern |
|-------|------------|-------------|
| Column roots | `{ id: 'root', component: 'Column', children: [...] }` | `{ id: 'root', component: 'Card', children: ['card-header', 'card-body', 'card-footer'] }` |
| Abbreviated IDs | `btn`, `submit-btn`, `buy-btn`, `inc-btn` | `button-click`, `button-submit`, `button-buy`, `button-increment` |
| Card without sub-containers | `Card` → `child: 'card-content'` → flat Column | `Card` → `Header` + `Body` + `Footer` explicit children |
| Missing Header/Body/Footer | No sub-container types used | All Cards use `Header`, `Body`, `Footer` A2UI types |

**Affected presets:**
- `preset-hello` (line 270) — Column root, abbreviated `btn`
- `preset-form` (line 282) — Column root, `submit-btn`/`cancel-btn`
- `preset-card` (line 298) — Card without Header/Body/Footer, `buy-btn`/`wishlist-btn`
- `preset-list` (line 314) — Column root
- `preset-tabs` (line 329) — Column root, nav buttons instead of Tabs component
- `preset-data` (line 354) — Column root, `inc-btn`
- `preset-live-form` (line 369) — Column root, nested Card without sub-containers
- `preset-lab-results` (line 392) — Column root, nested Cards without sub-containers, abbreviated `cbc-wbc-val`/`met-glucose-val`/`lip-tc-val` etc.

### 2. Stale Streaming Preset (lines 574–645)

Three-phase streaming demo also uses Column roots and abbreviated IDs (`c1-title`, `c2-title`, `c3-title`, `refresh-btn`). All three phases need Card root + Header/Body/Footer wrapping.

### 3. Stale Multi-Surface Preset (lines 663–698)

Both Surface A (notes) and Surface B (tasks) use Column roots with abbreviated IDs (`save-btn`, `add-btn`, `t1`/`t2`/`t3`).

### 4. Dead Preset Buttons (10 of 20)

The HTML has 20 preset buttons, but only 10 have corresponding JS handlers. These buttons do nothing when clicked:

| Button ID | Label | Preset exists in package? |
|-----------|-------|--------------------------|
| `preset-vitals` | Vitals Monitor | Yes (`vitals`) |
| `preset-med-reconciliation` | Medication List | Yes (`med-reconciliation`) |
| `preset-referral` | Referral Form | Yes (`referral`) |
| `preset-icd-lookup` | ICD-10 Lookup | Yes (`icd-lookup`) |
| `preset-patient-intake` | Patient Intake | Yes (`patient-intake`) |
| `preset-prior-auth` | Prior Auth Status | Yes (`prior-auth`) |
| `preset-care-plan` | Care Plan | Yes (`care-plan`) |
| `preset-wizard` | Step Wizard | Yes (`wizard`) |
| `preset-confirm-delete` | Confirm Dialog | Yes (`confirm-delete`) |
| `preset-toggle-settings` | Settings Panel | Yes (`toggle-settings`) |

All 10 exist in the package's `PRESETS` export from `@nonoun/native-ai` — they just were never wired in the page JS.

## Recommended Approach

**Option A (Recommended): Import presets from the package**

The package now exports all 29 presets via `PRESETS` from `@nonoun/native-ai`. Instead of maintaining duplicate inline presets, import and use them:

```ts
import { createA2UIAdapter, PRESETS } from "@nonoun/native-ai";

// Wire all preset buttons dynamically
for (const [presetId, entry] of Object.entries(PRESETS)) {
  const btn = document.getElementById(`preset-${presetId}`);
  btn?.addEventListener('native:press', () => {
    clearChat();
    const container = appendAssistantMessage();
    // entry.envelopes is an array of A2UI messages
    for (const envelope of entry.envelopes) {
      adapter.receive(envelope, container);
    }
    chatPanel.setAttribute('open', '');
    surfaceCountEl.textContent = adapter.getSurfaceIds().length;
  });
}
```

This eliminates all inline preset duplication and ensures presets always match the package. The streaming and multi-surface presets can remain as custom inline handlers since they have special timing/multi-container logic.

**Option B: Update inline presets manually**

Update all 8 inline presets + streaming + multi-surface to use the Card root + Header/Body/Footer pattern with full-word IDs. Wire the 10 missing preset buttons.

## Canonical Pattern Reference

Every preset in `@nonoun/native-ai@1.0.15` follows this root structure:

```json
{
  "updateComponents": {
    "surfaceId": "demo",
    "components": [
      { "id": "root", "component": "Card", "children": ["card-header", "card-body", "card-footer"] },
      { "id": "card-header", "component": "Header", "children": ["title-text"] },
      { "id": "title-text", "component": "Text", "text": "Title", "variant": "h3" },
      { "id": "card-body", "component": "Body", "child": "body-content" },
      { "id": "body-content", "component": "Column", "children": ["..."] },
      { "id": "card-footer", "component": "Footer", "children": ["footer-actions"] },
      { "id": "footer-actions", "component": "Row", "children": ["button-primary", "button-secondary"] }
    ]
  }
}
```

- Root is always `Card`
- `Header` contains the title (and optionally badges/status)
- `Body` contains a `Column` with the main content
- `Footer` contains a `Row` with action buttons
- All IDs use full words: `button-submit` not `submit-btn`, `card-header` not `hdr`

## Files to Modify

| File | Lines | What to Change |
|------|-------|---------------|
| `src/pages/a2ui/a2ui.astro` | 269–491 | Replace or remove inline PRESETS object |
| `src/pages/a2ui/a2ui.astro` | 494–561 | Update preset button wiring loop |
| `src/pages/a2ui/a2ui.astro` | 574–645 | Update streaming preset phases |
| `src/pages/a2ui/a2ui.astro` | 663–698 | Update multi-surface preset |
| `src/pages/a2ui/a2ui.astro` | 66–92 | Add Travel/Hospitality preset button group (8 new: restaurant, room-service, amenities, room-recs, booking, concierge, checkout, local-guide) |

## ID Mapping (for manual migration)

| Old ID Pattern | New ID Pattern |
|---------------|---------------|
| `btn` | `button-click` |
| `submit-btn` | `button-submit` |
| `cancel-btn` | `button-cancel` |
| `buy-btn` | `button-buy` |
| `wishlist-btn` | `button-wishlist` |
| `inc-btn` | `button-increment` |
| `save-btn` | `button-save` |
| `add-btn` | `button-add` |
| `refresh-btn` | `button-refresh` |
| `download-btn` | `button-download` |
| `share-btn` | `button-share` |
| `history-btn` | `button-history` |
| `c1-title` | `card-first-title` |
| `c2-title` | `card-second-title` |
| `t1`/`t2`/`t3` | `task-review`/`task-documentation`/`task-deploy` |
| `cbc-wbc-val` | `CBC-WBC-value` |

## Convenience Links

- **Package presets source**: `native-ui/packages/native-ai/src/a2ui/a2ui-presets.ts`
- **Package PRESETS export**: `import { PRESETS } from '@nonoun/native-ai'`
- **A2UI converter (Header/Body/Footer support)**: `native-ui/packages/native-ai/src/a2ui/protocol/a2ui-converter.ts`
- **Component map**: `native-ui/packages/native-ai/src/a2ui/protocol/a2ui-component-map.ts`

## Verification

1. All 20+ preset buttons render correctly with Card root + Header/Body/Footer
2. Streaming preset shows incremental delivery with Card-wrapped phases
3. Multi-surface preset renders both surfaces with Card roots
4. Lab results preset renders with nested Cards inside the root Card's body
5. Data binding preset still wires increment action correctly
6. Live form preset still wires input-to-preview data flow
