import type { ApiReference } from './types';

export const intersectableApi: ApiReference = {
  element: 'intersectable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-intersectable-threshold',
          type: 'number',
          default: '0',
          description: 'Intersection ratio threshold (0–1) at which the event fires.',
        },
        {
          name: 'data-trait-intersectable-once',
          type: 'boolean',
          default: 'false',
          description: 'Disconnect the observer after the first intersection.',
        },
        {
          name: 'data-trait-intersectable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables intersection observation when true.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:intersect',
          detail: '{ isIntersecting, ratio }',
          description: 'Fired when the element enters or exits the viewport. ratio is the current intersection ratio (0–1).',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[intersecting]',
          description: 'Present on the element while it is intersecting the viewport.',
        },
      ],
    },
  ],
};
