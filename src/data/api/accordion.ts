import type { ApiReference } from './types';

export const accordionApi: ApiReference = {
  element: 'n-accordion',
  sections: [
    {
      kind: 'attributes',
      title: 'n-accordion',
      rows: [
        { name: 'multiple', type: 'boolean', default: 'false', description: 'Allows multiple items to be open simultaneously. When removed, closes all but the first open item.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all accordion items. Sets aria-disabled="true".' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'radius', type: '"sharp" | "default" | "round"', default: 'inherited', description: 'Border radius. CSS-only.' },
      ],
    },
    {
      kind: 'attributes',
      title: 'n-accordion-item',
      rows: [
        { name: 'open', type: 'boolean', default: 'false', description: 'Whether the item content is expanded.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables toggling this item.' },
      ],
    },
    {
      kind: 'slots',
      rows: [
        { slot: 'heading', description: 'Summary text shown in the clickable header row.' },
        { slot: '(default)', description: 'Collapsible content panel.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-disabled="true"]', description: 'Disabled state on accordion or item.' },
        { selector: '[open]', description: 'Present on expanded accordion items.' },
        { selector: '[force-hover]', description: 'Forces hover on item summary for debugging/testing.' },
        { selector: '[force-focus-visible]', description: 'Forces focus ring on item summary for debugging/testing.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'Enter / Space', action: 'Toggle the focused item open/closed.' },
        { key: 'Tab', action: 'Move focus between summary elements.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Structure', value: 'Uses native details/summary for built-in disclosure semantics.' },
        { property: 'Focus', value: 'Summary elements are natively focusable.' },
      ],
    },
  ],
};
