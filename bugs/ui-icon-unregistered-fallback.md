# ui-icon: Unregistered icon names render visible fallback instead of empty

## Component
`<ui-icon>`

## Package version
`@nonoun/native-ui@^0.1.0`

## Description
When `<ui-icon name="some-name">` is used with a name that hasn't been registered via `registerIcon()`, the icon renders a visible fallback (appears to show a generic shape/placeholder) instead of rendering as empty/invisible.

This is visible on the `ui-chat` demo page where icons like `chat-dots`, `dots-three`, `microphone`, and `dots-three-outline-fill` are used in the markup but are not registered in the host application. These icons appear as visible elements, making buttons and header slots that contain them visible when they should effectively be invisible (collapsed to zero-size with no content).

## Reproduction

```html
<!-- No registerIcon('microphone', ...) called -->
<ui-icon name="microphone"></ui-icon>
```

**Expected:** Renders as empty/invisible (zero width or hidden) since no SVG is registered for that name.

**Actual:** Renders as a visible element with some kind of fallback content or dimensions.

## Impact
On the `ui-chat` demo page, the idle chat shell shows extra toolbar buttons (microphone, model selector) and header elements (leading icon, trailing menu) that should be invisible because their icon content isn't registered. This makes the idle state look different from the design intent.

## Note
This may be intentional (show a placeholder so developers know icons need registration). If so, consider documenting the expected behavior and how to suppress the fallback. If unintentional, unregistered icons should collapse to empty so surrounding buttons render as icon-only buttons with no visible icon (effectively invisible).
