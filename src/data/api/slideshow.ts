import type { ApiReference } from './types';

export const slideshowApi: ApiReference = {
  element: 'n-slideshow',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'direction', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Scroll direction of the carousel.' },
        { name: 'controls', type: 'boolean', default: 'false', description: 'Shows prev/next navigation buttons.' },
        { name: 'indicators', type: 'boolean', default: 'false', description: 'Shows dot indicators below slides.' },
        { name: 'autoplay', type: 'boolean', default: 'false', description: 'Enables automatic slide advancement. Pauses on hover/focus. Respects prefers-reduced-motion.' },
        { name: 'interval', type: 'number', default: '5000', description: 'Autoplay interval in milliseconds.' },
        { name: 'loop', type: 'boolean', default: 'false', description: 'Enables infinite looping (wraps from last to first and vice versa).' },
        { name: 'peek', type: 'boolean', default: 'false', description: 'Shows partial adjacent slides at the edges.' },
        { name: 'per-view', type: 'number', default: '1', description: 'Number of slides visible at once.' },
        { name: 'gap', type: 'boolean', default: 'false', description: 'Adds spacing between slides.' },
        { name: 'index', type: 'number', default: '0', description: 'Active slide index (0-based). Setting navigates to that slide.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables keyboard navigation. Sets aria-disabled="true".' },
        { name: 'intent', type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"', default: 'inherited', description: 'Color intent. CSS-only, cascades from parent.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:slide-change', detail: '{ index, slide }', description: 'Fired when the active slide changes (via scroll snap, controls, or API).' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-disabled="true"]', description: 'Disabled state. Disables track interaction and dims controls.' },
        { selector: '[force-hover]', description: 'Forces hover appearance on controls and indicators.' },
        { selector: '[force-focus-visible]', description: 'Forces focus ring on controls and indicators.' },
        { selector: 'n-slide[active]', description: 'Present on the currently visible slide.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'ArrowRight / ArrowDown', action: 'Next slide (direction-dependent).' },
        { key: 'ArrowLeft / ArrowUp', action: 'Previous slide (direction-dependent).' },
        { key: 'Home', action: 'Go to first slide.' },
        { key: 'End', action: 'Go to last slide.' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role', value: 'region (via ElementInternals)' },
        { property: 'Roledescription', value: 'carousel' },
        { property: 'Label', value: 'aria-label="Slideshow" (default, overridable)' },
        { property: 'Live region', value: 'Announces "Slide X of Y" on change.' },
        { property: 'Slides', value: 'Each n-slide has role="group", aria-roledescription="slide".' },
      ],
    },
  ],
};
