import type { ApiReference } from './types';

export const dividerApi: ApiReference = {
  element: 'n-divider',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'orientation', type: '"vertical"', default: 'horizontal', description: 'Renders a vertical divider instead of the default horizontal line.' },
      ],
    },
  ],
};
