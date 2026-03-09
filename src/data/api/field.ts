import type { ApiReference } from './types';

export const fieldApi: ApiReference = {
  element: 'n-field',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Cascades disabled state to the child control. Sets aria-disabled="true" on the field.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Cascades required state to the child control. Shows asterisk after label.' },
        { name: 'invalid', type: 'boolean', default: 'false', description: 'Set automatically on native:invalid event. Shows the error slot.' },
        { name: 'gap', type: '"none" | "tight" | "relaxed"', default: '\u2014', description: 'Vertical gap between label, control, and description.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
      ],
    },
    {
      kind: 'slots',
      rows: [
        { slot: 'label', description: 'Field label text. Wired to the control via aria-labelledby.' },
        { slot: 'description', description: 'Help text below the control. Wired via aria-describedby.' },
        { slot: 'error', description: 'Error message, hidden until [invalid] is set. Added to aria-describedby when visible.' },
        { slot: '(default)', description: 'The form control (n-input, n-select, n-checkbox, etc.).' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:invalid', detail: '{ message? }', description: 'Sets [invalid] and updates error slot text.' },
        { event: 'native:valid', detail: '\u2014', description: 'Removes [invalid] and error from aria-describedby.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-disabled="true"]', description: 'Disabled state. Label and description show disabled color.' },
        { selector: '[invalid]', description: 'Validation error state. Shows the error slot.' },
        { selector: '[required]', description: 'Required state. Appends asterisk to label.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'ARIA wiring', value: 'Auto-wires aria-labelledby and aria-describedby on the child control.' },
        { property: 'Control discovery', value: 'Finds the first unslotted form control (n-input, n-select, n-checkbox, etc.).' },
      ],
    },
  ],
};
