import type { ApiReference } from './types';

export const noodlesApi: ApiReference = {
  element: 'n-noodles',
  sections: [
    {
      kind: 'attributes',
      rows: [
        { name: 'editable', type: 'boolean', default: 'false', description: 'Allow interactive creation/deletion of connections.' },
        { name: 'color', type: 'string', default: 'accent', description: 'Noodle stroke color.' },
        { name: 'stroke-width', type: 'number', default: '2', description: 'Stroke width in px.' },
        { name: 'tension', type: 'number', default: '0.5', description: 'Bezier control point distance (0–1).' },
        { name: 'show-ports', type: 'boolean', default: 'auto', description: 'Show port indicator dots (defaults to editable state).' },
        { name: 'port-size', type: 'number', default: '10', description: 'Port dot size in px.' },
        { name: 'curve', type: "'bezier' | 'step' | 'straight'", default: 'bezier', description: 'Curve style for noodle paths.' },
        { name: 'animated', type: 'boolean', default: 'false', description: 'Flowing dash animation on noodles.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the controller.' },
      ],
    },
    {
      kind: 'methods',
      rows: [
        { method: 'connect(from, to, fromPort?, toPort?)', returns: 'string', description: 'Create a connection between two nodes. Returns the connection ID.' },
        { method: 'disconnect(id)', returns: 'boolean', description: 'Remove a connection by ID.' },
        { method: 'setConnections(arr)', description: 'Replace all connections with the given array.' },
        { method: 'clear()', description: 'Remove all connections.' },
        { method: 'update()', description: 'Force re-render of all noodle paths.' },
      ],
    },
    {
      kind: 'events',
      rows: [
        { event: 'native:noodle-connect', detail: '{ id, from, to, fromPort, toPort }', description: 'Fired when a connection is created.' },
        { event: 'native:noodle-disconnect', detail: '{ id, from, to, fromPort, toPort }', description: 'Fired when a connection is removed.' },
        { event: 'native:noodle-drag', detail: '{ from, fromPort, x, y }', description: 'Fired as the pointer moves during a drag-to-connect gesture.' },
      ],
    },
  ],
};
