import type { ApiReference } from './types';

export const rangeSelectableApi: ApiReference = {
  element: 'range-selectable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-range-selectable-selector',
          type: 'string',
          default: "':scope > *'",
          description: 'CSS selector for selectable items within the host.',
        },
        {
          name: 'data-trait-range-selectable-mode',
          type: "'drag' | 'click'",
          default: "'drag'",
          description: "Selection mode. 'drag' selects by dragging; 'click' selects start then end item.",
        },
        {
          name: 'data-trait-range-selectable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables range selection when true.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:range-change',
          detail: '{ startIndex, endIndex, items }',
          description: 'Fired continuously as the selection range changes during a drag.',
        },
        {
          event: 'native:range-select',
          detail: '{ startIndex, endIndex, items }',
          description: 'Fired when the range selection is committed (pointer up or second click).',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[range-selected]',
          description: 'Present on items that fall within the current selection range.',
        },
        {
          selector: '[range-start]',
          description: 'Present on the first item in the selection range.',
        },
        {
          selector: '[range-end]',
          description: 'Present on the last item in the selection range.',
        },
      ],
    },
  ],
};
