# Codebase Audit — Rule Violations

Generated 2026-03-05 from a full sweep of `src/pages/`, `src/layouts/`, `src/scripts/`, and `src/styles/`.

Traits pages were fixed in `735c5a4` and are excluded from this audit.

---

## Summary

| Rule | Original | Remaining | Status |
|------|----------|-----------|--------|
| **#1** `<style>` without `is:global` for n-* | 0 | 0 | Clean |
| **#2** Server-side component class imports | 0 | 0 | Clean |
| **#3** Astro wrappers around n-* elements | 0 | 0 | Clean |
| **#4** CSS via `<link>` instead of `@import` | 0 | 0 | Clean |
| **#5** Unscoped bare element selectors | 7 | 0 | **Fixed** |
| **#6** Missing `:where()` on overrides | 1 | 0 | **Fixed** |
| **#7** JS/CSS workarounds for component bugs | 0 | 0 | Clean |
| **#8** Raw CSS on `n-*`/`native-*` | ~25 | 2 | **~23 fixed** (2 known API gaps) |
| **#9** CSS classes on `n-*`/`native-*` | ~820 | ~573 | **~250 fixed** (reference.astro deferred) |
| **#10** `n-card` without sub-containers | ~115 | 0 | **Fixed** |
| **#11** TypeScript in `<script>`/`.ts` | ~66 | 0 | **Fixed** |
| **#12** Missing/weak `astro:page-load` guard | 2 | 0 | **Fixed** |

Rules #1–4, #7: **Clean** — no violations found.

**Fixed:** ~483 violations across ~60 files
**Remaining:** ~575 violations (~573 in reference.astro + 2 known API gaps)

---

## Completed Fixes

### P0 — Runtime Crashes (Fixed)

| File | Rule | Fix |
|------|------|-----|
| `icons.astro` | #12, #9, #10 | Added `astro:page-load` guard, moved classes to wrapper divs, added `<n-body>` sub-containers |
| `kernel.astro` | #12, #9, #10 | Added `astro:page-load` guard, moved `class="status-bar"` to inner div, added `<n-body>` |
| `layout.ts:238` | #11 | Changed `dialog!.close()` → `dialog?.close()` |

### P1 — Rule #11 TypeScript (Fixed — 11 files, ~66 violations)

All `as Type` casts, `: Type` annotations, and `!` non-null assertions removed from `<script>` blocks. Replaced with optional chaining (`?.`), null guards, and JSDoc where needed.

Files: `ui-chart.astro`, `ui-chat.astro`, `data-table-page.astro`, `data-kanban.astro`, `form-multi-step.astro`, `notify-toast-demo.astro`, `overlay-command-palette.astro`, `overlay-confirmation.astro`, `form-faq.astro`, `account/security.astro`, `account/profile.astro`, `account/danger.astro`, `layout.ts`

### P1 — Rule #9 Classes on n-* Elements (Fixed — ~250 violations, ~39 files)

Classes moved from n-* elements to wrapper `<div>` or `<span>` elements. CSS selectors updated to target the wrapper.

Files: `auth/login.astro`, `auth/register.astro`, `index.astro`, `account/security.astro`, `account/danger.astro`, `blocks/auth-login.astro`, `blocks/auth-register.astro`, `blocks/auth-forgot-password.astro`, `blocks/auth-otp.astro`, `ui-controller.astro`, `ui-toolbar.astro`, `ui-divider.astro`, `ui-chart.astro`, `ui-textarea.astro`, `ui-input.astro`, `ui-calendar.astro`, `ui-slideshow.astro`, `ui-table.astro`, `ui-nav.astro`, `ui-pagination.astro`, `ui-select.astro`, `ui-switch.astro`, `ui-chat.astro`, `ui-pagination-dots.astro`, `ui-combobox.astro`, `ui-radio.astro`, `ui-checkbox.astro`, `ui-input-otp.astro`, `ui-range.astro`, `ui-field.astro`, `native-playground.astro`, `core/context.astro`, `a2ui/a2ui.astro`, `blocks/form-faq.astro`, `blocks/data-dashboard-stats.astro`, `blocks/notify-empty-state.astro`, `blocks/notify-error-page.astro`, `blocks/nav-file-browser.astro`, `blocks/form-multi-step.astro`, `containers/ui-stack.astro`, `containers/ui-grid.astro`, `icons.astro`, `kernel.astro`

### P1 — Rule #10 n-card Sub-containers (Fixed — ~115 violations, 12 files)

All bare n-card content wrapped in `<n-body>`. Fixed alongside Rule #9 in the same files.

Files: `ui-stack.astro`, `ui-grid.astro`, `icons.astro`, `kernel.astro`, `auth/login.astro`, `auth/register.astro`, `account/security.astro`, `account/danger.astro`, `blocks/auth-login.astro`, `blocks/auth-register.astro`, `blocks/auth-forgot-password.astro`, `blocks/auth-otp.astro`

### P2 — Rule #5 Unscoped Bare Selectors (Fixed — 7 violations, 2 files)

- **`demo.css`**: Removed redundant unscoped `h1`/`h2`/`h3`/`main` rules (already handled by scoped `n-app-panel` rules in `layout-blocks.css`). Scoped `main p` to `n-app-panel main p`.
- **`ui-table.astro:831`**: Scoped `h3:first-child` to `n-app-panel h3:first-child`.

### P2 — Rule #6 Missing `:where()` (Fixed — 1 violation)

- **`data-dashboard-stats.astro`**: Changed `n-footer { ... }` → `:where(n-footer) { ... }`.

---

### Rule #8 — Remaining Fixes

**n-field gap workarounds removed** (8 files): `n-field` default gap was fixed in native-ui (T0039/T0071). Workarounds were redundant.

**n-icon color → intent attribute** (4 files): Replaced raw CSS `color` with `intent` attribute (`muted`, `accent`, `success`).

**n-body padding** (1 file): form-contact.astro now uses `padding="relaxed"` attribute.

**n-button width** (1 file): Removed redundant `width: 100%` rule from notify-toast-demo.astro.

**n-footer layout** (1 file): Already wrapped in `:where()` — acceptable pattern.

**n-tab-panel padding** (1 file): Wrapped in `:where()` with known-API-gap comment.

---

## Remaining Issues

### Rule #8 — Known API Gaps (2 violations, 2 files)

| File | Element | Properties | Status |
|------|---------|-----------|--------|
| `components/ui-avatar.astro` | `n-avatar` | `outline`, `margin-inline-start` | Awaiting `n-avatar-group` component (T0071) |
| `blocks/data-detail-page.astro` | `n-tab-panel` | `padding-block` | No API — wrapped in `:where()` |

### Rule #9 — reference.astro (~573 violations)

The design system reference page uses `demo-*` classes pervasively on native-ui elements. Restructuring would be a massive effort. **Recommended:** Grant an infrastructure exception for `reference.astro`.

---

## Decisions Needed

1. **`reference.astro` (573 violations):** Infrastructure exception for Rule #9? The page's purpose is component showcase — restructuring to wrapper divs would be a massive effort with no UX benefit.
