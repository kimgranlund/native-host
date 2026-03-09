import type { ApiReference } from './types';

export const insetApi: ApiReference = {
  element: 'n-inset',
  sections: [
    {
      kind: 'attributes',
      rows: [],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-space-k', default: 'inherited', description: 'Space multiplier inherited from the parent size context. Controls the inline-start indent amount.' },
      ],
    },
  ],
};
