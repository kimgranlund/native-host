import type { ApiReference } from './types';

export const copyableApi: ApiReference = {
  element: 'copyable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-copyable-value',
          type: 'string',
          default: "''",
          description: 'The text to copy to the clipboard.',
        },
        {
          name: 'data-trait-copyable-feedback-duration',
          type: 'number',
          default: '2000',
          description: 'How long the [copied] attribute remains after a successful copy, in milliseconds.',
        },
      ],
    },
    {
      kind: 'methods',
      rows: [
        {
          method: 'copy()',
          returns: 'Promise<void>',
          description: 'Programmatically copy the configured value to the clipboard.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:copy',
          detail: '{ value: string }',
          description: 'Fired after a successful copy. value is the text that was copied.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[copied]',
          description: 'Present on the element during the feedback window after a successful copy.',
        },
      ],
    },
  ],
};
