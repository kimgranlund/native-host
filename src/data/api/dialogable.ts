import type { ApiReference } from './types';

export const dialogableApi: ApiReference = {
  element: 'dialogable',
  sections: [
    {
      kind: 'attributes',
      title: 'Host Attributes',
      rows: [
        {
          name: 'no-close-on-escape',
          type: 'boolean',
          default: '—',
          description: 'Prevent closing the dialog with the Escape key.',
        },
        {
          name: 'no-close-on-backdrop',
          type: 'boolean',
          default: '—',
          description: 'Prevent closing the dialog by clicking the backdrop.',
        },
        {
          name: 'open',
          type: 'boolean (read-only)',
          default: '—',
          description: 'Set by the controller when the dialog is open.',
        },
      ],
    },
    {
      kind: 'methods',
      rows: [
        {
          method: 'showModal()',
          returns: 'void',
          description: 'Open the dialog as a modal. Idempotent when already open.',
        },
        {
          method: 'close()',
          returns: 'void',
          description: 'Close the dialog. Dispatches a close event on the host.',
        },
        {
          method: 'destroy()',
          returns: 'void',
          description: 'Clean up event listeners and nullify the dialog reference.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'close',
          detail: '—',
          description: 'Dispatched on the host when the dialog is closed (via close(), Escape, or backdrop).',
        },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        {
          key: 'Escape',
          action: 'Close the dialog (unless no-close-on-escape is set).',
        },
      ],
    },
  ],
};
