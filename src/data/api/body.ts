import type { ApiReference } from './types';

export const bodyApi: ApiReference = {
  element: 'n-body',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'show-scrollbar', type: 'boolean', default: 'false', description: 'Shows a thin scrollbar when content overflows. Default hides the scrollbar.' },
        { name: 'padding', type: '"none" | "tight" | "regular" | "relaxed"', default: 'default', description: 'Padding scale override. Default uses --n-space * --n-space-k.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-padding-block', default: 'calc(var(--n-space) * var(--n-space-k))', description: 'Vertical padding.' },
        { property: '--n-padding-inline', default: 'calc(var(--n-space) * var(--n-space-k))', description: 'Horizontal padding.' },
      ],
    },
  ],
};
