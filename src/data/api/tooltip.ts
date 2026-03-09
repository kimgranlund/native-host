import type { ApiReference } from './types';

export const tooltipApi: ApiReference = {
  element: 'n-tooltip',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'placement', type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: 'Position relative to the anchor (parent element).' },
        { name: 'delay', type: 'number', default: '500', description: 'Show delay in milliseconds.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents tooltip from showing. Sets aria-disabled="true".' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'Escape', action: 'Closes the tooltip when open.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'ARIA', value: 'Sets aria-describedby on the parent (anchor) element pointing to the tooltip.' },
        { property: 'Popover', value: 'Uses popover="manual" for top-layer promotion via anchor positioning.' },
        { property: 'Trigger', value: 'Shows on mouseenter/focusin, hides on mouseleave/focusout.' },
        { property: 'Viewport clipping', value: 'position-try-fallbacks: flip-block, flip-inline auto-flips when clipping edges.' },
      ],
    },
  ],
};
