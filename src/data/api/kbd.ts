import type { ApiReference } from './types';

export const kbdApi: ApiReference = {
  element: 'n-kbd',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Keyboard indicator size scale.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-icon-size', default: '1.125em', description: 'Icon size within the kbd element.' },
        { property: '--n-ground', default: 'var(--n-body)', description: 'Background color (body elevation).' },
      ],
    },
  ],
};
