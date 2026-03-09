import type { ApiReference } from './types';

export const sortableApi: ApiReference = {
  element: 'sortable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-sortable-selector',
          type: 'string',
          default: "''",
          description: 'CSS selector for clickable header elements within the host.',
        },
        {
          name: 'data-trait-sortable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables sort cycling when true. Header clicks are ignored.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:sort',
          detail: '{ column, direction }',
          description: "Fired when sort state changes. column is the column name (from data-column attribute or text content). direction is 'asc', 'desc', or 'none'. The consumer handles actual data reordering.",
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[aria-sort="ascending"]',
          description: "Set on the header element for the currently sorted column when direction is 'asc'.",
        },
        {
          selector: '[aria-sort="descending"]',
          description: "Set on the header element for the currently sorted column when direction is 'desc'.",
        },
      ],
    },
  ],
};
