import type { ApiReference } from './types';

export const draggableApi: ApiReference = {
  element: 'draggable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-draggable-selector',
          type: 'string',
          default: "':scope > *'",
          description: 'CSS selector for draggable items within the host.',
        },
        {
          name: 'data-trait-draggable-drop-zone-selector',
          type: 'string',
          default: "''",
          description: 'CSS selector for drop zone elements.',
        },
        {
          name: 'data-trait-draggable-zone-selector',
          type: 'string',
          default: "''",
          description: 'CSS selector for container zones that accept drops.',
        },
        {
          name: 'data-trait-draggable-axis',
          type: "'vertical' | 'horizontal' | 'both'",
          default: "'both'",
          description: 'Constrains drag movement to a single axis.',
        },
        {
          name: 'data-trait-draggable-mode',
          type: "'drop' | 'slot' | 'preview'",
          default: "'drop'",
          description: "Drag mode. 'drop' moves items to drop zones; 'slot' reorders by slot position; 'preview' shows a ghost without moving.",
        },
        {
          name: 'data-trait-draggable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables drag behavior when true.',
        },
        {
          name: 'data-trait-draggable-animate',
          type: 'boolean',
          default: 'true',
          description: 'Animate items into their new positions after a drop.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:drag-start',
          detail: '{ item }',
          description: 'Fired when a drag begins.',
        },
        {
          event: 'native:drag-move',
          detail: '{ item, x, y }',
          description: 'Fired continuously while dragging.',
        },
        {
          event: 'native:drag-over',
          detail: '{ item, target }',
          description: 'Fired when the dragged item is over a valid drop target.',
        },
        {
          event: 'native:drop',
          detail: '{ item, target }',
          description: 'Fired when the item is dropped onto a valid drop target.',
        },
        {
          event: 'native:drag-cancel',
          detail: '{ item }',
          description: 'Fired when the drag is cancelled (Escape or invalid drop).',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[dragging]',
          description: 'Present on the item being dragged.',
        },
        {
          selector: '[drag-over]',
          description: 'Present on the drop target currently under the dragged item.',
        },
        {
          selector: '[drag-slot-before]',
          description: 'Present on the item that would become the next sibling after the drop (slot mode).',
        },
        {
          selector: '[drag-slot-after]',
          description: 'Present on the item that would become the previous sibling after the drop (slot mode).',
        },
        {
          selector: '[drag-zone-active]',
          description: 'Present on a zone container while a drag is in progress over it.',
        },
        {
          selector: '.drag-placeholder',
          description: 'The placeholder element inserted to indicate drop position.',
        },
      ],
    },
  ],
};
