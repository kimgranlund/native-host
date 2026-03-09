import type { ApiReference } from './types';

export const sectionApi: ApiReference = {
  element: 'n-container',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'collapsible', type: 'boolean', default: 'false', description: 'Makes the section body collapsible via a toggle on the heading.' },
        { name: 'collapsed', type: 'boolean', default: 'false', description: 'Starts the section in a collapsed state. Requires [collapsible].' },
        { name: 'divider', type: 'boolean', default: 'false', description: 'Adds a top border above the section, useful when stacking multiple sections.' },
      ],
    },
    {
      kind: 'slots',
      rows: [
        { slot: 'heading', description: 'Section heading text rendered above the body content.' },
        { slot: 'description', description: 'Optional secondary description text below the heading.' },
        { slot: '(default)', description: 'Section body content.' },
      ],
    },
  ],
};
