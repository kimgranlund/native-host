import type { ApiReference } from './types';

export const collapsibleApi: ApiReference = {
  element: 'collapsible',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-collapsible-duration',
          type: 'number',
          default: '200',
          description: 'Animation duration in milliseconds.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:expand',
          detail: '—',
          description: 'Fired after expand animation completes.',
        },
        {
          event: 'native:collapse',
          detail: '—',
          description: 'Fired after collapse animation completes.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[collapsed]',
          description: 'Present on the element when collapsed.',
        },
      ],
    },
  ],
};
