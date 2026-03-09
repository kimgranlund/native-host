import type { ApiReference } from './types';

export const pressableApi: ApiReference = {
  element: 'pressable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        { name: 'data-trait-pressable-disabled', type: 'boolean', default: 'false', description: 'Disables press behavior when "true". Pointer events are ignored.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:press', detail: '{ pointerType }', description: 'Fired on release. pointerType is "mouse", "touch", "pen", or "keyboard".' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[pressed]', description: 'Present on the element while pointer/key is held down. Use for active-press styling.' },
      ],
    },
  ],
};
