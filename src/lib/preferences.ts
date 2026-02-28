// Cookie/localStorage key names — shared by server (layouts) and client (layout.ts)
export const PREF_COLOR_SCHEME = 'nav-color-scheme';
export const PREF_SIDEBAR_COLLAPSED = 'nav-sidebar-collapsed';
export const PREF_GROUP_STATES = 'nav-group-states';
export const PREF_SHOW_CODE = 'demo-show-code';

export interface Preferences {
  colorScheme: string;
  sidebarCollapsed: boolean;
  groupStates: Record<string, boolean>;
  showCode: boolean;
}

/** Default group states: only "Components" is open */
const DEFAULT_GROUP_STATES: Record<string, boolean> = { Components: true };

/** Read Astro.cookies and return typed preferences with defaults */
export function parsePreferences(cookies: {
  get(name: string): { value: string } | undefined;
}): Preferences {
  const colorScheme = cookies.get(PREF_COLOR_SCHEME)?.value || '';
  const sidebarCollapsed = cookies.get(PREF_SIDEBAR_COLLAPSED)?.value === 'true';

  let groupStates = DEFAULT_GROUP_STATES;
  try {
    const raw = cookies.get(PREF_GROUP_STATES)?.value;
    if (raw) groupStates = JSON.parse(decodeURIComponent(raw));
  } catch { /* use default */ }

  const showCode = cookies.get(PREF_SHOW_CODE)?.value === 'true';

  return { colorScheme, sidebarCollapsed, groupStates, showCode };
}
