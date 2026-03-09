import type { ApiReference } from './types';

export const audioApi: ApiReference = {
  element: 'n-audio',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'radius', type: '"sharp" | "round" | "pill"', default: 'inherited', description: 'Border radius preset. Inherits --n-radius.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-radius', default: 'inherited', description: 'Border radius applied to the container.' },
      ],
    },
  ],
};
