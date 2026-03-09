import type { ApiReference } from './types';

export const paginationDotsApi: ApiReference = {
  element: 'n-pagination-dots',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'count', type: 'number', default: '0', description: 'Number of dots to render.' },
        { name: 'active', type: 'number', default: '0', description: 'Zero-based index of the active dot.' },
        { name: 'max-dots', type: 'number', default: '7', description: 'Maximum visible dots before windowing. Edge dots scale down when more exist beyond view.' },
        { name: 'paddles', type: 'boolean', default: 'false', description: 'Shows prev/next navigation buttons.' },
        { name: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Layout direction of the dots.' },
        { name: 'variant', type: '"plain"', default: '\u2014', description: 'Removes container background and padding.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all dots. Sets aria-disabled="true".' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
        { name: 'radius', type: '"sharp" | "default" | "round"', default: 'inherited', description: 'Border radius. CSS-only.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:change', detail: '{ index }', description: 'Fired when a dot is clicked or navigated to. index is the zero-based dot index.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-disabled="true"]', description: 'Disabled state. Dims all dots and prevents interaction.' },
        { selector: '[force-hover]', description: 'Forces hover appearance on inactive dots.' },
        { selector: '[force-active]', description: 'Forces active/pressed appearance on inactive dots.' },
        { selector: '[force-focus-visible]', description: 'Forces focus ring on dot buttons.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'ArrowRight / ArrowDown', action: 'Move to next dot (wraps around, direction-dependent).' },
        { key: 'ArrowLeft / ArrowUp', action: 'Move to previous dot (wraps around, direction-dependent).' },
        { key: 'Home', action: 'Go to first dot.' },
        { key: 'End', action: 'Go to last dot.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'tablist (via ElementInternals)' },
        { property: 'Label', value: 'aria-label="Slide indicators" (default, overridable)' },
        { property: 'Dots', value: 'Each dot is role="tab" with aria-selected and aria-label="Go to slide N".' },
        { property: 'Focus', value: 'Roving tabindex \u2014 only the active dot is focusable.' },
      ],
    },
  ],
};
