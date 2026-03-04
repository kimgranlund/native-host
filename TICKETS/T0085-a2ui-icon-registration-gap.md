# T0085 — native-a2ui should register or document required icons

**Status:** open
**From:** host → native-ui
**Package:** `@nonoun/native-a2ui`
**Severity:** DX / documentation

## Problem

The published `@nonoun/native-a2ui` dist does not register the Phosphor icons it uses. The host must manually discover and register them, which is error-prone (icons appear as empty boxes until someone notices and adds them).

### Icons required by native-a2ui

These are used in the workbench toolbar and UI but not registered by the package:

| Icon | Variant | Used For |
|------|---------|----------|
| `arrows-out-simple` | regular | Expand/fullscreen toggle |
| `arrows-in-simple` | regular | Collapse/minimize toggle |
| `play-fill` | fill | Play All button |
| `caret-left` | regular | Step back |
| `caret-right` | regular | Step forward |
| `arrow-counter-clockwise` | regular | Reset |

The source code imports from `../../../src/icons/phosphor/` (monorepo-internal paths) which are not included in the published dist.

## Suggested Fix

Either:

1. **Bundle icon registrations** in the package's `register` entry point — so consumers get icons automatically with `import '@nonoun/native-a2ui/register'`
2. **Export a list of required icons** — e.g. `@nonoun/native-a2ui/icons` that consumers can import
3. **Document the required icons** in the package README — so consumers know what to register

Option 1 is the most consumer-friendly. Option 3 is the minimum acceptable.

## Workaround

The host currently registers all icons manually in `src/scripts/icons.ts`:

```ts
import arrowsInSimple from '@phosphor-icons/core/assets/regular/arrows-in-simple.svg?raw';
import arrowsOutSimple from '@phosphor-icons/core/assets/regular/arrows-out-simple.svg?raw';
import playFill from '@phosphor-icons/core/assets/fill/play-fill.svg?raw';
// + registerIcon() calls
```

This pattern doesn't scale as the component adds new icons.
