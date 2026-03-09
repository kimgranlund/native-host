import type { ApiReference } from './types';

export const selectApi: ApiReference = {
  element: 'n-select',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'value', type: 'string', default: '\u2014', description: 'Currently selected value. Reflects to attribute.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction. Cascades to trigger button and closes popover.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required for form validation.' },
        { name: 'name', type: 'string', default: '\u2014', description: 'Form field name.' },
        { name: 'options', type: 'string (JSON)', default: '\u2014', description: 'JSON array of { value, label } objects. Activates data-driven mode.' },
        { name: 'src', type: 'string (URL)', default: '\u2014', description: 'URL to fetch options from. Activates data-driven mode.' },
        { name: 'placeholder', type: 'string', default: '\u2014', description: 'Placeholder text when no value is selected (data-driven mode only).' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'density', type: '"compact" | "default" | "loose"', default: 'inherited', description: 'Inline padding density. CSS-only, cascades from parent.' },
        { name: 'radius', type: '"sharp" | "default" | "round"', default: 'inherited', description: 'Border radius. CSS-only, cascades from parent.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:change', detail: '{ value, label, previousValue }', description: 'Fired when selection changes.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'Enter / Space', action: 'Toggles popover when closed. Selects active option when open.' },
        { key: 'ArrowDown', action: 'Opens popover and moves to next option.' },
        { key: 'ArrowUp', action: 'Opens popover and moves to previous option.' },
        { key: 'Escape', action: 'Closes the popover.' },
        { key: 'Home', action: 'Moves to first option.' },
        { key: 'End', action: 'Moves to last option.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Pattern', value: 'Coordinator \u2014 display: contents, no visual presence. Wires ARIA + events between trigger button and popover listbox.' },
        { property: 'Trigger ARIA', value: 'aria-haspopup="listbox", aria-controls, aria-expanded' },
        { property: 'Form associated', value: 'Yes \u2014 participates in form submission, validation, reset, and restore.' },
        { property: 'Focus', value: 'Focus lives on the trigger n-button child.' },
      ],
    },
  ],
};
