import type { ApiReference } from './types';

export const presentableApi: ApiReference = {
  element: 'presentable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-presentable-inset',
          type: 'string',
          default: "'2rem'",
          description: 'Safety margin from viewport edges (CSS length value).',
        },
        {
          name: 'data-trait-presentable-close-button',
          type: 'boolean',
          default: 'true',
          description: 'Show a close button in the top-right corner of the overlay. Set to "false" to hide.',
        },
      ],
    },
    {
      kind: 'methods',
      rows: [
        {
          method: 'present()',
          returns: 'void',
          description: 'Wrap the host in a dialog and show it as a modal overlay.',
        },
        {
          method: 'dismiss()',
          returns: 'void',
          description: 'Close the overlay and restore the host to its original position.',
        },
        {
          method: 'toggle()',
          returns: 'void',
          description: 'Toggle between present and dismiss.',
        },
        {
          method: 'destroy()',
          returns: 'void',
          description: 'Dismiss if open and clean up all event listeners.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:present',
          detail: '—',
          description: 'Dispatched after the dialog opens and content is presented. Bubbles.',
        },
        {
          event: 'native:dismiss',
          detail: '—',
          description: 'Dispatched after the dialog closes and the host is restored. Bubbles.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[presented]',
          description: 'Present on the host element while the overlay is open. Use for fullscreen styling.',
        },
        {
          selector: 'dialog[data-present]::backdrop',
          description: 'The dialog backdrop. Default: rgba(0,0,0,0.75).',
        },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        {
          key: 'Escape',
          action: 'Dismiss the overlay and restore the host.',
        },
      ],
    },
  ],
};
