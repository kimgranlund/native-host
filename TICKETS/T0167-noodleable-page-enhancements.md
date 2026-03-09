# T0167: Noodleable page — Interactive Flow Builder enhancements

**Component:** Noodleable trait page
**Severity:** N/A (feature work, completed)
**From:** host

## Summary

Enhanced the Interactive Flow Builder section of the noodleable trait page with canvas controls, presentation mode, a live JSON code editor pane, and initial connections on load.

## What Was Done

### 1. Initial connections on page load

Two noodle connections are created automatically when the page loads so the flow builder isn't empty:

```js
connections: [
  { id: 'init-1', from: 'f-sensor', to: 'f-filter', fromPort: 'right', toPort: 'left' },
  { id: 'init-2', from: 'f-transform', to: 'f-merge', fromPort: 'right', toPort: 'left' },
]
```

### 2. Canvas controls (bottom-left overlay)

A `.flow-canvas-controls` container positioned at `left: 1.5rem; bottom: 1.5rem` inside the canvas pane, containing:

- **Alignment Guides toggle** (`<n-switch>`) — toggles `magnet.guides` at runtime via `native:change` event
- **Present mode button** (`<n-button>`) — opens the flow builder in presentation mode (PresentController), swaps icon between `arrows-out` / `arrows-in`

### 3. Present mode (PresentController)

Uses `PresentController` (not Fullscreen API) to present `.flow-split` as a modal overlay:

- `presentCtrl.present()` on button click
- Listens for `native:present` / `native:dismiss` events to toggle the icon
- `noodle.update()` called after present/dismiss to recalculate SVG positions
- CSS: `[presented]` removes `max-height`, `border`, `border-radius` constraints

### 4. Live JSON code editor pane

A CodeMirror (`@nonoun/native-code`) editor alongside the canvas showing live JSON of the graph state:

**Layout:**
```
.flow-split (flex row, max-height: 75dvh, background: var(--n-panel))
├── .flow-split-canvas (flex: 2, position: relative)
│   ├── #flow-arena (noodle + magnet arena)
│   └── .flow-canvas-controls (absolute, bottom-left)
└── .flow-split-editor (flex: 1, border-left)
    └── CodeMirror (JSON, read-only-ish)
```

**Bidirectional sync:**
- **Canvas → Editor**: After `native:noodle-connect`, `native:noodle-disconnect`, `native:magnet-snap`, `native:magnet-drop`, or node add — serializes graph (nodes + connections) to JSON and updates editor
- **Editor → Canvas**: On `EditorView.updateListener` with `docChanged` — parses JSON, diffs against current graph, applies changes (add/remove nodes, add/remove connections, reposition). Debounced ~300ms.

**JSON schema:**
```json
{
  "nodes": [
    { "id": "f-sensor", "label": "Sensor", "intent": "accent", "ports": "right", "x": 24, "y": 32 }
  ],
  "connections": [
    { "id": "c1", "from": "f-sensor", "to": "f-filter", "fromPort": "right", "toPort": "left" }
  ]
}
```

**Scrolling fix:** `.flow-split-editor` uses flex column with `min-height: 0` on inner div + `.cm-scroller { overflow: auto }` to ensure CodeMirror scrolls within the constrained pane.

### 5. `.flow-split` container styling

- `max-height: 75dvh` — constrains the builder height
- `background-color: var(--n-panel)` — gives the canvas area a distinct surface
- `border: 2px dashed var(--n-border-muted-neutral)` + `border-radius: var(--n-radius)`
- `overflow: hidden`

### 6. Icon registration

Added `arrows-in` to `src/scripts/icons.ts` (was missing — `arrows-out` already existed).

## Files Modified

| File | What |
|------|------|
| `src/pages/traits/noodleable.astro` | All HTML, JS, CSS changes |
| `src/scripts/icons.ts` | Added `arrows-in` icon registration |
