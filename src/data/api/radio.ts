import type { ApiReference } from './types';

export const radioApi: ApiReference = {
  element: 'n-radio-group',
  sections: [
    {
      kind: 'attributes',
      title: 'Attributes \u2014 n-radio-group',
      rows: [
        { name: 'value', type: 'string', default: '\u2014', description: 'Currently selected radio value.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all radios in the group.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required for form validation.' },
        { name: 'name', type: 'string', default: '\u2014', description: 'Form field name.' },
        { name: 'orientation', type: '"vertical" | "horizontal"', default: '"vertical"', description: 'Layout direction of radio items.' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
      ],
    },
    {
      kind: 'attributes',
      title: 'Attributes \u2014 n-radio',
      rows: [
        { name: 'value', type: 'string', default: '""', description: 'Radio value emitted on selection.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this individual radio.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:change', detail: '{ value, label }', description: 'Fired when the selected radio changes. Dispatched by n-radio-group.' },
        { event: 'native:select', detail: '{ value, label }', description: 'Fired on individual radio click (internal, caught by group). Dispatched by n-radio.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-checked="true"]', description: 'Selected radio.' },
        { selector: '[aria-checked="false"]', description: 'Unselected radio.' },
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
        { key: 'ArrowDown / ArrowRight', action: 'Moves to next radio and selects it.' },
        { key: 'ArrowUp / ArrowLeft', action: 'Moves to previous radio and selects it.' },
        { key: 'Enter / Space', action: 'Selects the focused radio.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Group role', value: 'radiogroup (via ElementInternals on n-radio-group)' },
        { property: 'Item role', value: 'radio (via ElementInternals on n-radio)' },
        { property: 'Form associated', value: 'Yes \u2014 n-radio-group participates in form submission, validation, reset, and restore.' },
        { property: 'Focus', value: 'Roving tabindex managed by ListNavigateController. Only the active radio is tabbable.' },
      ],
    },
  ],
};
