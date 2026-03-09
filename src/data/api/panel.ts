import type { ApiReference } from './types';

export const panelApi: ApiReference = {
  element: 'n-container',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'data-kind', type: '"panel"', default: '—', description: 'Required. Activates panel mode — panel elevation background, default padding, and gap between children.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Size context inherited by child sub-containers and components.' },
        { name: 'bordered', type: 'boolean', default: 'false', description: 'Adds a muted 1px border around the panel.' },
        { name: 'inline', type: 'boolean', default: 'false', description: 'Shrinks to content width instead of growing to fill available space.' },
        { name: 'scrollable', type: 'boolean', default: 'false', description: 'Enables vertical scroll on the panel body.' },
        { name: 'show-scrollbar', type: 'boolean', default: 'false', description: 'Shows a thin scrollbar when content overflows.' },
        { name: 'fade', type: 'boolean', default: 'false', description: 'Fades content near header and footer edges to indicate scrollable content.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-ground', default: 'var(--n-panel)', description: 'Background color (panel elevation).' },
        { property: '--n-fade-top', default: 'calc((var(--n-size) + var(--n-space) * var(--n-space-k)) * 1.25)', description: 'Top fade mask height when [fade] is set.' },
        { property: '--n-fade-bottom', default: 'calc((var(--n-size) + var(--n-space) * var(--n-space-k)) * 1.25)', description: 'Bottom fade mask height when [fade] is set.' },
      ],
    },
  ],
};
