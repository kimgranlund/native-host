import type { ApiReference } from './types';

export const popoverableApi: ApiReference = {
  element: 'popoverable',
  sections: [
    {
      kind: 'methods',
      rows: [
        {
          method: 'wirePopover(anchor, popover)',
          returns: 'void',
          description: 'Connect an anchor element to a popover element. Sets up positioning and dismiss behavior.',
        },
        {
          method: 'syncPopover(open)',
          returns: 'void',
          description: 'Programmatically open or close the wired popover.',
        },
        {
          method: 'destroy()',
          returns: 'void',
          description: 'Remove all event listeners and disconnect the popover.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:dismiss',
          detail: '—',
          description: 'Inherited from Dismissable. Fired when the popover is closed by clicking outside or pressing Escape.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[popover]:not(:popover-open)',
          description: 'The popover element when closed. Use to set initial hidden state.',
        },
        {
          selector: 'position-area: block-end',
          description: 'CSS anchor positioning property used to place the popover below its anchor by default.',
        },
      ],
    },
  ],
};
