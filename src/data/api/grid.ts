import type { ApiReference } from './types';

export const gridApi: ApiReference = {
  element: 'n-grid',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'cols', type: '"1" | "2" | "3" | "4" | "5" | "6"', default: 'auto-fill', description: 'Fixed number of equal-width columns. Overrides the default responsive auto-fill behaviour.' },
        { name: 'min', type: '"8rem" | "10rem" | "12rem" | "14rem" | "16rem" | "20rem" | "24rem"', default: '"16rem"', description: 'Minimum column width for auto-fill responsive columns.' },
        { name: 'gap', type: '"0" | "1" | "2" | "3" | "4" | "6" | "8"', default: '"2"', description: 'Gap between cells as a multiplier of --n-space.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-padding-block', default: '0', description: 'Vertical padding.' },
        { property: '--n-padding-inline', default: '0', description: 'Horizontal padding.' },
      ],
    },
  ],
};
