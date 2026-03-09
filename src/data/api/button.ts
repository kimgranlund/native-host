import type { ApiReference } from './types';

export const buttonApi: ApiReference = {
  element: 'n-button',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction. Sets aria-disabled="true" and removes from tab order.' },
        { name: 'type', type: '"button" | "submit" | "reset"', default: '"button"', description: 'Form button type. submit calls form.requestSubmit(), reset calls form.reset().' },
        { name: 'variant', type: '"primary" | "secondary" | "outline" | "ghost" | "default" | "selected"', default: '"default"', description: 'Visual variant. CSS-only, no JS.' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
        { name: 'density', type: '"compact" | "default" | "loose"', default: 'inherited', description: 'Inline padding density. CSS-only, cascades from parent.' },
        { name: 'radius', type: '"sharp" | "default" | "round"', default: '"round"', description: 'Border radius. CSS-only.' },
        { name: 'justify', type: '"spread"', default: '\u2014', description: 'Switches grid to auto 1fr auto columns. Used for dropdown triggers in n-select.' },
        { name: 'inline', type: 'boolean', default: 'false', description: 'Shrink-wraps the button instead of filling available width.' },
      ],
    },
    {
      kind: 'slots',
      rows: [
        { slot: 'leading', description: 'Leading icon or element (before label).' },
        { slot: 'label', description: 'Button text label.' },
        { slot: 'trailing', description: 'Trailing icon or element (after label).' },
        { slot: '(default)', description: 'Unslotted content \u2014 used for icon-only buttons.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:press', detail: '{ pointerType }', description: 'Fired on activation (click, Enter, Space). pointerType: "mouse", "touch", "pen", or "keyboard".' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[pressed]', description: 'Present while pointer or key is held down.' },
        { selector: '[aria-disabled="true"]', description: 'Disabled state. Use for custom disabled styling.' },
        { selector: '[force-hover]', description: 'Forces hover appearance for debugging/testing.' },
        { selector: '[force-active]', description: 'Forces active appearance for debugging/testing.' },
        { selector: '[force-focus-visible]', description: 'Forces focus ring for debugging/testing.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'Enter', action: 'Activates the button.' },
        { key: 'Space', action: 'Activates the button (on key up).' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'button (via ElementInternals)' },
        { property: 'Form associated', value: 'Yes \u2014 submit/reset types trigger form actions.' },
        { property: 'Focus', value: 'tabindex="0", managed by disabled effect.' },
      ],
    },
  ],
};
