import type { ApiReference } from './types';

export const hoverableApi: ApiReference = {
  element: 'hoverable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-hoverable-delay',
          type: 'number',
          default: '0',
          description: 'Delay in milliseconds before native:hover-start fires after pointer enters.',
        },
        {
          name: 'data-trait-hoverable-leave-delay',
          type: 'number',
          default: '0',
          description: 'Delay in milliseconds before native:hover-end fires after pointer leaves.',
        },
        {
          name: 'data-trait-hoverable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables hover detection when true.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:hover-start',
          detail: '{ pointerType }',
          description: 'Fired when the pointer enters the element (after optional delay).',
        },
        {
          event: 'native:hover-end',
          detail: '{ pointerType }',
          description: 'Fired when the pointer leaves the element (after optional leave delay).',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[hovered]',
          description: 'Present on the element while it is considered hovered.',
        },
      ],
    },
  ],
};
