import type { ApiReference } from './types';

export const focusTrappableApi: ApiReference = {
  element: 'focus-trappable',
  sections: [
    {
      kind: 'methods',
      rows: [
        {
          method: 'enable()',
          returns: 'void',
          description: 'Activate the focus trap, constraining keyboard focus to the host element and its descendants.',
        },
        {
          method: 'disable()',
          returns: 'void',
          description: 'Deactivate the focus trap and restore normal tab order.',
        },
        {
          method: 'destroy()',
          returns: 'void',
          description: 'Disable the trap and remove all event listeners.',
        },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        {
          key: 'Tab',
          action: 'Move focus to the next focusable element within the trap. Wraps to the first element after the last.',
        },
        {
          key: 'Shift+Tab',
          action: 'Move focus to the previous focusable element within the trap. Wraps to the last element before the first.',
        },
      ],
    },
  ],
};
