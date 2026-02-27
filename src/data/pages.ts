// Page registry — single source of truth for navigation, breadcrumbs, and command palette.
// Group is derived from directory. Title defaults to filename but can be overridden.

export interface PageEntry {
  title: string;
  path: string;
  group: string;
}

// Directory → group mapping
const dirGroup: Record<string, string> = {
  components: 'Components',
  containers: 'Containers',
  traits: 'Traits',
  blocks: 'Blocks',
  core: 'Core',
  styles: 'Other',
  a2ui: 'Other',
};

// Group display order
const groupOrder = ['Components', 'Containers', 'Traits', 'Blocks', 'Core', 'Other'];

// Title overrides for pages where filename ≠ display title
const titleOverrides: Record<string, string> = {
  '/containers/ui-header': 'ui-header / body / footer',
  '/traits/roving-focusable': 'RovingFocusable',
  '/traits/focus-trappable': 'FocusTrappable',
  '/traits/range-selectable': 'RangeSelectable',
  '/blocks/data-dashboard-stats': 'Dashboard Stats',
  '/blocks/notify-toast-demo': 'Toast Demo',
  '/blocks/notify-empty-state': 'Empty State',
  '/blocks/notify-error-page': 'Error Page',
  '/blocks/nav-sidebar-block': 'Nav Sidebar',
  '/blocks/overlay-command-palette': 'Command Palette',
  '/blocks/overlay-confirmation': 'Confirmation Dialog',
  '/core/context': 'Context API',
  '/styles/ui': 'UI Showcase',
  '/a2ui/a2ui': 'A2UI Protocol',
  '/a2ui/a2ui-components': 'A2UI Components',
  '/icons': 'Icons',
  '/kernel': 'Kernel',
};

// Derive title from slug: "auth-login" → "Auth Login", "ui-button" → "ui-button"
function slugToTitle(slug: string, group: string): string {
  // Components & Containers keep their element names as-is
  if (group === 'Components' || group === 'Containers') return slug;
  // Traits: PascalCase from slug
  if (group === 'Traits') {
    return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
  }
  // Blocks & Other: Title Case
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function buildSitemap(): PageEntry[] {
  // Glob all .astro page files at build time
  const modules = import.meta.glob('/src/pages/**/*.astro', { eager: true });
  const entries: PageEntry[] = [];

  for (const filePath of Object.keys(modules)) {
    // /src/pages/components/ui-button.astro → /components/ui-button
    const relative = filePath.replace('/src/pages', '').replace(/\.astro$/, '');

    // Skip index page (it's the landing page, not a doc page)
    if (relative === '/index') continue;

    // Parse directory and slug
    const parts = relative.split('/').filter(Boolean); // ["components", "ui-button"]
    const slug = parts[parts.length - 1];
    const dir = parts.length > 1 ? parts[0] : null;

    // Determine group
    const group = dir ? (dirGroup[dir] || 'Other') : 'Other';

    // Determine path
    const path = relative;

    // Determine title
    const title = titleOverrides[path] || slugToTitle(slug, group);

    entries.push({ title, path, group });
  }

  // Sort: by group order, then alphabetically within group
  entries.sort((a, b) => {
    const ga = groupOrder.indexOf(a.group);
    const gb = groupOrder.indexOf(b.group);
    if (ga !== gb) return ga - gb;
    return a.title.localeCompare(b.title);
  });

  return entries;
}

export const sitemap = buildSitemap();
