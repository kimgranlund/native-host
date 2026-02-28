# T0013: Adopt `weight="fill"` for toggle icons

**Severity:** Low
**From:** native-ui → native-host

## Summary

`ui-icon` now supports a `weight` attribute. Setting `weight="fill"` resolves `name="heart"` to the `heart-fill` registry key. This enables icon weight toggling via attribute instead of `innerHTML` replacement.

## Before

```ts
// Swapping between regular and fill required innerHTML
const icon = button.querySelector('ui-icon');
if (active) {
  icon.innerHTML = IconHeartFill;  // import raw SVG string
} else {
  icon.innerHTML = IconHeart;
}
```

## After

```html
<ui-icon name="heart"></ui-icon>
```

```ts
// Toggle via attribute
const icon = button.querySelector('ui-icon');
icon.setAttribute('weight', active ? 'fill' : 'regular');

// Or remove the attribute entirely for regular weight
icon.toggleAttribute('weight', active);
// (weight="" is treated as regular, only weight="fill" switches)
```

## Where to Apply

Search for:
- `innerHTML` assignments involving icon SVG strings (e.g. `IconXFill`, `IconX`)
- Patterns that swap between `name-fill` and `name` on `ui-icon`
- Toggle buttons (like/bookmark/star) that change icon appearance on state change

Common candidates:
- Like/favorite buttons (heart, star)
- Bookmark toggles
- Pin/unpin controls
- Any icon that has a filled active state

## Notes

- Only `weight="fill"` has special behavior — it appends `-fill` to the name when looking up the registry
- If the name already ends in `-fill` (e.g. `name="heart-fill"`), the weight attribute is ignored (no double-suffix)
- Regular weight is the default — omitting the attribute or setting `weight="regular"` gives the standard outline icon
- Both the regular and fill icon modules must be imported/registered for this to work
