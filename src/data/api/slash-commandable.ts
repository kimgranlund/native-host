import type { ApiReference } from './types';

export const slashCommandableApi: ApiReference = {
  element: 'slash-commandable',
  sections: [
    {
      kind: 'attributes',
      title: 'Constructor Options',
      rows: [
        {
          name: 'input',
          type: 'HTMLElement',
          default: '—',
          description: 'The input element to monitor (n-textarea, n-input, or any element dispatching native:input).',
        },
        {
          name: 'commands',
          type: 'SlashCommand[]',
          default: '—',
          description: 'Array of command definitions to display in the popover.',
        },
      ],
    },
    {
      kind: 'methods',
      rows: [
        {
          method: 'destroy()',
          returns: 'void',
          description: 'Hides the popover, removes all event listeners, and cleans up the listbox element.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:slash-query',
          detail: '{ query, commands }',
          description: 'Fired on the host when typing after /. query is the text after the slash. commands is the filtered array.',
        },
        {
          event: 'native:slash-select',
          detail: '{ command, action }',
          description: "Fired on the host when a command is selected (Enter or click). command is the full SlashCommand object. action is the resolved type ('tag', 'insert', or 'event').",
        },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        {
          key: 'Cmd+/ / Ctrl+/',
          action: 'Insert / at caret and open the command popover (toggle).',
        },
        {
          key: 'ArrowDown / ArrowUp',
          action: 'Navigate the command list.',
        },
        {
          key: 'Enter',
          action: 'Select the active command.',
        },
        {
          key: 'Tab',
          action: 'Select the closest match (when query has 2+ characters).',
        },
        {
          key: 'Escape',
          action: 'Close the command popover.',
        },
      ],
    },
  ],
};
