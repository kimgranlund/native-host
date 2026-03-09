import type { ApiReference } from './types';

export const dialogApi: ApiReference = {
  element: 'n-dialog',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'no-close-on-escape', type: 'boolean', default: 'false', description: 'Prevents closing the dialog on Escape key press.' },
        { name: 'no-close-on-backdrop', type: 'boolean', default: 'false', description: 'Prevents closing the dialog on backdrop click.' },
      ],
    },
    {
      kind: 'methods',
      rows: [
        { method: 'showModal()', description: 'Opens the dialog as a modal (top layer). Creates a native dialog and calls dialog.showModal().' },
        { method: 'close()', description: 'Closes the dialog.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'close', detail: '\u2014', description: 'Fired when the dialog is closed.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-dialog-width', default: 'auto', description: 'Width of the dialog content.' },
        { property: '--n-dialog-shadow', default: 'none', description: 'Box shadow on the dialog content.' },
        { property: '--n-backdrop-color', default: 'theme', description: 'Backdrop color behind the dialog.' },
        { property: '--n-backdrop-opacity', default: 'theme', description: 'Backdrop opacity.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'Escape', action: 'Closes the dialog (unless no-close-on-escape is set).' },
        { key: 'Tab', action: 'Cycles focus within the dialog (focus trap).' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Pattern', value: 'Creates a native dialog element, promoted to the top layer via showModal(). CSS custom properties inherit normally.' },
        { property: 'Focus trap', value: 'Yes \u2014 Tab cycles within the dialog while open.' },
        { property: 'Backdrop', value: 'Native ::backdrop pseudo-element styled with --n-backdrop-* tokens.' },
      ],
    },
  ],
};
