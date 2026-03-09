import type { ApiReference } from './types';

export const searchableApi: ApiReference = {
  element: 'searchable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-searchable-selector',
          type: 'string',
          default: "':scope > *'",
          description: 'CSS selector for filterable items within the host.',
        },
        {
          name: 'data-trait-searchable-text-field',
          type: 'string',
          default: "'textContent'",
          description: "Property or attribute name to read item text from. Use 'textContent' or an attribute name like 'data-label'.",
        },
        {
          name: 'data-trait-searchable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables search filtering when true.',
        },
      ],
    },
    {
      kind: 'methods',
      rows: [
        {
          method: 'filter(query)',
          returns: '{ matches, hidden, total }',
          description: 'Filter items by query string. Returns match counts. Sets [search-hidden] and [search-match] on items.',
        },
        {
          method: 'clear()',
          returns: 'void',
          description: 'Clear the current filter and restore all items.',
        },
        {
          method: 'static highlight(text, query)',
          returns: 'string',
          description: 'Returns an HTML string with query matches wrapped in <mark> elements.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:search',
          detail: '{ query, matchCount, total }',
          description: 'Fired after a filter operation. matchCount is the number of visible items.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[search-hidden]',
          description: 'Present on items that do not match the current query.',
        },
        {
          selector: '[search-match]',
          description: 'Present on items that match the current query.',
        },
      ],
    },
  ],
};
