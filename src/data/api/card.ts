import type { ApiReference } from './types';

export const cardApi: ApiReference = {
  element: 'n-container',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Size context inherited by child sub-containers and components.' },
        { name: 'inline', type: 'boolean', default: 'false', description: 'Shrinks to content width instead of growing to fill available space.' },
        { name: 'bordered', type: 'boolean', default: 'false', description: 'Adds a muted 1px border around the container.' },
        { name: 'interactive', type: 'boolean', default: 'false', description: 'Adds hover and focus-visible states, making the card feel clickable.' },
        { name: 'dividers', type: 'boolean', default: 'false', description: 'Adds a top border between each direct child.' },
      ],
    },
    {
      kind: 'slots',
      rows: [
        { slot: 'media', description: 'Full-width image or media element rendered above the body content.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-ground', default: 'var(--n-card)', description: 'Background color (card elevation by default).' },
        { property: '--n-ground-hover', default: 'var(--n-card-hover)', description: 'Background color on hover when [interactive].' },
      ],
    },
  ],
};
