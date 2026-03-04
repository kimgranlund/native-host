# T0086 — Eliminate redundant class handles on stamped elements

**Status:** open
**From:** host → native-ui
**Scope:** all `@nonoun/*` packages
**Type:** rule + refactoring plan

## Rule

When components stamp internal UI, use semantic element selectors — not class handles.

**DO:**

```css
native-a2ui n-header { ... }
native-a2ui n-toolbar { ... }
native-a2ui [data-panel="json-in"] { ... }
:where(native-tokens-panel) native-tokens-section { ... }
```

**DO NOT:**

```css
native-a2ui .a2ui-command-selector { ... }
.a2ui-pane { ... }
.pg-editor { ... }
```

Consumers should be able to target any internal structure with standard CSS selectors and override as they choose. Class handles create an opaque internal API that's harder to inspect and override.

### Exceptions

- **CodeMirror decoration classes** (`cm-a2ui-sent`, `cm-a2ui-next`, `md-image`) — CodeMirror requires class-based decorations. These are fine.
- **State modifier classes** that toggle on/off may remain if no attribute equivalent exists, but prefer `[data-*]` attributes.

### Migration Path

For each class handle, replace with one of:
1. **Custom element** — stamp a registered or unregistered custom element tag instead of `<div class="...">`. Already done for `n-header`, `n-body`, `n-footer`, etc.
2. **`[data-role]` or `[data-panel]` attribute** — for structural divs that can't be custom elements. Selector: `native-a2ui [data-role="preview"]`.
3. **Semantic HTML** — `<output>`, `<nav>`, `<aside>`, `<details>` where appropriate.
4. **`:where()` wrappers** — keep specificity low so consumers can override easily.

---

## Full Audit — Class Handles Across All Packages

### native-ui core (15 classes)

| Class | Element | File | Suggested Replacement |
|-------|---------|------|-----------------------|
| `n-virtual-spacer-top` | div | virtual-scroll-controller.ts | `[data-role="spacer-top"]` |
| `n-virtual-spacer-bottom` | div | virtual-scroll-controller.ts | `[data-role="spacer-bottom"]` |
| `n-toast-container` | div | toast-controller.ts | `<n-toast-container>` custom element or `[data-role]` |
| `drag-placeholder` | div | drag-controller.ts | `[data-role="drag-placeholder"]` |
| `n-input-surface` | span | input-element.ts | `n-input > [data-role="surface"]` or `<n-input-surface>` |
| `n-toast-message` | span | toast-element.ts | `:scope > span` or `[data-role="message"]` |
| `n-toast-close` | button | toast-element.ts | `n-toast > n-button` or `[data-role="close"]` |
| `n-segmented-indicator` | div | segmented-control-element.ts | `[data-role="indicator"]` |
| `n-dot-indicator` | div | pagination-dots-element.ts | `[data-role="indicator"]` |
| `n-pagination-ellipsis` | span | pagination-element.ts | `[data-role="ellipsis"]` |
| `n-tree-caret` | n-icon | tree-item-element.ts | `n-tree-item > n-icon` positional |
| `n-tree-children` | div | tree-item-element.ts | `[data-role="children"]` or `<n-tree-children>` |
| `n-otp-cell` | div | input-otp-element.ts | `[data-role="cell"]` |
| `n-range-thumb` | div | range-element.ts | `[data-role="thumb"]` |

### native-app (2 classes)

| Class | Element | File | Suggested Replacement |
|-------|---------|------|-----------------------|
| `icon-well` | div | sidebar-group-header-element.ts | `[data-role="icon-well"]` |
| `nav-group-flyout` | details | sidebar-group-element.ts | `details[popover]` or `[data-role="flyout"]` |

### native-chat (14 classes)

| Class | Element | File | Suggested Replacement |
|-------|---------|------|-----------------------|
| `n-chat-message-actions` | n-toolbar | chat-message-element.ts | `n-chat-message > n-toolbar` positional |
| `n-chat-prose` | output | chat-message-text-element.ts | `n-chat-message-text > output` |
| `n-chat-activity-row` | div | chat-message-activity-element.ts | `[data-role="activity-row"]` |
| `n-chat-activity-time` | span | chat-message-activity-element.ts | `[data-role="time"]` |
| `n-chat-activity-sep` | span | chat-message-activity-element.ts | `[data-role="separator"]` |
| `n-chat-activity-label` | span | chat-message-activity-element.ts | `[data-role="label"]` |
| `n-chat-activity-dots` | span | chat-message-activity-element.ts | `[data-role="dots"]` |
| `n-chat-activity-content` | div | chat-message-activity-element.ts | `[data-role="content"]` |
| `n-chat-genui-container` | div | chat-message-genui-element.ts | `[data-role="container"]` |
| `n-chat-genui-error` | div | chat-message-genui-element.ts | `[data-role="error"]` |
| `n-chat-genui-preview` | n-card | chat-message-genui-element.ts | `n-chat-message-genui > n-card` |
| `n-chat-structured-*` (3) | div | chat-input-structured-element.ts | `[data-role="question\|options\|actions"]` |
| `n-chat-feed-virtual-container` | div | chat-feed-element.ts | `[data-role="virtual-container"]` |
| `n-chat-avatar-initials` | span | chat-avatar-element.ts | `n-chat-avatar > span` |
| `submit-btn` | n-button | chat-panel-element.ts | `n-chat-panel n-footer n-button` positional |

### native-tokens (10 classes)

| Class | Element | File | Suggested Replacement |
|-------|---------|------|-----------------------|
| `native-tokens-section` | div | build-tokens.ts | `<native-tokens-section>` custom element |
| `native-tokens-heading` | div | build-tokens.ts | `<native-tokens-heading>` or `[data-role="heading"]` |
| `native-tokens-subheading` | div | build-tokens.ts | `[data-role="subheading"]` |
| `native-tokens-colors-strip` | div | build-tokens.ts | `[data-role="colors-strip"]` |
| `native-tokens-variable-row` | div | tokens-variable-element.ts | `:scope > div` positional |
| `native-tokens-variable-label` | span | tokens-variable-element.ts | `[data-role="label"]` |
| `native-tokens-variable-value` | span | tokens-variable-element.ts | `[data-role="value"]` |
| `native-tokens-swatch-label` | span | tokens-color-swatch-element.ts | `[data-role="label"]` |
| `native-tokens-swatch-popover` | div | tokens-color-swatch-element.ts | `div[popover]` |
| `native-tokens-swatch-popover-*` (3) | div/span | tokens-color-swatch-element.ts | `[data-role="header\|label\|value"]` inside popover |

### native-editor (2 classes + 1 CodeMirror exception)

| Class | Element | File | Suggested Replacement |
|-------|---------|------|-----------------------|
| `native-editor-surface` | div | editor-element.ts | `[data-role="surface"]` |
| `native-editor-resize-handle` | div | editor-element.ts | `[data-role="resize-handle"]` |
| `md-image` | img | decorations.ts | *CodeMirror exception — keep* |

### native-playground (9 classes)

| Class | Element | File | Suggested Replacement |
|-------|---------|------|-----------------------|
| `pg-split` | div | playground-element.ts | `[data-role="split"]` |
| `pg-editor` | div | playground-element.ts | `[data-role="editor"]` |
| `pg-code-panel` | div | playground-element.ts | `[data-role="code-panel"]` |
| `pg-console` | div | playground-element.ts | `[data-role="console"]` or `<output>` |
| `pg-resize-handle` | div | playground-element.ts | `[data-role="resize-handle"]` |
| `pg-preview` | iframe | playground-element.ts | `native-playground > iframe` |
| `pg-console-line` | div | playground-element.ts | `[data-level="info"]` |
| `pg-console-warn` | div | playground-element.ts | `[data-level="warn"]` |
| `pg-console-error` | div | playground-element.ts | `[data-level="error"]` |

### native-a2ui (15 classes + 2 CodeMirror exceptions)

| Class | Element | File | Suggested Replacement |
|-------|---------|------|-----------------------|
| `a2ui-split` | div | a2ui-element.ts | `[data-role="split"]` |
| `a2ui-preview` | div | a2ui-element.ts | `[data-role="preview"]` |
| `a2ui-preview-content` | div | a2ui-element.ts | `[data-role="preview-content"]` |
| `a2ui-resize-handle` | div | a2ui-element.ts | `[data-role="resize-handle"]` |
| `a2ui-pane` | div | a2ui-element.ts | `[data-panel]` (already has this attr) |
| `a2ui-pane-content` | div | a2ui-element.ts | `[data-role="pane-content"]` |
| `a2ui-log-entry` | div | a2ui-element.ts | `[data-role="log-entry"]` |
| `a2ui-log-type` | span | a2ui-element.ts | `[data-log-type]` with value as the type |
| `a2ui-log-type--sent` | modifier | a2ui-element.ts | `[data-log-type="sent"]` |
| `a2ui-log-type--received` | modifier | a2ui-element.ts | `[data-log-type="received"]` |
| `a2ui-log-type--action` | modifier | a2ui-element.ts | `[data-log-type="action"]` |
| `a2ui-log-type--error` | modifier | a2ui-element.ts | `[data-log-type="error"]` |
| `a2ui-log-type--info` | modifier | a2ui-element.ts | `[data-log-type="info"]` |
| `a2ui-btn-run` | n-button | a2ui-element.ts | `n-button[data-action="play"]` |
| `cm-a2ui-sent` | decoration | a2ui-element.ts | *CodeMirror exception — keep* |
| `cm-a2ui-next` | decoration | a2ui-element.ts | *CodeMirror exception — keep* |

---

## Summary

| Package | Class Handles | Exceptions | To Refactor |
|---------|--------------|------------|-------------|
| native-ui core | 14 | 0 | 14 |
| native-app | 2 | 0 | 2 |
| native-chat | 14 | 0 | 14 |
| native-tokens | 10 | 0 | 10 |
| native-editor | 2 | 1 (CM) | 2 |
| native-playground | 9 | 0 | 9 |
| native-a2ui | 13 | 2 (CM) | 13 |
| **Total** | **64** | **3** | **64** |

## Rollout Suggestion

1. Add the rule to the native-ui contribution guide / CLAUDE.md
2. Refactor packages incrementally — one package per release
3. Suggested order (by impact): native-ui core → native-chat → native-a2ui → native-tokens → native-playground → native-editor → native-app
4. Each refactored package gets a minor version bump (selectors are a breaking change for consumers using the class names)
5. Upgrade tickets to host for each release
