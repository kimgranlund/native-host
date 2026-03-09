import type { ApiReference } from './types';

export const toastableApi: ApiReference = {
  element: 'toastable',
  sections: [
    {
      kind: 'methods',
      rows: [
        {
          method: 'toast(options)',
          returns: 'number',
          description: 'Show a toast notification. Returns the toast ID. Options: { message, intent?, duration? }.',
        },
        {
          method: 'dismissToast(id)',
          returns: 'void',
          description: 'Dismiss a specific toast by its ID.',
        },
        {
          method: 'dismissAllToasts()',
          returns: 'void',
          description: 'Dismiss all active toasts.',
        },
        {
          method: 'destroy()',
          returns: 'void',
          description: 'Dismiss all toasts and clean up.',
        },
      ],
    },
    {
      kind: 'attributes',
      title: 'Toast Options',
      rows: [
        {
          name: 'message',
          type: 'string',
          default: '—',
          description: 'Toast message text. Required.',
        },
        {
          name: 'intent',
          type: "'info' | 'success' | 'warning' | 'danger'",
          default: "'info'",
          description: 'Visual intent that maps to a surface color.',
        },
        {
          name: 'duration',
          type: 'number',
          default: '4000',
          description: 'Auto-dismiss time in milliseconds. 0 = sticky (manual dismiss only).',
        },
      ],
    },
  ],
};
