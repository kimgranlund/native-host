import type { ApiReference } from './types';

export const drawerApi: ApiReference = {
  element: 'n-drawer',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'side', type: '"left" | "right" | "top" | "bottom"', default: '"right"', description: 'Slide-in direction.' },
        { name: 'no-close-on-escape', type: 'boolean', default: 'false', description: 'Prevents closing on Escape key.' },
        { name: 'no-close-on-backdrop', type: 'boolean', default: 'false', description: 'Prevents closing on backdrop click.' },
      ],
    },
    {
      kind: 'methods',
      rows: [
        { method: 'showModal()', description: 'Opens the drawer as a modal dialog.' },
        { method: 'close()', description: 'Closes the drawer.' },
      ],
    },
    {
      kind: 'attributes',
      title: 'Properties',
      rows: [
        { name: 'open', type: 'boolean (read-only)', default: '\u2014', description: 'Whether the drawer is currently open.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'close', detail: '\u2014', description: 'Fired when the drawer is closed.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-drawer-width', default: '\u2014', description: 'Width of the drawer panel (left/right sides). Capped at 90vw.' },
        { property: '--n-drawer-height', default: '\u2014', description: 'Height of the drawer panel (top/bottom sides). Capped at 90vh.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'Escape', action: 'Closes the drawer (unless no-close-on-escape).' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Structure', value: 'Uses native dialog with showModal() for top-layer rendering and focus trapping.' },
        { property: 'Backdrop', value: 'Click-to-close (unless no-close-on-backdrop).' },
        { property: 'Animation', value: 'Slide-in from the specified side. Respects prefers-reduced-motion.' },
      ],
    },
  ],
};
