import type { ApiReference } from './types';

export const magnetizableApi: ApiReference = {
  element: 'magnetizable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-magnetizable-selector',
          type: 'string',
          default: "':scope > *'",
          description: 'CSS selector for magnetizable items within the host.',
        },
        {
          name: 'data-trait-magnetizable-threshold',
          type: 'number',
          default: '8',
          description: 'Snap distance threshold in pixels.',
        },
        {
          name: 'data-trait-magnetizable-grid-size',
          type: 'number',
          default: '0',
          description: 'Grid cell size in pixels for grid snapping. 0 disables grid snap.',
        },
        {
          name: 'data-trait-magnetizable-strength',
          type: 'number',
          default: '1',
          description: 'Snap strength multiplier (0–1). 1 = instant snap, <1 = elastic pull.',
        },
        {
          name: 'data-trait-magnetizable-guides',
          type: 'boolean',
          default: 'true',
          description: 'Show alignment guide lines during snap.',
        },
        {
          name: 'data-trait-magnetizable-guide-color',
          type: 'string',
          default: "'#0ea5e9'",
          description: 'Color of the alignment guide lines.',
        },
        {
          name: 'data-trait-magnetizable-snap-to-edges',
          type: 'boolean',
          default: 'true',
          description: 'Snap to container edges.',
        },
        {
          name: 'data-trait-magnetizable-snap-to-siblings',
          type: 'boolean',
          default: 'true',
          description: 'Snap to edges of sibling items.',
        },
        {
          name: 'data-trait-magnetizable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables magnet snap behavior when true.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:magnet-snap',
          detail: '{ item, x, y, snappedTo, axis }',
          description: 'Fired when an item snaps to an alignment point. snappedTo describes what was snapped to.',
        },
        {
          event: 'native:magnet-drop',
          detail: '{ item, x, y }',
          description: 'Fired when a dragged item is released.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[magnet-snapping]',
          description: 'Present on an item while it is snapped to an alignment point.',
        },
      ],
    },
  ],
};
