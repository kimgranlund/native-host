// Page registry — single source of truth for navigation, breadcrumbs, and command palette.
// Group is derived from directory. Title defaults to filename but can be overridden.

export type BadgeKind = 'new' | 'updated' | 'recent';

export interface PageEntry {
  title: string;
  path: string;
  group: string;
  badge?: BadgeKind;
}

// Badge assignments — pages with recent changes
const pageBadges: Record<string, BadgeKind> = {
  '/components/ui-pagination-dots': 'new',
  '/containers/ui-body': 'new',
  '/containers/ui-footer': 'new',
  '/containers/ui-text': 'new',
  '/traits/slash-commandable': 'new',
  '/traits/dialogable': 'new',
  '/traits/list-navigable': 'new',
  '/traits/presentable': 'new',
  '/traits/shortcutable': 'new',
  '/a2ui/a2ui-workbench': 'new',
  '/changelog': 'new',
  '/components/ui-table': 'updated',
  '/components/ui-input': 'updated',
  '/components/ui-textarea': 'updated',
  '/containers/ui-header': 'updated',
  '/containers/ui-panel': 'updated',
  '/containers/ui-toolbar': 'updated',
  '/traits/resizable': 'updated',
};

// Directory → group mapping
const dirGroup: Record<string, string> = {
  components: 'Components',
  containers: 'Containers',
  traits: 'Traits',
  blocks: 'Blocks',
  core: 'Core',
  packages: 'Packages',
  styles: 'Other',
  a2ui: 'Other',
};

// Group display order
const groupOrder = ['Components', 'Containers', 'Traits', 'Blocks', 'Core', 'Packages', 'Other'];

// Group overrides for pages outside their natural directory
const groupOverrides: Record<string, string> = {};

// Title overrides for pages where filename ≠ display title
const titleOverrides: Record<string, string> = {
  '/containers/ui-header': 'Header',
  '/components/ui-input-otp': 'Input OTP',
  '/components/ui-kbd': 'Kbd',
  '/packages/native-editor': 'Editor',
  '/packages/native-playground': 'Playground',
  '/packages/native-codemirror': 'CodeMirror',
  '/traits/roving-focusable': 'RovingFocusable',
  '/traits/focus-trappable': 'FocusTrappable',
  '/traits/range-selectable': 'RangeSelectable',
  '/traits/slash-commandable': 'SlashCommandable',
  '/traits/shortcutable': 'Shortcutable',
  '/traits/list-navigable': 'ListNavigable',
  '/blocks/data-dashboard-stats': 'Dashboard Stats',
  '/blocks/notify-toast-demo': 'Toast Demo',
  '/blocks/notify-empty-state': 'Empty State',
  '/blocks/notify-error-page': 'Error Page',
  '/blocks/nav-sidebar-block': 'Nav Sidebar',
  '/blocks/overlay-command-palette': 'Command Palette',
  '/blocks/overlay-confirmation': 'Confirmation Dialog',
  '/blocks/data-kanban': 'Kanban Board',
  '/blocks/nav-file-browser': 'File Browser',
  '/blocks/form-faq': 'FAQ',
  '/core/context': 'Context API',
  '/a2ui/a2ui': 'A2UI Protocol',
  '/a2ui/a2ui-components': 'A2UI Components',
  '/a2ui/a2ui-workbench': 'A2UI Workbench',
  '/icons': 'Icons',
  '/kernel': 'Kernel',
};

// Derive title from slug: "auth-login" → "Auth Login", "ui-button" → "Button"
function slugToTitle(slug: string, group: string): string {
  // Components & Containers: strip "ui-" prefix, Title Case
  if (group === 'Components' || group === 'Containers') {
    const name = slug.replace(/^ui-/, '');
    return name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  }
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

    // Skip auth, account, and API pages (not doc pages)
    if (relative.startsWith('/auth/') || relative.startsWith('/account/') || relative.startsWith('/api/')) continue;

    // Parse directory and slug
    const parts = relative.split('/').filter(Boolean); // ["components", "ui-button"]
    const slug = parts[parts.length - 1];
    const dir = parts.length > 1 ? parts[0] : null;

    // Determine group
    const group = groupOverrides[relative] ?? (dir ? (dirGroup[dir] || 'Other') : 'Other');

    // Determine path
    const path = relative;

    // Determine title
    const title = titleOverrides[path] || slugToTitle(slug, group);

    const badge = pageBadges[path];
    entries.push({ title, path, group, ...(badge && { badge }) });
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
