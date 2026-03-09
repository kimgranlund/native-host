import type { ApiReference } from './types';

export const virtualizableApi: ApiReference = {
  element: 'virtualizable',
  sections: [
    {
      kind: 'attributes',
      title: 'Constructor Options',
      rows: [
        {
          name: 'itemHeight',
          type: 'number',
          default: '40',
          description: 'Fixed height in pixels of each virtual row. Used to calculate total scroll height and the visible range.',
        },
        {
          name: 'overscan',
          type: 'number',
          default: '5',
          description: 'Number of extra rows to render above and below the visible viewport for smoother scrolling.',
        },
      ],
    },
    {
      kind: 'methods',
      rows: [
        {
          method: 'enable(scrollEl, container, totalCount)',
          returns: 'void',
          description: 'Start virtualization. scrollEl is the scrollable viewport, container is the content wrapper, totalCount is the total item count.',
        },
        {
          method: 'disable()',
          returns: 'void',
          description: 'Stop virtualization and remove the scroll listener. Spacers remain in the DOM.',
        },
        {
          method: 'updateCount(count)',
          returns: 'void',
          description: 'Update the total item count and recalculate the visible range. Use when items are added or removed.',
        },
        {
          method: 'destroy()',
          returns: 'void',
          description: 'Fully tear down the controller: remove the scroll listener and spacer elements.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:virtual-change',
          detail: '{ start, end, totalCount }',
          description: 'Dispatched on the host when the visible range changes. start is the first visible index, end is one past the last visible index. Render rows for indices [start, end).',
        },
      ],
    },
  ],
};
