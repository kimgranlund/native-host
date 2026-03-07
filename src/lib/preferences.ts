// Cookie/localStorage key names — shared by server (layouts) and client (layout.ts)
export const PREF_COLOR_SCHEME = 'nav-color-scheme';
export const PREF_SIDEBAR_COLLAPSED = 'nav-sidebar-collapsed';
export const PREF_GROUP_STATES = 'nav-group-states';
export const PREF_SHOW_CODE = 'demo-show-code';
export const PREF_SIDEBAR_WIDTH = 'nav-sidebar-width';
export const PREF_PINNED_PAGES = 'nav-pinned-pages';

export interface Preferences {
  colorScheme: string;
  sidebarCollapsed: boolean;
  sidebarWidth: string;
  groupStates: Record<string, boolean>;
  showCode: boolean;
  pinnedPages: string[];
}

/** Default group states: only "Components" is open */
const DEFAULT_GROUP_STATES: Record<string, boolean> = { Components: true };

/** Read Astro.cookies and return typed preferences with defaults */
export function parsePreferences(cookies: {
  get(name: string): { value: string } | undefined;
}): Preferences {
  const colorScheme = cookies.get(PREF_COLOR_SCHEME)?.value || '';
  const sidebarCollapsed = cookies.get(PREF_SIDEBAR_COLLAPSED)?.value === 'true';
  const sidebarWidth = cookies.get(PREF_SIDEBAR_WIDTH)?.value || '';

  let groupStates = DEFAULT_GROUP_STATES;
  try {
    const raw = cookies.get(PREF_GROUP_STATES)?.value;
    if (raw) groupStates = JSON.parse(decodeURIComponent(raw));
  } catch { /* use default */ }

  const showCode = cookies.get(PREF_SHOW_CODE)?.value === 'true';

  let pinnedPages: string[] = [];
  try {
    const raw = cookies.get(PREF_PINNED_PAGES)?.value;
    if (raw) pinnedPages = JSON.parse(decodeURIComponent(raw));
  } catch { /* use default */ }

  return { colorScheme, sidebarCollapsed, sidebarWidth, groupStates, showCode, pinnedPages };
}

/**
 * Load preferences — DB for authenticated users, cookies for anonymous.
 * Falls back to cookie prefs if DB row doesn't exist yet.
 */
export async function loadPreferences(
  locals: App.Locals,
  cookies: { get(name: string): { value: string } | undefined },
): Promise<Preferences> {
  const cookiePrefs = parsePreferences(cookies);

  if (!locals.user) return cookiePrefs;

  // Lazy import to avoid pulling DB into client bundles
  const { db } = await import('../db/client');
  const { userPreferences } = await import('../db/schema');
  const { eq } = await import('drizzle-orm');

  let row: typeof userPreferences.$inferSelect | undefined;
  try {
    const rows = await db.select().from(userPreferences).where(eq(userPreferences.userId, locals.user.id));
    row = rows[0];
  } catch {
    // Column may not exist yet (migration pending) — fall back to cookies
    return cookiePrefs;
  }

  if (!row) return cookiePrefs;

  return {
    colorScheme: row.colorScheme ?? cookiePrefs.colorScheme,
    sidebarCollapsed: row.sidebarCollapsed ?? cookiePrefs.sidebarCollapsed,
    sidebarWidth: cookiePrefs.sidebarWidth,
    groupStates: row.groupStates ? JSON.parse(row.groupStates) : cookiePrefs.groupStates,
    showCode: row.showCode ?? cookiePrefs.showCode,
    pinnedPages: (row as Record<string, unknown>).pinnedPages
      ? JSON.parse((row as Record<string, unknown>).pinnedPages as string)
      : cookiePrefs.pinnedPages,
  };
}
