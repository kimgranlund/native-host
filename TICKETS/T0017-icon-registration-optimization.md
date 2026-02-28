# T0017: Optimize icon registration — review `?raw` bulk imports

**Severity:** Medium
**From:** native-ui → native-host

## Current Approach

`src/scripts/icons.ts` imports 175+ Phosphor SVGs using Vite's `?raw` modifier and registers each one individually:

```ts
import arrowClockwise from '@phosphor-icons/core/regular/arrow-clockwise.svg?raw';
import arrowDown from '@phosphor-icons/core/regular/arrow-down.svg?raw';
// ... 170+ more imports
import chatDotsFill from '@phosphor-icons/core/fill/chat-dots-fill.svg?raw';
// ... fill variants

registerIcon('arrow-clockwise', arrowClockwise);
registerIcon('arrow-down', arrowDown);
// ... 170+ more registrations
```

## Concerns

### 1. Bundle size from unused icons

Every imported SVG is inlined into the JS bundle, even if it's only used on one page. With 175+ icons, this is a significant chunk of the main bundle. Audit which icons are actually used — there may be leftover registrations from removed pages.

### 2. All icons load on every page

Since `icons.ts` is imported in the layout, all 175+ icons are registered on every page load. A page that only uses 3 icons still downloads and registers all 175.

### 3. Fill variant registration

Only 4 fill variants are currently registered (`chat-dots-fill`, `code-fill`, `sidebar-simple-fill`, `sliders-horizontal-fill`). With the new `weight="fill"` attribute (T0013), the icon element computes `name-fill` automatically — but the fill SVG must still be registered. Review whether more fill variants are needed.

## Suggested Actions

### A. Audit unused icons

Search every `.astro`, `.ts`, `.tsx` file for `name="icon-name"` or `registerIcon('icon-name'`. Remove registrations for icons not referenced anywhere. This is the lowest-effort, highest-impact change.

### B. Consider per-page icon sets (optional)

For pages with unique icons (e.g. a dashboard with chart icons not used elsewhere), consider a page-level script that registers only those icons. The layout script would register only the shared nav/header icons.

### C. Register fill variants for toggle icons

With `weight="fill"` now available, identify all icons used in toggle states and ensure both regular and fill variants are registered:

```ts
// Regular (already registered)
registerIcon('heart', heartRegular);
// Fill (may need adding)
registerIcon('heart-fill', heartFill);
```

Toggle icons to check: `sidebar-simple`, `chat-dots`, `code`, `sliders-horizontal`, `moon`/`sun`, `heart`, `star`, `bell`, `eye`.

## Notes

- `@nonoun/native-ui` ships pre-built Phosphor icon modules in `src/icons/phosphor/` — these are ES modules that self-register when imported. An alternative to `?raw` + `registerIcon()` is to import these modules directly:
  ```ts
  import '@nonoun/native-ui/icons/phosphor/house';
  ```
  This is functionally identical but lets the bundler tree-shake unused icons more easily.
- The `ui-icon` element has built-in lazy recovery — if an icon is used before registration, it subscribes to `onIconRegistered` and renders when the icon becomes available. This means icons can be registered asynchronously without FOUC.
