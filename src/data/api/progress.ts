import type { ApiReference } from './types';

export const progressApi: ApiReference = {
  element: 'n-progress',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'size', type: '"xs" | "sm" | "lg"', default: 'default', description: 'Track height. xs = 1 space, sm = 1.5 spaces, default = 2 spaces, lg = 3 spaces.' },
        { name: 'intent', type: '"accent" | "success" | "warning" | "danger"', default: 'neutral', description: 'Fill bar color intent.' },
        { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows a looping animation instead of a fixed fill width.' },
        { name: 'radius', type: '"sharp" | "round" | "pill"', default: 'inherited', description: 'Border radius preset. Inherits --n-radius.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-progress', default: '0', description: 'Progress value from 0 to 1. Controls the fill bar width.' },
        { property: '--n-radius', default: 'inherited', description: 'Border radius of both track and fill.' },
        { property: '--n-control', default: 'inherited', description: 'Track background color.' },
        { property: '--n-ink', default: 'inherited', description: 'Fill bar color (resolved by intent).' },
        { property: '--n-duration', default: 'inherited', description: 'Transition duration for fill width changes.' },
        { property: '--n-easing', default: 'inherited', description: 'Transition easing curve for fill width changes.' },
      ],
    },
  ],
};
