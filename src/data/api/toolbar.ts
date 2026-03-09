import type { ApiReference } from './types';

export const toolbarApi: ApiReference = {
  element: 'n-toolbar',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'orientation', type: '"vertical"', default: 'horizontal', description: 'Renders items in a vertical column and adjusts keyboard navigation accordingly.' },
        { name: 'variant', type: '"plain"', default: '—', description: 'Strips background, border, and border-radius for embedding inside container headers without doubling chrome.' },
        { name: 'fill', type: 'boolean', default: 'false', description: 'Distributes available space evenly across all items instead of using intrinsic widths.' },
        { name: 'padding', type: '"none" | "tight" | "regular" | "relaxed"', default: '"tight"', description: 'Internal padding of the toolbar container.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Size context inherited by child buttons and icons.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-ground', default: 'var(--n-panel)', description: 'Toolbar background color.' },
        { property: '--n-border-color', default: 'var(--n-border-muted)', description: 'Toolbar border color.' },
      ],
    },
  ],
};
