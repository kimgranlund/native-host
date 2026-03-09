import type { ApiReference } from './types';

export const breadcrumbApi: ApiReference = {
  element: 'n-breadcrumb',
  sections: [
    {
      kind: 'attributes',
      title: 'n-breadcrumb',
      rows: [
        { name: 'aria-label', type: 'string', default: '"Breadcrumb"', description: 'Accessible label for the navigation landmark.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
      ],
    },
    {
      kind: 'attributes',
      title: 'n-breadcrumb-item',
      rows: [
        { name: 'href', type: 'string', default: '\u2014', description: 'Navigation URL. Navigates on click or Enter/Space.' },
        { name: 'current', type: 'boolean', default: 'false', description: 'Marks as the current page. Disables navigation and sets aria-current="page".' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[current]', description: 'Current page item. Bold text, non-interactive.' },
        { selector: '[force-hover]', description: 'Forces hover appearance on items for debugging/testing.' },
        { selector: '[force-focus-visible]', description: 'Forces focus ring on items for debugging/testing.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'Enter / Space', action: 'Navigate to the item\'s href.' },
        { key: 'Tab', action: 'Move focus between breadcrumb items.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role (n-breadcrumb)', value: 'navigation (via ElementInternals)' },
        { property: 'Role (n-breadcrumb-item)', value: 'link (via ElementInternals)' },
        { property: 'Current page', value: 'aria-current="page" and aria-disabled="true" on [current] items.' },
        { property: 'Separator', value: 'CSS ::after pseudo-element (/ by default, configurable via --n-breadcrumb-separator).' },
      ],
    },
  ],
};
