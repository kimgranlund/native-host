import type { ApiReference } from './types';

export const resizableApi: ApiReference = {
  element: 'resizable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-resizable-handle-selector',
          type: 'string',
          default: "'[data-resize-handle]'",
          description: 'CSS selector for the drag handle element within the host.',
        },
        {
          name: 'data-trait-resizable-axis',
          type: "'horizontal' | 'vertical' | 'both'",
          default: "'horizontal'",
          description: 'Which dimension(s) can be resized.',
        },
        {
          name: 'data-trait-resizable-min',
          type: 'number',
          default: '0',
          description: 'Minimum size in pixels.',
        },
        {
          name: 'data-trait-resizable-max',
          type: 'number',
          default: 'Infinity',
          description: 'Maximum size in pixels.',
        },
        {
          name: 'data-trait-resizable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables resize interaction when true.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:resize-start',
          detail: '{ width, height }',
          description: 'Fired when a resize drag begins.',
        },
        {
          event: 'native:resize-move',
          detail: '{ width, height }',
          description: 'Fired continuously while resizing.',
        },
        {
          event: 'native:resize-end',
          detail: '{ width, height }',
          description: 'Fired when the resize drag ends.',
        },
      ],
    },
    {
      kind: 'selectors',
      title: 'Attributes (set during resize)',
      rows: [
        {
          selector: '[resizing]',
          description: 'Present on the host element while a resize drag is in progress.',
        },
      ],
    },
  ],
};
