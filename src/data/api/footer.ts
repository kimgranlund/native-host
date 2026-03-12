import type { ApiReference } from './types';

export const footerApi: ApiReference = {
  element: 'n-footer',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'justify', type: '"start" | "center" | "end" | "spread" | "around" | "evenly"', default: '"end"', description: 'Horizontal alignment of footer actions.' },
        { name: 'dividers', type: 'boolean', default: 'false', description: 'Adds a top border line above the footer.' },
        { name: 'sticky', type: 'boolean', default: 'false', description: 'Sticks the footer to the bottom of the scroll container.' },
        { name: 'padding', type: '"none" | "tight" | "regular" | "relaxed"', default: 'default', description: 'Padding scale override.' },
      ],
    },
    {
      kind: 'slots',
      rows: [
        { slot: 'leading', description: 'Leading slot (column 1). Use for secondary actions or status content.' },
        { slot: '(default)', description: 'Main content slot. Actions are end-justified by default.' },
        { slot: 'trailing', description: 'Trailing slot (column 3). Pushed to the inline end.' },
        { slot: 'content', description: 'Full-width row spanning all columns.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-pad-block', default: 'var(--n-space)', description: 'Vertical padding.' },
        { property: '--n-pad-inline', default: 'calc(var(--n-space) * var(--n-space-k))', description: 'Horizontal padding.' },
      ],
    },
  ],
};
