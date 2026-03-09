import type { ApiReference } from './types';

export const validatableApi: ApiReference = {
  element: 'validatable',
  sections: [
    {
      kind: 'methods',
      rows: [
        {
          method: 'validate(value?)',
          returns: 'boolean',
          description: 'Runs all rules against the value (or auto-detects from a child input). Sets [invalid] and aria-invalid, and dispatches events. Returns true if valid.',
        },
        {
          method: 'clearValidation()',
          returns: 'void',
          description: 'Removes [invalid] and clears the error message.',
        },
      ],
    },
    {
      kind: 'events',
      rows: [
        {
          event: 'native:invalid',
          detail: '{ message }',
          description: 'Fired when validation fails. message is the first failing rule message.',
        },
        {
          event: 'native:valid',
          detail: '—',
          description: 'Fired when validation passes after a previous failure.',
        },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        {
          selector: '[invalid]',
          description: 'Set on the host element when validation fails. Use to style error state on child inputs.',
        },
      ],
    },
  ],
};
