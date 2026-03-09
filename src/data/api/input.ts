import type { ApiReference } from './types';

export const inputApi: ApiReference = {
  element: 'n-input',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'value', type: 'string', default: '""', description: 'Current text value.' },
        { name: 'placeholder', type: 'string', default: '""', description: 'Placeholder text shown when empty.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction. Sets aria-disabled="true" and removes from tab order.' },
        { name: 'readonly', type: 'boolean', default: 'false', description: 'Prevents editing while remaining focusable.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required for form validation.' },
        { name: 'name', type: 'string', default: '\u2014', description: 'Form field name.' },
        { name: 'type', type: '"text" | "password"', default: '"text"', description: 'Input type. Password masks text via CSS text-security.' },
        { name: 'pattern', type: 'string', default: '\u2014', description: 'Regex pattern for constraint validation.' },
        { name: 'formatting', type: 'string', default: '\u2014', description: 'Space-separated list of enabled formats (e.g. "code").' },
        { name: 'variant', type: '"outline" | "default"', default: '"secondary"', description: 'Visual variant. CSS-only, no JS.' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'density', type: '"compact" | "default" | "loose"', default: 'inherited', description: 'Inline padding density. CSS-only, cascades from parent.' },
        { name: 'radius', type: '"sharp" | "default" | "round"', default: '"round"', description: 'Border radius. CSS-only.' },
        { name: 'inline', type: 'boolean', default: 'false', description: 'Shrink-wraps the input instead of filling available width.' },
      ],
    },
    {
      kind: 'slots',
      rows: [
        { slot: 'leading', description: 'Leading icon or element (before text). Non-interactive, pointer-events: none.' },
        { slot: 'trailing', description: 'Trailing icon or element (after text). Non-interactive, pushed to far right.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:input', detail: '{ value }', description: 'Fired on each keystroke.' },
        { event: 'native:change', detail: '{ value }', description: 'Fired on blur.' },
        { event: 'native:format', detail: '{ type, value }', description: 'Fired after formatting is applied.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: ':state(empty)', description: 'Present when the input has no text content. Used for placeholder display.' },
        { selector: '[aria-disabled="true"]', description: 'Disabled state. Use for custom disabled styling.' },
        { selector: '[force-hover]', description: 'Forces hover appearance for debugging/testing.' },
        { selector: '[force-focus]', description: 'Forces focus ring appearance for debugging/testing.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'Enter', action: 'Triggers implicit form submission (like native input). Prevented inside n-combobox.' },
        { key: 'Cmd/Ctrl+E', action: 'Toggles code formatting (when formatting="code" is enabled).' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'textbox (via ElementInternals)' },
        { property: 'Form associated', value: 'Yes \u2014 participates in form submission, validation, reset, and restore.' },
        { property: 'Focus', value: 'Inner .n-input-surface receives focus. Host shows focus ring via :focus-within.' },
      ],
    },
  ],
};
