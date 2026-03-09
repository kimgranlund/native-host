import type { ApiReference } from './types';

export const stackApi: ApiReference = {
  element: 'n-stack',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'direction', type: '"row" | "column-reverse" | "row-reverse"', default: 'column', description: 'Flex direction. Default is vertical stacking.' },
        { name: 'gap', type: '"0" | "1" | "2" | "3" | "4" | "6" | "8"', default: '"2"', description: 'Gap multiplier (--n-space * N).' },
        { name: 'wrap', type: 'boolean', default: 'false', description: 'Enables flex wrapping.' },
        { name: 'justify', type: '"start" | "center" | "end" | "spread" | "around" | "evenly"', default: 'start', description: 'Justify content along the main axis.' },
        { name: 'align', type: '"start" | "center" | "end" | "stretch" | "baseline"', default: '"stretch"', description: 'Align items along the cross axis.' },
        { name: 'padding', type: '"none" | "tight" | "regular" | "relaxed"', default: '"none"', description: 'Padding scale.' },
        { name: 'sticky', type: '"top" | "bottom"', default: '—', description: 'Sticks the stack to the top or bottom of its scroll container.' },
        { name: 'truncate', type: 'boolean', default: 'false', description: 'Truncates non-nav/aside child text with ellipsis on overflow.' },
        { name: 'dividers', type: 'boolean', default: 'false', description: 'Adds horizontal divider borders between children.' },
      ],
    },
    {
      kind: 'slots',
      rows: [
        { slot: '<nav>', description: 'Leading slot. When present, stack auto-switches to grid layout.' },
        { slot: '<aside>', description: 'Trailing slot. When present, stack auto-switches to grid layout.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-padding-block', default: '0', description: 'Vertical padding.' },
        { property: '--n-padding-inline', default: '0', description: 'Horizontal padding.' },
      ],
    },
  ],
};
