import type { ApiReference } from './types';

export const paginationApi: ApiReference = {
  element: 'n-pagination',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'total', type: 'number', default: '1', description: 'Total number of pages.' },
        { name: 'value', type: 'number', default: '1', description: 'Current page number (1-based).' },
        { name: 'siblings', type: 'number', default: '1', description: 'Number of sibling pages shown around the current page.' },
        { name: 'boundaries', type: 'number', default: '1', description: 'Number of boundary pages shown at start and end.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all pagination buttons. Sets aria-disabled="true".' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:change', detail: '{ value }', description: 'Fired when the page changes.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-disabled="true"]', description: 'Disabled state on the container.' },
        { selector: '[aria-current="page"]', description: 'Highlights the current page button.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'Tab', action: 'Move focus between page buttons.' },
        { key: 'Enter / Space', action: 'Navigate to the focused page.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'navigation (via ElementInternals)' },
        { property: 'aria-label', value: '"Pagination" (default, overridable via attribute)' },
        { property: 'Page buttons', value: 'Each page button has aria-label="Page N". Prev/Next have aria-label="Previous page"/"Next page".' },
        { property: 'Current page', value: 'aria-current="page" on the active page button.' },
      ],
    },
  ],
};
