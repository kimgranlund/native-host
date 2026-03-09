import type { ApiReference } from './types';

export const switchApi: ApiReference = {
  element: 'n-switch',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'checked', type: 'boolean', default: 'false', description: 'Whether the switch is on.' },
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
        { selector: '[aria-checked="true"]', description: 'On state. Track fills with surface color, thumb slides right.' },
        { selector: '[aria-checked="false"]', description: 'Off state. Muted track, thumb at left.' },
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
        { key: 'Enter', action: 'Toggles the switch.' },
        { key: 'Space', action: 'Toggles the switch (on key up).' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'switch (via ElementInternals)' },
        { property: 'Form associated', value: 'Yes \u2014 submits value when checked, null when unchecked.' },
        { property: 'Focus', value: 'tabindex="0", managed by disabled effect.' },
      ],
    },
  ],
};
