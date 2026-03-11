import type { ApiReference } from './types';

export const paneApi: ApiReference = {
  element: 'n-pane',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'label', type: 'string', default: '—', description: 'Header label text. Auto-stamps a compact header when set.' },
        { name: 'icon', type: 'string', default: '—', description: 'Phosphor icon name shown before the label.' },
        { name: 'closeable', type: 'boolean', default: 'false', description: 'Shows a close button in the header.' },
        { name: 'minimizable', type: 'boolean', default: 'false', description: 'Shows a minimize/restore toggle button in the header.' },
        { name: 'minimized', type: 'boolean', default: 'false', description: 'Collapses the pane to header-only.' },
        { name: 'min-size', type: 'number', default: '0', description: 'Minimum pane size in pixels during resize.' },
        { name: 'max-size', type: 'number', default: '∞', description: 'Maximum pane size in pixels during resize.' },
      ],
    },
    {
      kind: 'methods',
      rows: [
        { method: 'close()', description: 'Closes the pane (removes from layout). Dispatches native:pane-close (cancelable).' },
        { method: 'minimize()', description: 'Collapses the pane to header-only. Dispatches native:pane-minimize.' },
        { method: 'restore()', description: 'Restores a minimized pane to full size. Dispatches native:pane-restore.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:pane-close', detail: '{ pane }', description: 'Close button clicked. Cancelable — call preventDefault() to keep the pane open.' },
        { event: 'native:pane-minimize', detail: '{ pane }', description: 'Pane collapsed to header-only.' },
        { event: 'native:pane-restore', detail: '{ pane }', description: 'Pane restored from minimized state.' },
        { event: 'native:pane-resize', detail: '{ sizes[], index }', description: 'Resize handle drag completed. sizes is an array of pixel widths/heights.' },
      ],
    },
    {
      kind: 'css-properties',
      rows: [
        { property: '--n-pane-header-height', default: '1.75rem', description: 'Compact header height.' },
        { property: '--n-pane-header-font-size', default: '0.6875rem', description: 'Header text size.' },
        { property: '--n-pane-handle-size', default: '4px', description: 'Resize handle hit area width.' },
        { property: '--n-pane-handle-color', default: 'var(--n-border-muted)', description: 'Resize handle hover color.' },
        { property: '--n-pane-border-color', default: 'var(--n-border-muted)', description: 'Border color between adjacent panes.' },
      ],
    },
  ],
};

export const paneGroupApi: ApiReference = {
  element: 'n-panes',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Layout direction. Horizontal places panes side-by-side; vertical stacks them.' },
      ],
    },
  ],
};
