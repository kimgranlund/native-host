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
  '/changelog': 'updated',
  '/showcase/a2ui-builder': 'new',
  '/showcase/a2a-tictactoe': 'new',
  '/traits/noodleable': 'new',
  '/a2ui/a2ui-workbench': 'new',
  '/traits/tossable': 'new',
  '/traits/flippable': 'new',
  '/traits/parallaxable': 'new',
  '/traits/confettible': 'new',
  '/traits/magnetizable': 'new',
  '/traits/css-inspectable': 'new',
  '/controllers/store-controller': 'new',
};

// Directory → group mapping
const dirGroup: Record<string, string> = {
  components: 'Components',
  containers: 'Containers',
  traits: 'Traits',
  blocks: 'Blocks',
  core: 'Core Systems',
  packages: 'Utilities',
  showcase: 'Agentic AI',
  styles: 'Other',
  a2ui: 'Agentic AI',
  gateways: 'Gateways',
  controllers: 'Controllers',
};

// Group display order (flat — section headers are layout-only in SidebarLayout)
const groupOrder = [
  'New & Updates', 'Demo Highlights',
  'Agentic AI', 'Traits', 'Gateways', 'Controllers', 'Utilities',
  'Blocks', 'Components', 'Containers', 'Core Systems',
  'Other',
];

// Group overrides for pages outside their natural directory
const groupOverrides: Record<string, string> = {
  '/kernel': 'Core Systems',
  '/icons': 'Core Systems',
  '/changelog': 'Other',
};

// Title overrides for pages where filename ≠ display title
const titleOverrides: Record<string, string> = {
  '/containers/header': 'Header',
  '/components/input-otp': 'Input OTP',
  '/components/kbd': 'Kbd',
  '/packages/native-editor': 'Editor',
  '/packages/native-playground': 'Playground',
  '/packages/native-codemirror': 'CodeMirror',
  '/traits/roving-focusable': 'RovingFocusable',
  '/traits/focus-trappable': 'FocusTrappable',
  '/traits/range-selectable': 'RangeSelectable',
  '/traits/slash-commandable': 'SlashCommandable',
  '/traits/shortcutable': 'Shortcutable',
  '/traits/list-navigable': 'ListNavigable',
  '/traits/css-inspectable': 'CSSInspectable',
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
  '/showcase/a2ui-builder': 'A2UI Builder',
  '/showcase/a2a-tictactoe': 'A2A Demo',
  '/changelog': 'Changelog',
  '/gateways': 'Gateways',
  '/controllers': 'Controllers',
  '/controllers/store-controller': 'StoreController',
  '/styles/reference': 'Reference',
  '/styles/state-grid': 'State Grid',
  '/styles/colors': 'Colors',
};

// Derive title from slug: "auth-login" → "Auth Login", "button" → "Button"
function slugToTitle(slug: string, group: string): string {
  // Components & Containers: Title Case
  if (group === 'Components' || group === 'Containers') {
    return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
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
    // /src/pages/components/button.astro → /components/button
    const relative = filePath.replace('/src/pages', '').replace(/\.astro$/, '');

    // Skip index pages (landing page, directory index pages render at directory path)
    if (relative === '/index') continue;

    // Skip auth, account, API, admin, and signup pages
    if (relative.startsWith('/auth/') || relative.startsWith('/account/') || relative.startsWith('/api/') || relative.startsWith('/admin/')) continue;
    if (relative === '/signup') continue;

    // Parse directory and slug
    const parts = relative.split('/').filter(Boolean); // ["components", "button"]
    const slug = parts[parts.length - 1];
    const dir = parts.length > 1 ? parts[0] : null;

    // Directory index files:
    //   /gateways/index → path "/gateways", slug "gateways"
    //   /components/button/index → path "/components/button", slug "button"
    const isIndex = slug === 'index';
    const path = isIndex ? relative.replace(/\/index$/, '') : relative;
    const effectiveSlug = isIndex ? parts[parts.length - 2] : slug;

    // Determine group
    const group = groupOverrides[path] ?? (dir ? (dirGroup[dir] || 'Other') : 'Other');

    // Determine title
    const title = titleOverrides[path] || slugToTitle(effectiveSlug, group);

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

// Demo Highlights — hardcoded featured pages
export const demoHighlights: { path: string; title: string }[] = [
  { path: '/showcase/a2a-tictactoe', title: 'A2A Demo' },
  { path: '/a2ui/a2ui-workbench', title: 'A2UI Workbench' },
];

// New & Updated pages — filtered from sitemap badges
// Pinned paths appear first in the specified order, then remaining by badge kind + alpha
const pinnedOrder = [
  '/showcase/a2ui-builder',
  '/showcase/a2a-tictactoe',
  '/traits/noodleable',
  '/a2ui/a2ui-workbench',
];
export function getNewAndUpdatedPages(): PageEntry[] {
  const kindOrder: Record<string, number> = { new: 0, updated: 1, recent: 2 };
  return sitemap
    .filter(e => e.badge)
    .sort((a, b) => {
      const pa = pinnedOrder.indexOf(a.path);
      const pb = pinnedOrder.indexOf(b.path);
      if (pa !== -1 && pb !== -1) return pa - pb;
      if (pa !== -1) return -1;
      if (pb !== -1) return 1;
      return (kindOrder[a.badge!] ?? 9) - (kindOrder[b.badge!] ?? 9) || a.title.localeCompare(b.title);
    });
}

// Section definitions for sidebar layout
export const caseStudyGroups = ['Agentic AI', 'Traits', 'Gateways', 'Controllers', 'Utilities'];
export const nativeGroups = ['Blocks', 'Components', 'Containers', 'Core Systems'];
