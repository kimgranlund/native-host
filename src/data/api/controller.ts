import type { ApiReference } from './types';

export const controllerApi: ApiReference = {
  element: 'n-controller',
  sections: [
    {
      kind: 'attributes',
      title: 'Available Traits',
      rows: [
        { name: 'pressable', type: 'PressController', default: '\u2014', description: 'Key options: disabled' },
        { name: 'hoverable', type: 'HoverController', default: '\u2014', description: 'Key options: delay, leave-delay, disabled' },
        { name: 'draggable', type: 'DragController', default: '\u2014', description: 'Key options: selector, axis, mode, drop-zone-selector, disabled' },
        { name: 'resizable', type: 'ResizeController', default: '\u2014', description: 'Key options: handle-selector, axis, min, max, disabled' },
        { name: 'selectable', type: 'SelectionController', default: '\u2014', description: 'Key options: selector, mode, disabled' },
        { name: 'editable', type: 'EditController', default: '\u2014', description: 'Key options: trigger, disabled' },
        { name: 'copyable', type: 'CopyController', default: '\u2014', description: 'Key options: value, feedback-duration' },
        { name: 'sortable', type: 'SortController', default: '\u2014', description: 'Key options: selector, disabled' },
        { name: 'collapsible', type: 'CollapsibleController', default: '\u2014', description: 'Key options: duration' },
        { name: 'swipeable', type: 'SwipeController', default: '\u2014', description: 'Key options: threshold, velocity-threshold, axis, disabled' },
        { name: 'intersectable', type: 'IntersectController', default: '\u2014', description: 'Key options: threshold, margin, once, disabled' },
        { name: 'droppable', type: 'DropZoneController', default: '\u2014', description: 'Key options: accept, disabled, multiple' },
        { name: 'range-selectable', type: 'RangeSelectController', default: '\u2014', description: 'Key options: selector, mode, disabled' },
        { name: 'roving-focusable', type: 'RovingFocusController', default: '\u2014', description: 'Key options: selector, orientation, wrap, disabled' },
        { name: 'searchable', type: 'SearchController', default: '\u2014', description: 'Key options: selector, text-field, disabled' },
        { name: 'virtualizable', type: 'VirtualScrollController', default: '\u2014', description: 'Key options: item-height, overscan' },
      ],
    },
    {
      kind: 'attributes',
      title: 'Prerequisite',
      rows: [
        { name: 'registerAllTraits()', type: 'function', default: '\u2014', description: 'Call once at app startup to register all built-in trait adapters. Required for both patterns.' },
      ],
    },
  ],
};
