import type { ApiReference } from './types';

export const textApi: ApiReference = {
  element: 'span',
  sections: [
    {
      kind: 'selectors',
      title: 'CSS Utility Classes',
      rows: [
        { selector: '.text-xs', description: 'Extra small font size (--n-font-xs).' },
        { selector: '.text-sm', description: 'Small font size (--n-font-sm).' },
        { selector: '.text-lg', description: 'Large font size (--n-font-lg).' },
        { selector: '.text-xl', description: 'Extra large font size (--n-font-xl).' },
        { selector: '.text-muted', description: 'De-emphasized text color via --n-ink-muted.' },
        { selector: '.text-strong', description: 'Bold weight and high-contrast color via --n-ink-strong.' },
        { selector: '.text-truncate', description: 'Clips overflow text with an ellipsis. Requires a width-constrained parent.' },
        { selector: '.text-uppercase', description: 'Applies text-transform: uppercase with 0.05em letter spacing.' },
      ],
    },
  ],
};
