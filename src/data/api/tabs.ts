import type { ApiReference } from './types';

export const tabsApi: ApiReference = {
  element: 'n-tabs',
  sections: [
    {
      kind: 'attributes',
      title: 'Attributes \u2014 n-tabs',
      rows: [
        { name: 'value', type: 'string', default: '\u2014', description: 'Currently selected tab value.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all tabs. Cascades to child n-tab elements.' },
        { name: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Layout direction. Horizontal uses row layout with underline indicator; vertical uses column with side indicator.' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'density', type: '"compact" | "default" | "loose"', default: 'inherited', description: 'Inline padding density. CSS-only, cascades from parent.' },
        { name: 'inline', type: 'boolean', default: 'false', description: 'Shrink-wraps the tabs container.' },
      ],
    },
    {
      kind: 'attributes',
      title: 'Attributes \u2014 n-tab',
      rows: [
        { name: 'value', type: 'string', default: '\u2014', description: 'Tab value used for selection matching.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this individual tab.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:change', detail: '{ value, label }', description: 'Fired when the active tab changes.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-selected="true"]', target: 'n-tab', description: 'Active tab.' },
        { selector: '[aria-disabled="true"]', target: 'n-tabs', description: 'Disabled tablist.' },
        { selector: '[pressed]', target: 'n-tab', description: 'Present while pointer or key is held down.' },
        { selector: '[force-hover]', target: 'n-tab', description: 'Forces hover appearance on tab.' },
        { selector: '[force-active]', target: 'n-tab', description: 'Forces active appearance on tab.' },
        { selector: '[force-focus-visible]', target: 'n-tab', description: 'Forces focus ring on tab.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'ArrowRight / ArrowDown', action: 'Moves to next tab and selects it.' },
        { key: 'ArrowLeft / ArrowUp', action: 'Moves to previous tab and selects it.' },
        { key: 'Home', action: 'Moves to first tab.' },
        { key: 'End', action: 'Moves to last tab.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'tablist (via ElementInternals on n-tabs)' },
        { property: 'Tab items', value: 'n-tab with role="tab", aria-selected, aria-controls' },
        { property: 'Panels', value: 'n-tab-panel with role="tabpanel", aria-labelledby' },
        { property: 'Focus', value: 'Roving tabindex managed by ListNavigateController. Only the selected tab is tabbable.' },
      ],
    },
  ],
};
