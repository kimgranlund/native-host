import type { ApiReference } from './types';

export const flippableApi: ApiReference = {
  element: 'flippable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-flippable-axis',
          type: "'x' | 'y'",
          default: "'y'",
          description: "Rotation axis for the flip animation. 'y' flips horizontally, 'x' flips vertically.",
        },
        {
          name: 'data-trait-flippable-duration',
          type: 'number',
          default: '600',
          description: 'Flip animation duration in milliseconds.',
        },
        {
          name: 'data-trait-flippable-perspective',
          type: 'number',
          default: '1000',
          description: 'CSS perspective distance in pixels for the 3D flip effect.',
        },
        {
          name: 'data-trait-flippable-trigger',
          type: "'click' | 'hover' | 'manual'",
          default: "'click'",
          description: "What triggers the flip. 'manual' requires calling flip() programmatically.",
        },
        {
          name: 'data-trait-flippable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Prevents flipping when true.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:flip',
          detail: '{ flipped, axis }',
          description: 'Fired on flip or unflip. flipped is true when the back face is showing.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[data-flip-back]',
          description: 'Applied to the child element that represents the back face of the card.',
        },
        {
          selector: '[flipped]',
          description: 'Present on the host element when the back face is showing.',
        },
      ],
    },
  ],
};
