# T0001: `ui-nav-group` cannot be server-rendered as closed

**Component:** `ui-nav-group`
**Severity:** Medium
**From:** native-host → native-ui

## Problem

`ui-nav-group` defaults its internal `open` signal to `true` in the constructor (`#e = t(!0)`). This means:

1. If the server renders `<ui-nav-group open>` — the group opens (correct).
2. If the server renders `<ui-nav-group>` (no `open` attribute) — `attributeChangedCallback` never fires, the signal stays `true`, and the group **still opens**.

There is no way to server-render a closed nav group.

## Expected Behavior

Follow the `<details>` element pattern:
- `<ui-nav-group open>` → expanded
- `<ui-nav-group>` (no `open`) → collapsed

The constructor should default `open` to `false`, and the presence of the `open` attribute should opt into the expanded state. This is the standard HTML boolean attribute contract and what SSR frameworks (Astro, Next.js, etc.) expect.

## Current Workaround

Client-side JS applies `.open = false` after `customElements.whenDefined('ui-nav-group')` for groups that should be closed. This causes a visible flash — groups render expanded then collapse after JS runs.

## Impact

Any SSR application that persists nav group states (e.g., via cookies) cannot render the correct collapsed state on first paint. The user sees all groups expanded, then they jump to the persisted state once JS executes.

## Suggested Fix

In `ui-nav-group`'s constructor, default the `open` signal to `false` (or derive it from `this.hasAttribute('open')` during `setup()`). This aligns with the HTML `<details>` pattern and enables SSR.
