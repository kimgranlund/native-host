import type { ApiReference } from './types';

export const treeApi: ApiReference = {
  element: 'n-tree',
  sections: [
    {
      kind: 'attributes',
      title: 'Attributes \u2014 n-tree',
      rows: [
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction for all tree items. Sets aria-disabled="true".' },
        { name: 'aria-label', type: 'string', default: '"Tree"', description: 'Accessible label for the tree landmark.' },
        { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: 'inherited', description: 'Size scale. CSS-only, cascades from parent.' },
      ],
    },
    {
      kind: 'attributes',
      title: 'Attributes \u2014 n-tree-item',
      rows: [
        { name: 'expanded', type: 'boolean', default: 'false', description: 'Whether child items are visible.' },
        { name: 'selected', type: 'boolean', default: 'false', description: 'Whether this item is selected.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction for this item.' },
      ],
    },
    {
      kind: 'slots',
      rows: [
        { slot: 'label', description: 'The clickable label row. Made focusable for roving focus.' },
        { slot: '(default)', description: 'Child n-tree-item elements (nested items).' },
      ],
    },
    {
      kind: 'selectors',
      rows: [
        { selector: '[aria-disabled="true"]', description: 'Disabled state on tree or item.' },
        { selector: '[expanded]', description: 'Present on expanded tree items. Shows child group.' },
        { selector: '[aria-selected="true"]', description: 'Selected item. Highlighted background.' },
        { selector: '[expandable]', description: 'Auto-set on items with child tree items. Adds caret icon.' },
        { selector: '[force-hover]', description: 'Forces hover on item label for debugging/testing.' },
        { selector: '[force-focus-visible]', description: 'Forces focus ring on item label for debugging/testing.' },
      ],
    },
    {
      kind: 'keyboard',
      rows: [
        { key: 'ArrowUp / ArrowDown', action: 'Move focus between visible item labels (roving focus).' },
        { key: 'ArrowRight', action: 'Expand the focused item, or move focus to first child.' },
        { key: 'ArrowLeft', action: 'Collapse the focused item, or move focus to parent item.' },
        { key: 'Enter / Space', action: 'Select the focused item and toggle expand/collapse.' },
        { key: 'Home / End', action: 'Move focus to first/last visible item (roving focus).' },
      ],
    },
    {
      kind: 'accessibility',
      rows: [
        { property: 'Role (n-tree)', value: 'tree (via ElementInternals)' },
        { property: 'Role (n-tree-item)', value: 'treeitem (via ElementInternals)' },
        { property: 'ARIA attributes', value: 'aria-expanded on expandable items, aria-selected on all items.' },
        { property: 'Focus', value: 'Roving focus on [slot="label"] elements. Single tabindex="0" in the tree.' },
      ],
    },
  ],
};
