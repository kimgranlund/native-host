import type { ApiReference } from './types';

export const videoApi: ApiReference = {
  element: 'n-video',
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
        { property: '--n-radius', default: 'inherited', description: 'Border radius applied to the container. Clips the child video.' },
        { property: '--n-control', default: 'inherited', description: 'Background color shown when no video is loaded.' },
      ],
    },
  ],
};
