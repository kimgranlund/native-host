import type { ApiReference } from './types';

export const shortcutableApi: ApiReference = {
  element: 'shortcutable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-shortcutable-shortcuts',
          type: 'string (JSON)',
          default: "'[]'",
          description: 'JSON array of shortcut definitions: [{ id, combo, description? }]. combo uses + to join keys (e.g. "mod+k", "shift+alt+p").',
        },
        {
          name: 'data-trait-shortcutable-global',
          type: 'boolean',
          default: 'false',
          description: 'Listen for shortcuts globally on the document rather than within the host element.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:shortcut',
          detail: '{ id, combo }',
          description: 'Fired when a registered shortcut combo is pressed. id is the shortcut identifier, combo is the matched key combination.',
        },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        {
          key: 'mod',
          action: 'Meta (Cmd) on macOS, Ctrl on Windows/Linux.',
        },
        {
          key: 'ctrl, meta, shift, alt',
          action: 'Modifier keys used in combo strings joined with +.',
        },
      ],
    },
  ],
};
