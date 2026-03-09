import type { ApiReference } from './types';

export const tableApi: ApiReference = {
  element: 'n-table',
  sections: [
    {
      kind: 'attributes',
      title: 'Attributes \u2014 n-table',
      rows: [
        { name: 'selectable', type: 'boolean', default: 'false', description: 'Enables row selection on click.' },
        { name: 'resizable', type: 'boolean', default: 'false', description: 'Enables column resize handles on header cells.' },
        { name: 'reorderable', type: 'boolean', default: 'false', description: 'Enables drag-to-reorder rows.' },
        { name: 'cols', type: 'string', default: '\u2014', description: 'Sets grid-template-columns (e.g. "auto auto 1fr").' },
        { name: 'sticky-header', type: 'boolean', default: 'false', description: 'Makes the header row sticky on scroll. Measures header height for colspan positioning.' },
        { name: 'sticky-column', type: 'boolean', default: 'false', description: 'Makes the first column sticky on horizontal scroll. CSS-only.' },
        { name: 'variant', type: '"plain"', default: '\u2014', description: 'Plain variant: no outer border, no radius, no header fill, no row hover.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'radius', type: '"sharp" | "default" | "round"', default: 'inherited', description: 'Border radius. CSS-only.' },
      ],
    },
    {
      kind: 'attributes',
      title: 'Attributes \u2014 n-table-header',
      rows: [
        { name: 'sortable', type: 'boolean', default: 'false', description: 'Enables click-to-sort on this column.' },
        { name: 'sort', type: '"none" | "asc" | "desc"', default: '"none"', description: 'Current sort state (managed by n-table store).' },
      ],
    },
    {
      kind: 'attributes',
      title: 'Attributes \u2014 n-table-row',
      rows: [
        { name: 'value', type: 'string', default: '\u2014', description: 'Row identifier used for selection tracking.' },
        { name: 'selected', type: 'boolean', default: 'false', description: 'Whether this row is selected (managed by n-table store).' },
        { name: 'colspan', type: 'boolean', default: 'false', description: 'Full-width category header row. Hidden when sorting is active.' },
        { name: 'sticky', type: 'boolean', default: 'false', description: 'Makes a colspan row sticky below the header (requires sticky-header).' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:table-sort', detail: '{ column, direction }', description: 'Fired when sort changes. direction: "asc", "desc", or null.' },
        { event: 'native:table-select', detail: '{ value, selected, allSelected }', description: 'Fired when row selection changes. allSelected is an array of all selected values.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-selected="true"]', description: 'Selected row. Highlighted background.' },
        { selector: '[aria-sort="ascending"]', description: 'Column header sorted ascending.' },
        { selector: '[aria-sort="descending"]', description: 'Column header sorted descending.' },
        { selector: '[resizing]', description: 'Present on the table during column resize.' },
        { selector: '[dragging]', description: 'Present on the row being dragged during reorder.' },
        { selector: '[force-hover]', description: 'Forces hover on rows for debugging/testing.' },
        { selector: '[force-focus-visible]', description: 'Forces focus ring on selectable rows for debugging/testing.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'Tab', action: 'Move focus between interactive elements (sort headers, selectable rows).' },
        { key: 'Enter / Space', action: 'Toggle sort on a sortable header, or select a row.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'table (via ElementInternals)' },
        { property: 'Sort', value: 'aria-sort on sortable header cells.' },
        { property: 'Selection', value: 'aria-selected on selectable rows.' },
        { property: 'Structure', value: 'n-table-head + n-table-body row groups with CSS display: contents.' },
      ],
    },
  ],
};
