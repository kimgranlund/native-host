import type { ApiReference } from './types';

export const noodleableApi: ApiReference = {
  element: 'noodleable',
  sections: [
    {
      kind: 'provider-usage',
      rows: [
        {
          name: 'data-trait-noodleable-selector',
          type: 'string',
          default: "'[data-noodle-port]'",
          description: 'CSS selector for port elements within the host.',
        },
        {
          name: 'data-trait-noodleable-editable',
          type: 'boolean',
          default: 'true',
          description: 'Allow users to draw and delete connections interactively.',
        },
        {
          name: 'data-trait-noodleable-color',
          type: 'string',
          default: "'currentColor'",
          description: 'Stroke color of the noodle curves.',
        },
        {
          name: 'data-trait-noodleable-stroke-width',
          type: 'number',
          default: '2',
          description: 'Stroke width of the noodle curves in pixels.',
        },
        {
          name: 'data-trait-noodleable-tension',
          type: 'number',
          default: '0.5',
          description: 'Bezier curve tension (0 = straight lines, 1 = maximum curve).',
        },
        {
          name: 'data-trait-noodleable-show-ports',
          type: 'boolean',
          default: 'true',
          description: 'Show port indicators on nodes.',
        },
        {
          name: 'data-trait-noodleable-port-size',
          type: 'number',
          default: '10',
          description: 'Size of port indicators in pixels.',
        },
        {
          name: 'data-trait-noodleable-style',
          type: "'bezier' | 'straight' | 'step'",
          default: "'bezier'",
          description: 'Visual style of connection curves.',
        },
        {
          name: 'data-trait-noodleable-animated',
          type: 'boolean',
          default: 'false',
          description: 'Animate the noodle stroke with a flowing dash pattern.',
        },
        {
          name: 'data-trait-noodleable-connections',
          type: 'string (JSON)',
          default: "'[]'",
          description: 'Initial connection list as a JSON array of { from, to } port ID pairs.',
        },
        {
          name: 'data-trait-noodleable-disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables all noodle interaction when true.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:noodle-connect',
          detail: '{ from, to }',
          description: 'Fired when a connection is made between two ports.',
        },
        {
          event: 'native:noodle-disconnect',
          detail: '{ from, to }',
          description: 'Fired when a connection between two ports is removed.',
        },
        {
          event: 'native:noodle-drag',
          detail: '{ from, x, y }',
          description: 'Fired while a new connection is being dragged from a port.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[data-noodle-port]',
          description: 'Marks an element as a connectable port. Value is the port ID.',
        },
        {
          selector: '[data-noodle-port-indicator]',
          description: 'The visual port indicator element rendered by the controller.',
        },
        {
          selector: '[data-noodle-port-indicator][data-noodle-dragging]',
          description: 'Present on the source port indicator while a connection is being dragged from it.',
        },
        {
          selector: '[data-noodle-port-indicator][data-noodle-droppable]',
          description: 'Present on port indicators that can accept the current dragged connection.',
        },
        {
          selector: '[data-noodle-port-indicator][data-noodle-drop-ready]',
          description: 'Present on a droppable port indicator when the drag is close enough to snap.',
        },
      ],
    },
  ],
};
