import type { ApiReference } from './types';

export const segmentedControlApi: ApiReference = {
  element: 'n-segmented-control',
  sections: [
    {
      kind: 'attributes',
      title: 'Attributes \u2014 n-segmented-control',
      rows: [
        { name: 'value', type: 'string', default: '\u2014', description: 'Currently selected segment value.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all segments. Sets aria-disabled="true".' },
        { name: 'name', type: 'string', default: '\u2014', description: 'Form field name for form association.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as required for form validation.' },
        { name: 'inline', type: 'boolean', default: 'false', description: 'Shrink-wraps the control instead of filling available width.' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'density', type: '"compact" | "default" | "loose"', default: 'inherited', description: 'Inline padding density. CSS-only, cascades from parent.' },
        { name: 'radius', type: '"sharp" | "default" | "round"', default: 'inherited', description: 'Border radius. CSS-only.' },
      ],
    },
    {
      kind: 'attributes',
      title: 'Attributes \u2014 n-segment',
      rows: [
        { name: 'value', type: 'string', default: '""', description: 'Segment value emitted on selection.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this individual segment.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:change', detail: '{ value, label }', description: 'Fired when selection changes.' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-disabled="true"]', description: 'Disabled state on control or individual segment.' },
        { selector: 'n-segment[aria-checked="true"]', description: 'Currently selected segment.' },
        { selector: 'n-segment[pressed]', description: 'Present while pointer or key is held down on a segment.' },
        { selector: 'n-segment[force-hover]', description: 'Forces hover appearance on a segment.' },
        { selector: 'n-segment[force-active]', description: 'Forces active appearance on a segment.' },
        { selector: 'n-segment[force-focus-visible]', description: 'Forces focus ring on a segment.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'ArrowLeft / ArrowRight', action: 'Move focus between segments (roving focus).' },
        { key: 'Home', action: 'Focus first segment.' },
        { key: 'End', action: 'Focus last segment.' },
        { key: 'Enter / Space', action: 'Select the focused segment.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role (control)', value: 'radiogroup (via ElementInternals)' },
        { property: 'Role (segment)', value: 'radio (via ElementInternals)' },
        { property: 'Form associated', value: 'Yes \u2014 submits selected value as form data.' },
        { property: 'Focus', value: 'Roving focus via ListNavigateController.' },
      ],
    },
  ],
};
