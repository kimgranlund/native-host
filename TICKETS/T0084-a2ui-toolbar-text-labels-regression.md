# T0084 — native-a2ui toolbar text labels regression

**Status:** open
**From:** host → native-ui
**Package:** `@nonoun/native-a2ui`
**Severity:** visual regression

## Problem

The playback toolbar buttons in `<native-a2ui>` show only icons on the local source but icons + text labels on the published npm version (`0.1.4`).

**Published (correct):** `−1  ↻ Reset  +1  ▶ Play All`
**Local source (broken):** only icons — `‹  ↻  ›  ▶`

## Root Cause

`#createToolbarButton` in the local source only renders an `<n-icon>` in `innerHTML`. The `title` parameter is used solely for the tooltip, not as visible button text:

```ts
#createToolbarButton(className: string, title: string, icon: string, iconFill = false): HTMLElement {
  const btn = document.createElement('n-button');
  btn.className = className;
  btn.title = title;
  btn.setAttribute('variant', 'ghost');
  btn.innerHTML = `<n-icon name="${icon}"${iconFill ? ' weight="fill"' : ''}></n-icon>`;
  return btn;
}
```

The published `0.1.4` was built from a version of the source that included text content in the buttons.

## Expected Fix

Add text labels back to the buttons, e.g.:

```ts
btn.innerHTML = `<n-icon name="${icon}"${iconFill ? ' weight="fill"' : ''}></n-icon> ${title}`;
```

Or use a dedicated label parameter if the text should differ from the tooltip.

## Affected Buttons

| Button | Icon | Expected Label |
|--------|------|----------------|
| Step back | `caret-left` | −1 |
| Reset | `arrow-counter-clockwise` | Reset |
| Step forward | `caret-right` | +1 |
| Play all | `play` (fill) | Play All |
