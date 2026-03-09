import type { ApiReference } from './types';

export const tossableApi: ApiReference = {
  element: 'tossable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-tossable-friction',
          type: 'number',
          default: '0.95',
          description: 'Deceleration factor per animation frame. 0.95 = slows 5% each frame.',
        },
        {
          name: 'data-trait-tossable-bounce',
          type: 'boolean',
          default: 'true',
          description: 'Bounce off viewport edges.',
        },
        {
          name: 'data-trait-tossable-bounce-damping',
          type: 'number',
          default: '0.6',
          description: 'Velocity multiplier on bounce (controls energy loss per bounce).',
        },
        {
          name: 'data-trait-tossable-gravity',
          type: 'number',
          default: '0',
          description: 'Gravity in px/frame² added to vertical velocity. 0 = no gravity.',
        },
        {
          name: 'data-trait-tossable-spin',
          type: 'boolean',
          default: 'false',
          description: 'Track angular velocity from pointer movement and spin during momentum.',
        },
        {
          name: 'data-trait-tossable-return-on-end',
          type: 'boolean',
          default: 'false',
          description: 'Animate back to origin after momentum ends.',
        },
        {
          name: 'data-trait-tossable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables toss interaction when true.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:toss',
          detail: '{ x, y, velocityX, velocityY, bounces, rotation }',
          description: 'Fired when momentum animation ends. bounces is the total edge bounce count. rotation is the final angle in degrees.',
        },
        {
          event: 'native:bounce',
          detail: '{ edge, x, y }',
          description: "Fired on each viewport edge bounce. edge is 'left', 'right', 'top', or 'bottom'.",
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[tossing]',
          description: 'Present on the element while it is being dragged or during momentum animation.',
        },
      ],
    },
  ],
};
