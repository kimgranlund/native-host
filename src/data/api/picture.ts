import type { ApiReference } from './types';

export const pictureApi: ApiReference = {
  element: 'n-picture',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'fit', type: '"cover" | "contain" | "fill" | "none"', default: '"cover"', description: 'Controls object-fit on the child <img>.' },
        { name: 'aspect', type: '"square" | "video" | "photo"', default: 'none', description: 'Constrains to a fixed aspect ratio. square = 1:1, video = 16:9, photo = 4:3.' },
        { name: 'inline', type: 'boolean', default: 'false', description: 'Switches from block to inline-block display.' },
        { name: 'radius', type: '"sharp" | "round" | "pill"', default: 'inherited', description: 'Border radius preset. Inherits --n-radius.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-radius', default: 'inherited', description: 'Border radius applied to the container. Clips the child image.' },
      ],
    },
  ],
};
