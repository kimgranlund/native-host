import type { ApiReference } from './types';

export const confettibleApi: ApiReference = {
  element: 'confettible',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-confettible-count',
          type: 'number',
          default: '30',
          description: 'Number of confetti particles per burst.',
        },
        {
          name: 'data-trait-confettible-spread',
          type: 'number',
          default: '90',
          description: 'Angular spread of the burst in degrees.',
        },
        {
          name: 'data-trait-confettible-velocity',
          type: 'number',
          default: '12',
          description: 'Initial velocity of particles.',
        },
        {
          name: 'data-trait-confettible-gravity',
          type: 'number',
          default: '0.5',
          description: 'Gravity applied to particles per frame.',
        },
        {
          name: 'data-trait-confettible-duration',
          type: 'number',
          default: '2000',
          description: 'Duration of the animation in milliseconds.',
        },
        {
          name: 'data-trait-confettible-trigger',
          type: "'click' | 'manual'",
          default: "'click'",
          description: "Trigger mode. 'click' fires on element click; 'manual' requires calling burst() programmatically.",
        },
        {
          name: 'data-trait-confettible-shapes',
          type: "'square' | 'circle' | 'mixed'",
          default: "'mixed'",
          description: 'Shape of confetti particles.',
        },
        {
          name: 'data-trait-confettible-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables confetti when true.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:confetti',
          detail: '{ count, origin: { x, y } }',
          description: 'Fired when confetti bursts. origin is the normalized viewport position (0–1).',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[data-confetti-container]',
          description: 'Fixed overlay container created for each burst. Removed after animation completes.',
        },
      ],
    },
  ],
};
