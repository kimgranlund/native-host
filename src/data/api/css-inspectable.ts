import type { ApiReference } from './types';

export const cssInspectableApi: ApiReference = {
  element: 'css-inspectable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-css-inspectable-depth',
          type: 'number',
          default: '16',
          description: 'Maximum number of layers to render in 3D perspective.',
        },
        {
          name: 'data-trait-css-inspectable-scale',
          type: 'number',
          default: '0.85',
          description: 'Scale factor applied to the element during inspection.',
        },
        {
          name: 'data-trait-css-inspectable-perspective',
          type: 'number',
          default: '1200',
          description: 'CSS perspective distance in pixels.',
        },
        {
          name: 'data-trait-css-inspectable-max-tilt',
          type: 'number',
          default: '60',
          description: 'Maximum tilt angle in degrees.',
        },
        {
          name: 'data-trait-css-inspectable-tilt-radius',
          type: 'number',
          default: '384',
          description: 'Pointer radius (in pixels) that maps to max tilt.',
        },
        {
          name: 'data-trait-css-inspectable-labels',
          type: 'boolean',
          default: 'true',
          description: 'Show element labels on each layer.',
        },
        {
          name: 'data-trait-css-inspectable-recursive',
          type: 'boolean',
          default: 'true',
          description: 'Inspect child elements recursively.',
        },
        {
          name: 'data-trait-css-inspectable-pick',
          type: 'boolean',
          default: 'false',
          description: 'Enable element picking mode (click to select a layer).',
        },
        {
          name: 'data-trait-css-inspectable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables CSS inspection when true.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:inspect',
          detail: '{ active, layers }',
          description: 'Fired when inspection activates or deactivates. active is true when inspection is on.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[inspecting]',
          description: 'Present on the host while inspection is active.',
        },
        {
          selector: '[inspect-ready]',
          description: 'Present on the host when the cursor enters the inspection area.',
        },
        {
          selector: '[inspect-layer]',
          description: 'Present on each exploded layer element during inspection.',
        },
        {
          selector: '[inspect-hover]',
          description: 'Present on the currently hovered layer.',
        },
        {
          selector: '[inspect-selected]',
          description: 'Present on the selected layer when pick mode is active.',
        },
        {
          selector: '[data-inspect-label]',
          description: 'The label element rendered on each layer.',
        },
        {
          selector: '--inspect-tilt-x',
          description: 'CSS custom property with the current X tilt value in degrees.',
        },
        {
          selector: '--inspect-tilt-y',
          description: 'CSS custom property with the current Y tilt value in degrees.',
        },
      ],
    },
  ],
};
