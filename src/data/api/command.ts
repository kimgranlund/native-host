import type { ApiReference } from './types';

export const commandApi: ApiReference = {
  element: 'n-command',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all interaction. Sets aria-disabled="true".' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'density', type: '"compact" | "default" | "loose"', default: 'inherited', description: 'Inline padding density. CSS-only, cascades from parent.' },
        { name: 'radius', type: '"sharp" | "default" | "round"', default: 'inherited', description: 'Border radius. CSS-only.' },
      ],
    },
    {
      kind: 'slots',
      rows: [
        { slot: 'n-command-input', description: 'Search input wrapper. Contains a native input for typing.' },
        { slot: 'n-command-list', description: 'Scrollable container for items and groups.' },
        { slot: 'n-command-group', description: 'Group of related items with a heading. Auto-hides when all items are filtered out.' },
        { slot: 'n-command-item', description: 'Selectable action item. Uses same CSS as n-option.' },
        { slot: 'n-command-empty', description: 'Empty state shown when no items match the filter.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:change', detail: '{ value, label }', description: 'Fired when an item is selected (click or Enter).' },
        { event: 'native:dismiss', detail: '\u2014', description: 'Fired on Escape key press.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-disabled="true"]', target: 'n-command', description: 'Disabled state on the command palette.' },
        { selector: '[active]', target: 'n-command-item', description: 'Keyboard-highlighted item.' },
        { selector: '[hidden]', target: 'n-command-item', description: 'Filtered-out item.' },
        { selector: '[force-hover]', target: 'n-command-item', description: 'Forces hover appearance on item.' },
        { selector: '[force-active]', target: 'n-command-item', description: 'Forces active appearance on item.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'ArrowDown', action: 'Moves to next visible item.' },
        { key: 'ArrowUp', action: 'Moves to previous visible item.' },
        { key: 'Home', action: 'Moves to first visible item.' },
        { key: 'End', action: 'Moves to last visible item.' },
        { key: 'Enter', action: 'Selects the active item.' },
        { key: 'Escape', action: 'Fires native:dismiss event.' },
        { key: 'Type', action: 'Filters items by search text (first match is always highlighted).' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'search (via ElementInternals on n-command)' },
        { property: 'List role', value: 'n-command-list acts as the listbox with aria-activedescendant.' },
        { property: 'Focus', value: 'Focus stays in the search input. Items are highlighted via [active] attribute (virtual focus).' },
      ],
    },
  ],
};
