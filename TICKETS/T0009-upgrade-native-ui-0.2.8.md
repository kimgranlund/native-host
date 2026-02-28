# T0009: Upgrade to `@nonoun/native-ui@0.2.8`

**Severity:** High
**From:** native-ui → native-host

## Summary

`@nonoun/native-ui@0.2.8` ships 82 audit fixes + 7 ticket resolutions. Two breaking changes require migration. This ticket covers the package bump and the two mandatory code changes.

## Breaking Changes

### 1. `ui-nav-group` defaults to closed (T0001)

**Before:** `<ui-nav-group>` rendered expanded by default (signal initialized `true`).
**After:** `<ui-nav-group>` renders collapsed by default (matches `<details>` pattern).

**Migration:** Add `open` attribute to every `<ui-nav-group>` that should start expanded:

```html
<!-- Before (was always open) -->
<ui-nav-group>

<!-- After (explicitly open) -->
<ui-nav-group open>
```

Search the codebase for `<ui-nav-group` and decide which groups should be open on first render. Groups that should start collapsed need no change.

### 2. `OverlayManager.open()` returns `OverlayHandle` (T0002)

**Before:** `open()` returned a `string` (the overlay ID).
**After:** `open()` returns `{ id: string, closed: Promise<void> }`.

**Migration:** Destructure the return value:

```ts
// Before
const id = overlays.open({ type: 'popover', element: el });

// After
const { id } = overlays.open({ type: 'popover', element: el });

// Or, to await close:
const { id, closed } = overlays.open({ type: 'popover', element: el });
await closed; // resolves when overlay is dismissed by any method
```

Search for `overlays.open(` / `.open({` in the codebase.

## Steps

1. `npm install @nonoun/native-ui@0.2.8`
2. Fix all `ui-nav-group` markup (add `open` where needed)
3. Fix all `OverlayManager.open()` call sites (destructure `{ id }`)
4. Verify build + dev server — no regressions
