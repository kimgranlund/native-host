import type { ApiReference } from './types';

export const checkboxApi: ApiReference = {
  element: 'n-checkbox',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'checked', type: 'boolean', default: 'false', description: 'Whether the checkbox is checked.' },
        { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Indeterminate (mixed) state. Clears on first press, then toggles normally.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction. Sets aria-disabled="true" and removes from tab order.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required for form validation.' },
        { name: 'name', type: 'string', default: '\u2014', description: 'Form field name.' },
        { name: 'value', type: 'string', default: '"on"', description: 'Form value submitted when checked.' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:change', detail: '{ checked, value }', description: 'Fired on toggle.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-checked="true"]', description: 'Checked state.' },
        { selector: '[aria-checked="mixed"]', description: 'Indeterminate state.' },
        { selector: '[aria-checked="false"]', description: 'Unchecked state.' },
        { selector: '[aria-disabled="true"]', description: 'Disabled state.' },
        { selector: '[pressed]', description: 'Present while pointer or key is held down.' },
        { selector: '[force-hover]', description: 'Forces hover appearance for debugging/testing.' },
        { selector: '[force-active]', description: 'Forces active appearance for debugging/testing.' },
        { selector: '[force-focus-visible]', description: 'Forces focus ring for debugging/testing.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'Enter', action: 'Toggles the checkbox.' },
        { key: 'Space', action: 'Toggles the checkbox (on key up).' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'checkbox (via ElementInternals)' },
        { property: 'Form associated', value: 'Yes \u2014 submits value when checked, null when unchecked.' },
        { property: 'Focus', value: 'tabindex="0", managed by disabled effect.' },
      ],
    },
  ],
};
