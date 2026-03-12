import type { ApiReference } from './types';

export const feedApi: ApiReference = {
  element: 'n-feed',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'align', type: "'start' | 'end'", default: 'start', description: "Content alignment. 'end' pushes content to bottom (chat-style)." },
        { name: 'scroll', type: 'boolean', default: 'false', description: 'Enable scroll container (overflow-y: auto). CSS-only.' },
        { name: 'auto-scroll', type: 'boolean', default: 'false', description: 'Auto-scroll to bottom when new content is added (while pinned).' },
        { name: 'virtual', type: 'boolean', default: 'false', description: 'Enable virtual scroll windowing for large lists.' },
        { name: 'virtual-item-height', type: 'number', default: '80', description: 'Estimated item height in px for virtual scroll calculations.' },
        { name: 'virtual-overscan', type: 'number', default: '5', description: 'Extra items to render outside the visible viewport.' },
      ],
    },
    {
      kind: 'properties',
      rows: [
        { property: 'isPinned', type: 'boolean', description: 'Whether the feed is scrolled to the bottom (read-only).' },
        { property: 'items', type: 'unknown[]', description: 'Data items for virtual rendering.' },
        { property: 'itemRenderer', type: '(item, index) => HTMLElement', description: 'Callback that creates an element from a data item.' },
      ],
    },
    {
      kind: 'methods',
      rows: [
        { method: 'scrollToBottom(smooth?)', description: 'Scroll to the bottom of the feed. Pass false for instant scroll.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:feed-scroll', detail: '{ isPinned, scrollTop }', description: 'Fired when pin state changes (scrolled to/from bottom).' },
        { event: 'native:range-change', detail: '{ start, end, total }', description: 'Fired when virtual scroll visible range changes.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-feed-gap', default: 'calc(var(--n-space) * 2)', description: 'Gap between feed items.' },
      ],
    },
  ],
};
