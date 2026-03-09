import type { ApiReference } from './types';

export const listNavigableApi: ApiReference = {
  element: 'list-navigable',
  sections: [
    {
      kind: 'attributes',
      title: 'Constructor Options',
      rows: [
        {
          name: 'itemSelector',
          type: 'string',
          default: "':scope > [role]'",
          description: 'CSS selector for navigable items within the host.',
        },
        {
          name: 'ariaAttr',
          type: "'aria-selected' | 'aria-checked' | 'aria-current'",
          default: "'aria-selected'",
          description: 'ARIA attribute to sync with the current selection.',
        },
        {
          name: 'autoSync',
          type: 'boolean',
          default: 'true',
          description: 'Automatically sync ARIA attributes on children when selection changes.',
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical' | 'both'",
          default: "'vertical'",
          description: 'Keyboard navigation direction.',
        },
        {
          name: 'wrap',
          type: 'boolean',
          default: 'true',
          description: 'Wrap focus from last to first item (and vice versa).',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disable keyboard navigation and selection.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:change',
          detail: '{ value: string, label: string }',
          description: 'Dispatched on the host when a child item is selected. Bubbles and is cancelable.',
        },
        {
          event: 'native:select',
          detail: '{ value: string, label: string }',
          description: 'Listened on the host. Dispatched by child items when clicked or keyboard-activated.',
        },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        {
          key: 'ArrowDown / ArrowRight',
          action: 'Move focus to the next item (direction depends on orientation).',
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
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[aria-selected="true"]',
          description: 'The currently selected item (when using default ariaAttr).',
        },
        {
          selector: '[aria-checked="true"]',
          description: "The currently checked item (when ariaAttr is 'aria-checked').",
        },
        {
          selector: '[tabindex="0"]',
          description: 'The focusable item in the roving focus group.',
        },
        {
          selector: '[tabindex="-1"]',
          description: 'Non-focusable items in the roving focus group.',
        },
      ],
    },
  ],
};
