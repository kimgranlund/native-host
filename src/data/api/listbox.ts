import type { ApiReference } from './types';

export const listboxApi: ApiReference = {
  element: 'n-listbox',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction. Sets aria-disabled="true".' },
        { name: 'multiple', type: 'boolean', default: 'false', description: 'Enables multi-select mode (toggle selection).' },
        { name: 'virtual-focus', type: 'boolean', default: 'false', description: 'Uses [active] attribute instead of roving tabindex. Set automatically by n-combobox.' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'density', type: '"compact" | "default" | "loose"', default: 'inherited', description: 'Inline padding density. CSS-only, cascades from parent.' },
        { name: 'radius', type: '"sharp" | "default" | "round"', default: 'inherited', description: 'Border radius. CSS-only.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:change', detail: '{ value, label }', description: 'Fired when selection changes (click or keyboard).' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-disabled="true"]', target: 'n-listbox', description: 'Disabled state on the listbox.' },
        { selector: '[aria-selected="true"]', target: 'n-option', description: 'Selected option.' },
        { selector: '[active]', target: 'n-option', description: 'Keyboard-highlighted option.' },
        { selector: '[force-hover]', target: 'n-option', description: 'Forces hover appearance on option.' },
        { selector: '[force-active]', target: 'n-option', description: 'Forces active appearance on option.' },
        { selector: '[force-focus-visible]', target: 'n-option', description: 'Forces focus ring on option.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'ArrowDown', action: 'Moves to next option.' },
        { key: 'ArrowUp', action: 'Moves to previous option.' },
        { key: 'Home', action: 'Moves to first option.' },
        { key: 'End', action: 'Moves to last option.' },
        { key: 'Enter / Space', action: 'Selects the focused option.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'listbox (via ElementInternals)' },
        { property: 'Options', value: 'n-option children with role="option", aria-selected' },
        { property: 'Active descendant', value: 'aria-activedescendant tracks the keyboard-highlighted option.' },
        { property: 'Focus', value: 'Roving tabindex across options (or virtual focus via [active] when inside combobox).' },
      ],
    },
  ],
};
