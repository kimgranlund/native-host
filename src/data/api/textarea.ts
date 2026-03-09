import type { ApiReference } from './types';

export const textareaApi: ApiReference = {
  element: 'n-textarea',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'value', type: 'string', default: '""', description: 'Current text value.' },
        { name: 'placeholder', type: 'string', default: '\u2014', description: 'Placeholder text shown when empty.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction. Sets aria-disabled="true" and removes from tab order.' },
        { name: 'readonly', type: 'boolean', default: 'false', description: 'Prevents editing while remaining focusable.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required for form validation.' },
        { name: 'name', type: 'string', default: '\u2014', description: 'Form field name for submission.' },
        { name: 'rows', type: '1 | 2 | 3 | 4 | 5 | 6 | 8 | 10', default: '3', description: 'Minimum visible rows (sets min-height via --n-rows).' },
        { name: 'maxlength', type: 'number', default: '\u2014', description: 'Maximum character count. Triggers tooLong validity.' },
        { name: 'autogrow', type: 'boolean', default: 'false', description: 'Automatically grows height to fit content. Disables resize handle.' },
        { name: 'pattern', type: 'string', default: '\u2014', description: 'Regex pattern for validation (patternMismatch).' },
        { name: 'formatting', type: 'string', default: '\u2014', description: 'Space-separated list of enabled formats (e.g. "code bold italic").' },
        { name: 'variant', type: '"secondary"', default: '"secondary"', description: 'Visual variant. CSS-only.' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'radius', type: '"sharp" | "default" | "round"', default: '"round"', description: 'Border radius. CSS-only.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:input', detail: '{ value }', description: 'Fired on each keystroke.' },
        { event: 'native:change', detail: '{ value }', description: 'Fired on blur.' },
        { event: 'native:format', detail: '{ type, value }', description: 'Fired after inline formatting is applied.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: ':state(empty)', description: 'Present when the textarea has no content. Used for placeholder display.' },
        { selector: '[aria-disabled="true"]', description: 'Disabled state. Use for custom disabled styling.' },
        { selector: '[force-hover]', description: 'Forces hover appearance for debugging/testing.' },
        { selector: '[force-focus]', description: 'Forces focus appearance for debugging/testing.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'Cmd/Ctrl+B', action: 'Toggle bold formatting (when formatting includes "bold").' },
        { key: 'Cmd/Ctrl+I', action: 'Toggle italic formatting (when formatting includes "italic").' },
        { key: 'Cmd/Ctrl+E', action: 'Toggle code formatting (when formatting includes "code").' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'textbox (via ElementInternals)' },
        { property: 'aria-multiline', value: 'true' },
        { property: 'Form associated', value: 'Yes \u2014 participates in form submission, reset, and validation.' },
        { property: 'Focus', value: 'tabindex="0", managed by disabled effect.' },
      ],
    },
  ],
};
