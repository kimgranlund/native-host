# T0018: Draggable preview mode requires consumer-side view-transition wiring for grid animation

**Component:** DragController (draggable trait)
**Severity:** Medium
**From:** native-host → native-ui

## Problem

In `preview` mode with a CSS Grid container (`axis="both"`), the live DOM reordering works correctly — but there is no animation. Cells jump instantly to their new positions because grid layout doesn't animate between reflows.

To get smooth reorder animation, the consumer must:

1. Assign unique `view-transition-name` to every cell (excluding the dragged one)
2. Re-assign names on `ui-drag-start` and `ui-drop`/`ui-drag-cancel`
3. Add a `::view-transition-group(*)` CSS rule for duration/easing

### Current consumer code (draggable.astro)

```js
function assignGridTransitionNames() {
  for (const [i, cell] of [...previewGrid.querySelectorAll('.grid-cell')].entries()) {
    cell.style.viewTransitionName = cell.hasAttribute('dragging') ? 'none' : `grid-cell-${i}`;
  }
}
assignGridTransitionNames();
previewGrid.addEventListener('ui-drag-start', () => assignGridTransitionNames());
previewGrid.addEventListener('ui-drop', (e) => {
  assignGridTransitionNames();
  // ...
});
previewGrid.addEventListener('ui-drag-cancel', (e) => {
  assignGridTransitionNames();
  // ...
});
```

```css
::view-transition-group(*) {
  animation-duration: 150ms;
  animation-timing-function: ease;
}
```

This is ~15 lines of boilerplate that every grid drag consumer would need to duplicate.

## Expected Behavior

The DragController should handle view-transition animation internally for `preview` mode:

1. Auto-assign `view-transition-name` to sibling items when drag starts
2. Use `document.startViewTransition()` around DOM moves during drag
3. Clean up transition names on drop/cancel
4. Expose optional `draggable-animate` attribute (default: `true`) to opt out

The consumer should only need:

```html
<ui-controller traits="draggable"
  draggable-selector=".grid-cell"
  draggable-axis="both"
  draggable-mode="preview">
  <div class="drag-grid">...</div>
</ui-controller>
```

No JS event wiring for animation, no `::view-transition-group` CSS.

## Impact

Every consumer using `preview` mode with grid or flex layouts needs to duplicate this view-transition boilerplate. The pattern is generic enough to live inside the controller.

## Additional: Unhandled AbortError on rapid drag

When dragging quickly, `document.startViewTransition()` is called in rapid succession. Each new transition aborts the previous one, and the rejected promise surfaces as an uncaught `AbortError: Transition was skipped` in the console. The DragController should catch `AbortError` rejections from `startViewTransition()` — they are expected when transitions overlap and are functionally harmless.

## Where

`src/pages/traits/draggable.astro:397-412` (JS) and `:538-541` (CSS)
