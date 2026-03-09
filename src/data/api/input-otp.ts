import type { ApiReference } from './types';

export const inputOtpApi: ApiReference = {
  element: 'n-input-otp',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'value', type: 'string', default: '""', description: 'Current OTP value.' },
        { name: 'length', type: 'number', default: '6', description: 'Number of cells (1-12).' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction. Sets aria-disabled="true".' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required for form validation.' },
        { name: 'name', type: 'string', default: '\u2014', description: 'Form field name for submission.' },
        { name: 'pattern', type: 'string', default: '"[0-9]"', description: 'Regex pattern for allowed characters per cell.' },
        { name: 'mask', type: 'string', default: '\u2014', description: 'Mask character for display (e.g. "*"). Shows dots instead of entered characters.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'radius', type: '"sharp" | "default" | "round"', default: 'inherited', description: 'Border radius. CSS-only.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:input', detail: '{ value }', description: 'Fired on each cell change.' },
        { event: 'native:change', detail: '{ value }', description: 'Fired when all cells are filled.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-disabled="true"]', description: 'Disabled state.' },
        { selector: '[force-hover]', description: 'Forces hover appearance on cells for debugging/testing.' },
        { selector: '[force-focus]', description: 'Forces focus appearance on cells for debugging/testing.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: '0-9', action: 'Enter digit and auto-advance to next cell.' },
        { key: 'Backspace', action: 'Clear current cell, or move to previous cell if empty.' },
        { key: 'Delete', action: 'Clear current cell.' },
        { key: 'ArrowLeft', action: 'Move to previous cell.' },
        { key: 'ArrowRight', action: 'Move to next cell.' },
        { key: 'Paste', action: 'Distributes pasted text across cells (filtered by pattern).' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'group (via ElementInternals)' },
        { property: 'Form associated', value: 'Yes \u2014 participates in form submission, reset, and validation.' },
        { property: 'Focus', value: 'Individual cells are focusable via contenteditable.' },
      ],
    },
  ],
};
