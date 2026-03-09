import type { ApiReference } from './types';

export const calendarApi: ApiReference = {
  element: 'n-calendar',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'value', type: 'string', default: '\u2014', description: 'Selected date in ISO format (YYYY-MM-DD).' },
        { name: 'min', type: 'string', default: '\u2014', description: 'Minimum selectable date in ISO format. Dates before this are disabled.' },
        { name: 'max', type: 'string', default: '\u2014', description: 'Maximum selectable date in ISO format. Dates after this are disabled.' },
        { name: 'range', type: 'boolean', default: 'false', description: 'Enables range selection mode (click start, hover preview, click end, click clear).' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all interaction. Sets aria-disabled="true".' },
        { name: 'name', type: 'string', default: '\u2014', description: 'Form field name for form association.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as required for form validation.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:change', detail: '{ value }', description: 'Fired on single date selection. value is ISO format (YYYY-MM-DD).' },
        { event: 'native:range-select', detail: '{ start, end }', description: 'Fired on range commit (range mode only). Both values in ISO format.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-disabled="true"]', description: 'Disabled state. Dims all content and prevents interaction.' },
        { selector: '[force-hover]', description: 'Forces hover appearance on all internal cells.' },
        { selector: '[force-focus-visible]', description: 'Forces focus ring on the calendar container.' },
        { selector: '[view="day"]', description: 'Day view (7-column grid).' },
        { selector: '[view="month"]', description: 'Month view (4-column grid).' },
        { selector: '[view="year"]', description: 'Year view (4-column grid).' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'ArrowLeft', action: 'Previous day.' },
        { key: 'ArrowRight', action: 'Next day.' },
        { key: 'ArrowUp', action: 'Same day, previous week.' },
        { key: 'ArrowDown', action: 'Same day, next week.' },
        { key: 'Home', action: 'First day of current week.' },
        { key: 'End', action: 'Last day of current week.' },
        { key: 'PageUp', action: 'Previous month (Shift: previous year).' },
        { key: 'PageDown', action: 'Next month (Shift: next year).' },
        { key: 'Enter / Space', action: 'Select the focused date.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'group (via ElementInternals)' },
        { property: 'Label', value: 'aria-label set to current month/year title (e.g. "March 2026").' },
        { property: 'Grid', value: 'Internal .cal-grid has role="grid".' },
        { property: 'Form associated', value: 'Yes \u2014 submits selected date as form data.' },
        { property: 'Focus', value: 'tabindex="0" on the calendar container.' },
      ],
    },
  ],
};
