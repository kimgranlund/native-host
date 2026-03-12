import type { ApiReference } from './types';

export const headerApi: ApiReference = {
  element: 'n-header',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'align', type: '"center" | "end"', default: 'start', description: 'Text alignment of the label slot.' },
        { name: 'truncate', type: 'boolean', default: 'false', description: 'Truncates the label with ellipsis on overflow.' },
        { name: 'dividers', type: 'boolean', default: 'false', description: 'Adds a bottom border line below the header.' },
        { name: 'sticky', type: 'boolean', default: 'false', description: 'Sticks the header to the top of the scroll container.' },
        { name: 'padding', type: '"none" | "tight" | "regular" | "relaxed"', default: 'default', description: 'Padding scale override.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size context (inherits from parent container).' },
      ],
    },
    {
      kind: 'slots',
      rows: [
        { slot: 'leading (via <nav>)', description: 'Leading slot (column 1). Use for back buttons, icons, or badges.' },
        { slot: '(default)', description: 'Label slot (column 2). The main title text.' },
        { slot: 'trailing (via <aside>)', description: 'Trailing slot (column 3). Use for action buttons or controls.' },
        { slot: 'content', description: 'Full-width row below the title. Use for subtitles or tabs.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-pad-block', default: 'var(--n-space)', description: 'Vertical padding.' },
        { property: '--n-pad-inline', default: 'calc(var(--n-space) * var(--n-space-k))', description: 'Horizontal padding.' },
      ],
    },
  ],
};
