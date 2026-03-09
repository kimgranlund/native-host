import type { ApiReference } from './types';

export const selectableApi: ApiReference = {
  element: 'selectable',
  sections: [
    {
      kind: 'attributes',
      title: 'Constructor Options',
      rows: [
        {
          name: 'selector',
          type: 'string',
          default: "':scope > *'",
          description: 'CSS selector for selectable items within the host.',
        },
        {
          name: 'mode',
          type: "'single' | 'multiple'",
          default: "'multiple'",
          description: "Selection mode. 'single' allows only one item at a time.",
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables all selection interaction when true.',
        },
      ],
    },
    {
      kind: 'methods',
      rows: [
        {
          method: 'select(item)',
          returns: 'void',
          description: 'Select an item element.',
        },
        {
          method: 'toggle(item)',
          returns: 'void',
          description: 'Toggle selection of an item element.',
        },
        {
          method: 'rangeTo(item)',
          returns: 'void',
          description: 'Extend the selection from the current anchor to the given item.',
        },
        {
          method: 'selectAll()',
          returns: 'void',
          description: 'Select all items (multiple mode only).',
        },
        {
          method: 'clear()',
          returns: 'void',
          description: 'Deselect all items.',
        },
        {
          method: 'getSelection()',
          returns: 'Element[]',
          description: 'Return an array of currently selected item elements.',
        },
        {
          method: 'handleClick(item, { shift, ctrl })',
          returns: 'void',
          description: 'Process a click event with modifier keys, applying single/range/toggle selection semantics.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:selection-change',
          detail: '{ selected, count }',
          description: 'Fired when the selection changes. selected is an array of selected elements.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[selected]',
          description: 'Present on currently selected item elements.',
        },
        {
          selector: '[selection-anchor]',
          description: 'Present on the anchor item used as the start point for range selection.',
        },
      ],
    },
  ],
};
