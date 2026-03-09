# T0166: Upgrade to native-ui@0.7.70 — noodle port interactions + n-footer slot support

**Component:** Package upgrade
**Severity:** Medium
**From:** native-ui → host

## What Changed

### 1. NoodleController port interaction improvements (T0164)

Port dots now have proper interactive states during drag-to-connect:

- **`:active` / dragging source**: `scale(1.1)` + darker fill via `[data-noodle-dragging]`
- **Valid target highlight**: All compatible ports pulse via `[data-noodle-droppable]` with `scale(1.3)` + animated ring
- **Hover during drag**: Hovered target shows `scale(1.6)` + solid glow via `[data-noodle-drop-ready]`

Drop detection upgraded from `elementFromPoint` (10px pixel-perfect) to **proximity-based snap** — finds nearest port within 30px radius on `pointerup`. Much easier to connect nodes.

### 2. n-footer slot support (T0165)

`n-footer` now supports `slot="leading"` / `slot="trailing"` with grid-based layout, matching `n-header`:

```css
:where(n-footer):has(> [slot="leading"]):has(> [slot="trailing"]) {
  display: grid;
  grid-template-columns: auto 1fr auto;
}
```

## Migration Steps

### 1. Upgrade package

```bash
npm install @nonoun/native-ui@0.7.70
```

### 2. Remove n-footer workarounds

Any host CSS that manually handled footer layout for leading/trailing content can be removed. For example in `data-dashboard-stats.astro`:

```css
/* REMOVE — slots handle this now */
.stat-card n-footer {
  justify-content: flex-start;
  gap: 0.5rem;
}
```

The `slot="leading"` and `slot="trailing"` attributes already in the HTML will now work natively.

### 3. Verify noodleable page

The noodleable trait page should automatically benefit from the improved port interactions — no HTML/JS changes needed. The CSS states are applied via data attributes by the controller internally.

Verify:
- Drag from a port → source dot changes appearance
- Compatible target ports pulse/glow during drag
- Dropping near (within ~30px) a target port snaps the connection
- All existing connections and demos still work

## Files to Check

| File | What |
|------|------|
| `package.json` | Bump `@nonoun/native-ui` to `^0.7.70` |
| `src/pages/blocks/data-dashboard-stats.astro` | Remove manual n-footer flex workaround |
| `src/pages/traits/noodleable.astro` | Visual verification only — no code changes needed |
