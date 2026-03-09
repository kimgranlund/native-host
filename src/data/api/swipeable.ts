import type { ApiReference } from './types';

export const swipeableApi: ApiReference = {
  element: 'swipeable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-swipeable-threshold',
          type: 'number',
          default: '50',
          description: 'Minimum distance in pixels for a swipe to be recognized.',
        },
        {
          name: 'data-trait-swipeable-velocity-threshold',
          type: 'number',
          default: '0.3',
          description: 'Minimum velocity in px/ms for a swipe to be recognized.',
        },
        {
          name: 'data-trait-swipeable-axis',
          type: "'horizontal' | 'vertical' | 'both'",
          default: "'horizontal'",
          description: "Which axis to detect swipes on. 'both' picks the dominant axis from the gesture.",
        },
        {
          name: 'data-trait-swipeable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables swipe detection when true.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:swipe',
          detail: '{ direction, distance, velocity }',
          description: 'Fired when a swipe gesture meets the distance and velocity thresholds.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[swiping]',
          description: 'Present on the host while the pointer is down (gesture in progress).',
        },
        {
          selector: '[swipe-left]',
          description: 'Set briefly (300ms) after a left swipe is recognized.',
        },
        {
          selector: '[swipe-right]',
          description: 'Set briefly (300ms) after a right swipe is recognized.',
        },
        {
          selector: '[swipe-up]',
          description: 'Set briefly (300ms) after an up swipe is recognized.',
        },
        {
          selector: '[swipe-down]',
          description: 'Set briefly (300ms) after a down swipe is recognized.',
        },
      ],
    },
  ],
};
