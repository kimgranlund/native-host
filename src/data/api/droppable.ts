import type { ApiReference } from './types';

export const droppableApi: ApiReference = {
  element: 'droppable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-droppable-accept',
          type: 'string',
          default: "'*'",
          description: "Accepted file MIME type pattern. '*' accepts all files.",
        },
        {
          name: 'data-trait-droppable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables drop handling when true.',
        },
        {
          name: 'data-trait-droppable-multiple',
          type: 'boolean',
          default: 'true',
          description: 'Allow multiple files to be dropped at once.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:file-drop',
          detail: '{ files, dataTransfer }',
          description: 'Fired when files are dropped onto the element. files is a FileList.',
        },
        {
          event: 'native:text-drop',
          detail: '{ text }',
          description: 'Fired when plain text is dropped onto the element.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[drop-active]',
          description: 'Present on the element while a valid drag is over it.',
        },
        {
          selector: '[drop-invalid]',
          description: 'Present on the element while a drag with an invalid type is over it.',
        },
      ],
    },
  ],
};
