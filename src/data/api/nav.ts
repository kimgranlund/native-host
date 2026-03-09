import type { ApiReference } from './types';

export const navApi: ApiReference = {
  element: 'n-sidebar-nav',
  sections: [
    {
      kind: 'attributes',
      title: 'Attributes \u2014 n-sidebar-nav',
      rows: [
        { name: 'value', type: 'string', default: '\u2014', description: 'Currently selected nav item value.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all nav items. Sets aria-disabled="true".' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
      ],
    },
    {
      kind: 'attributes',
      title: 'Attributes \u2014 n-sidebar-nav-item',
      rows: [
        { name: 'value', type: 'string', default: '""', description: 'Item value emitted on selection.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this individual nav item.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:change', detail: '{ value, label }', description: 'Fired when selection changes.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-disabled="true"]', description: 'Disabled state on nav or individual item.' },
        { selector: 'n-sidebar-nav-item[aria-current="page"]', description: 'Currently selected nav item.' },
        { selector: 'n-sidebar-nav-item[force-hover]', description: 'Forces hover appearance on a nav item.' },
        { selector: 'n-sidebar-nav-item[force-active]', description: 'Forces active appearance on a nav item.' },
        { selector: 'n-sidebar-nav-item[force-focus-visible]', description: 'Forces focus ring on a nav item.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'ArrowUp / ArrowDown', action: 'Move focus between nav items (roving focus).' },
        { key: 'Home', action: 'Focus first nav item.' },
        { key: 'End', action: 'Focus last nav item.' },
        { key: 'Enter / Space', action: 'Select the focused nav item.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'navigation (via ElementInternals)' },
        { property: 'Selection', value: 'aria-current="page" on the selected item.' },
        { property: 'Focus', value: 'Roving focus via ListNavigateController (vertical orientation).' },
        { property: 'Groups', value: 'n-sidebar-group wraps collapsible sections with details/summary.' },
      ],
    },
  ],
};
