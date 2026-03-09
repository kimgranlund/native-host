import type { ApiReference } from './types';

export const rovingFocusableApi: ApiReference = {
  element: 'roving-focusable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-roving-focusable-selector',
          type: 'string',
          default: "':scope > [role]'",
          description: 'CSS selector for focusable items within the host.',
        },
        {
          name: 'data-trait-roving-focusable-orientation',
          type: "'vertical' | 'horizontal' | 'both'",
          default: "'both'",
          description: 'Keyboard navigation direction.',
        },
        {
          name: 'data-trait-roving-focusable-wrap',
          type: 'boolean',
          default: 'true',
          description: 'Wrap focus from the last item back to the first (and vice versa).',
        },
        {
          name: 'data-trait-roving-focusable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables roving focus behavior when true.',
        },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        {
          key: 'ArrowDown / ArrowRight',
          action: 'Move focus to the next item.',
        },
        {
          key: 'ArrowUp / ArrowLeft',
          action: 'Move focus to the previous item.',
        },
        {
          key: 'Home',
          action: 'Move focus to the first item.',
        },
        {
          key: 'End',
          action: 'Move focus to the last item.',
        },
      ],
    },
  ],
};
