import type { ApiReference } from './types';

export const dismissableApi: ApiReference = {
  element: 'dismissable',
  sections: [
    {
      kind: 'methods',
      rows: [
        {
          method: 'enable()',
          returns: 'void',
          description: 'Enable click-outside and Escape key dismiss behavior.',
        },
        {
          method: 'disable()',
          returns: 'void',
          description: 'Temporarily disable dismiss behavior without destroying the controller.',
        },
        {
          method: 'destroy()',
          returns: 'void',
          description: 'Remove all event listeners and clean up.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:dismiss',
          detail: '—',
          description: 'Fired when click-outside or Escape occurs and the host is dismissed.',
        },
      ],
    },
  ],
};
