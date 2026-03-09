import type { ApiReference } from './types';

export const parallaxableApi: ApiReference = {
  element: 'parallaxable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-parallaxable-max-tilt',
          type: 'number',
          default: '15',
          description: 'Maximum tilt angle in degrees.',
        },
        {
          name: 'data-trait-parallaxable-perspective',
          type: 'number',
          default: '1000',
          description: 'CSS perspective distance in pixels.',
        },
        {
          name: 'data-trait-parallaxable-speed',
          type: 'number',
          default: '400',
          description: 'Transition speed in milliseconds when the pointer moves.',
        },
        {
          name: 'data-trait-parallaxable-scale',
          type: 'number',
          default: '1',
          description: 'Scale factor applied while hovering. Values > 1 zoom in.',
        },
        {
          name: 'data-trait-parallaxable-glare',
          type: 'boolean',
          default: 'false',
          description: 'Enable a glare overlay that follows pointer position.',
        },
        {
          name: 'data-trait-parallaxable-glare-opacity',
          type: 'number',
          default: '0.3',
          description: 'Maximum opacity of the glare overlay (0–1).',
        },
        {
          name: 'data-trait-parallaxable-gyroscope',
          type: 'boolean',
          default: 'false',
          description: 'Use device gyroscope for tilt on mobile devices.',
        },
        {
          name: 'data-trait-parallaxable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables parallax effect when true.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:parallax-move',
          detail: '{ tiltX, tiltY, percentX, percentY }',
          description: 'Fired on pointer move during parallax. tiltX/tiltY are angles in degrees; percentX/percentY are 0–100 normalized positions.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[parallax-active]',
          description: 'Present on the element while the pointer is over it and parallax is active.',
        },
        {
          selector: '--parallax-tilt-x',
          description: 'CSS custom property with the current X tilt value in degrees.',
        },
        {
          selector: '--parallax-tilt-y',
          description: 'CSS custom property with the current Y tilt value in degrees.',
        },
        {
          selector: '--parallax-percent-x',
          description: 'CSS custom property with the normalized X pointer position (0–100).',
        },
        {
          selector: '--parallax-percent-y',
          description: 'CSS custom property with the normalized Y pointer position (0–100).',
        },
      ],
    },
  ],
};
