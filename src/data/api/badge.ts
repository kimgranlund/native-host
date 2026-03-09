import type { ApiReference } from './types';

export const badgeApi: ApiReference = {
  element: 'n-badge',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'intent', type: '"accent" | "info" | "success" | "warning" | "danger"', default: 'neutral', description: 'Semantic color intent.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Badge size scale.' },
        { name: 'variant', type: '"default" | "outline" | "ghost"', default: 'solid (no attribute)', description: 'Visual variant. Omit for solid fill.' },
        { name: 'radius', type: '"sharp" | "round"', default: 'pill (9999px)', description: 'Border radius preset.' },
        { name: 'floating', type: 'boolean', default: 'false', description: 'Absolutely positions the badge (top-right) for overlaying on icons or avatars. Parent needs position: relative.' },
        { name: 'dot', type: 'boolean', default: 'false', description: 'Renders as a small status dot with no text content.' },
        { name: 'hidden', type: 'boolean', default: 'false', description: 'Hides the badge (display: none).' },
        { name: 'max', type: 'number', default: '\u2014', description: 'Clamps displayed numeric value. Shows max+ when exceeded (e.g. 99+).' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-radius', default: '9999px', description: 'Border radius. Override for custom rounding.' },
        { property: '--n-font-weight', default: 'var(--n-button-font-weight)', description: 'Badge text weight.' },
      ],
    },
  ],
};
