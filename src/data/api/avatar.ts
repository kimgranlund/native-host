import type { ApiReference } from './types';

export const avatarApi: ApiReference = {
  element: 'n-avatar',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'name', type: 'string', default: 'none', description: 'User/entity name. Used for accessible label and initials fallback.' },
        { name: 'src', type: 'string', default: 'none', description: 'Image URL. Falls back to initials (from name) or placeholder icon on error.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Avatar size scale.' },
        { name: 'intent', type: '"accent" | "info" | "success" | "warning" | "danger"', default: 'neutral', description: 'Semantic color intent for the background fill.' },
        { name: 'radius', type: '"sharp" | "round" | "circle"', default: '"circle"', description: 'Border radius preset.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-radius', default: 'inherited', description: 'Border radius. Override for custom rounding.' },
        { property: '--n-font-weight', default: 'var(--n-button-font-weight)', description: 'Initials text weight.' },
      ],
    },
  ],
};
