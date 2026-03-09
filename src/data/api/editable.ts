import type { ApiReference } from './types';

export const editableApi: ApiReference = {
  element: 'editable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-editable-trigger',
          type: "'click' | 'dblclick'",
          default: "'dblclick'",
          description: 'Pointer event that starts edit mode.',
        },
        {
          name: 'data-trait-editable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Prevents editing when true.',
        },
      ],
    },
    {
      kind: 'methods',
      rows: [
        {
          method: 'startEdit()',
          returns: 'void',
          description: 'Programmatically enter edit mode.',
        },
        {
          method: 'commitEdit()',
          returns: 'string',
          description: 'Commit the current edit and exit edit mode. Returns the new value.',
        },
        {
          method: 'cancelEdit()',
          returns: 'void',
          description: 'Cancel the current edit and restore the original value.',
        },
        {
          method: 'destroy()',
          returns: 'void',
          description: 'Cancel any active edit and remove event listeners.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:edit-start',
          detail: '{ value }',
          description: 'Fired when edit mode begins. value is the current text.',
        },
        {
          event: 'native:edit-commit',
          detail: '{ value, previousValue }',
          description: 'Fired when an edit is committed. value is the new text.',
        },
        {
          event: 'native:edit-cancel',
          detail: '{ value }',
          description: 'Fired when an edit is cancelled. value is the restored original text.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[editing]',
          description: 'Present on the host element while in edit mode.',
        },
        {
          selector: '[contenteditable="plaintext-only"]',
          description: 'Set on the host element during editing to enable plain-text input.',
        },
      ],
    },
  ],
};
