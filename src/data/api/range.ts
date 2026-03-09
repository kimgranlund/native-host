import type { ApiReference } from './types';

export const rangeApi: ApiReference = {
  element: 'n-range',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'value', type: 'number', default: '50', description: 'Current value.' },
        { name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
        { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
        { name: 'step', type: 'number', default: '1', description: 'Step increment. Values snap to this increment.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction. Sets aria-disabled="true" and removes from tab order.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required for form validation.' },
        { name: 'name', type: 'string', default: '\u2014', description: 'Form field name for submission.' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:input', detail: '{ value }', description: 'Fired continuously during drag.' },
        { event: 'native:change', detail: '{ value }', description: 'Fired on drag end or keyboard change.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[pressed]', description: 'Present while the thumb is being dragged.' },
        { selector: '[aria-disabled="true"]', description: 'Disabled state. Use for custom disabled styling.' },
        { selector: '[force-hover]', description: 'Forces hover appearance for debugging/testing.' },
        { selector: '[force-active]', description: 'Forces active/pressed appearance for debugging/testing.' },
        { selector: '[force-focus-visible]', description: 'Forces focus ring on thumb for debugging/testing.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'ArrowRight / ArrowUp', action: 'Increase by step.' },
        { key: 'ArrowLeft / ArrowDown', action: 'Decrease by step.' },
        { key: 'PageUp', action: 'Increase by step x 10.' },
        { key: 'PageDown', action: 'Decrease by step x 10.' },
        { key: 'Home', action: 'Jump to minimum.' },
        { key: 'End', action: 'Jump to maximum.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'slider (via ElementInternals)' },
        { property: 'ARIA attributes', value: 'aria-valuenow, aria-valuemin, aria-valuemax synced to value/min/max.' },
        { property: 'Form associated', value: 'Yes \u2014 participates in form submission, reset, and validation.' },
        { property: 'Focus', value: 'tabindex="0", managed by disabled effect.' },
      ],
    },
  ],
};
