/**
 * Color token export utilities.
 * Resolves --n-* custom properties from the live DOM and exports as CSS or Figma Variables JSON.
 * Adapted from native-ui/src/styles/colors.export.ts for Astro host.
 *
 * Since the host loads CSS via @import (not fetchable source files), we scan
 * document.styleSheets to collect token names — same results, different method.
 */

const FAMILIES = ['neutral', 'accent', 'info', 'success', 'warning', 'danger'] as const;

type Scope = 'computed' | 'all';

// ── Helpers ──

/** Wait for styles to recompute after a color-scheme change. */
function waitForRepaint(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

/** Resolve a custom property to its computed color. */
function resolveColor(probe: HTMLElement, name: string): string | null {
  probe.style.backgroundColor = '';
  probe.style.backgroundColor = `var(${name})`;
  const val = getComputedStyle(probe).backgroundColor;
  if (!val || val === 'rgba(0, 0, 0, 0)' || val === 'transparent') return null;
  return val;
}

/** Convert computed color to oklch via CSS. */
function toOklch(probe: HTMLElement, color: string): string {
  probe.style.color = color;
  return getComputedStyle(probe).color;
}

/** Convert a computed color string to hex via canvas. */
function toHex(color: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  const rh = d[0].toString(16).padStart(2, '0');
  const gh = d[1].toString(16).padStart(2, '0');
  const bh = d[2].toString(16).padStart(2, '0');
  if (d[3] < 255) return `#${rh}${gh}${bh}${d[3].toString(16).padStart(2, '0')}`;
  return `#${rh}${gh}${bh}`;
}

/** Collect all --n-* custom properties from loaded stylesheets. */
function collectTokenNames(): string[] {
  const names: string[] = [];
  const re = /(--n-[a-zA-Z0-9_-]+)\s*:/g;
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        const text = rule.cssText || '';
        let m: RegExpExecArray | null;
        re.lastIndex = 0;
        while ((m = re.exec(text)) !== null) {
          if (!names.includes(m[1])) names.push(m[1]);
        }
      }
    } catch {
      // Cross-origin sheets can't be read — skip
    }
  }
  return names;
}

/** Filter token names by scope. */
function filterByScope(names: string[], scope: Scope): string[] {
  if (scope === 'computed') return names.filter((n) => n.startsWith('--n-color-'));
  // 'all' = computed + semantic (exclude env/math intermediates)
  return names.filter((n) => !n.startsWith('--n-env-') && !n.startsWith('--n-C-') && !n.startsWith('--n-L-'));
}

/** Group token names by prefix. */
function groupTokens(names: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const name of names) {
    const prefix = name.replace(/^--n-/, '').split('-')[0];
    if (!groups.has(prefix)) groups.set(prefix, []);
    groups.get(prefix)!.push(name);
  }
  return groups;
}

/** Documentation for each token group. */
const GROUP_DOCS: Record<string, string[]> = {
  color: [
    'Color Primitives (colors.computed.css)',
    'The foundational OKLCH color ramp for each family (neutral, accent, info, success, warning, danger).',
    'Three sub-scales: 11-step raw (1–11), 11-step semantic (050–950, light-dark aware),',
    'elevation (lowest→highest), brightness (dimmest→brightest), and scrim (alpha) variants.',
  ],
  doc: ['Document Ground — lowest-elevation background, the page/app canvas.'],
  body: ['Body Ground — content-area background, sits on top of the document ground.'],
  panel: ['Panel Ground — mid-elevation surface for sidebars, toolbars, secondary containers.'],
  control: ['Control Ground — form control background for inputs, selects, textareas.'],
  button: ['Button Ground — button fill for the "default" variant.'],
  card: ['Card Ground — highest-elevation opaque surface for floating cards, dialogs, popovers.'],
  modal: ['Modal Ground — top-layer surface for modal dialogs and blocking overlays.'],
  ink: [
    'Ink — text and icon colors on ground surfaces.',
    'Modifiers: strong, muted, inverse, placeholder. States: hover, active, disabled.',
  ],
  border: ['Border / Stroke — borders and dividers. Modifier: muted. States: hover, active, disabled.'],
  surface: ['Surface — interactive element fills (buttons, badges, chips, toggles). States: hover, active, disabled.'],
  outline: ['Outline — borders on surface fills, higher contrast than ground borders.'],
};

/** Resolve entries for a given scheme. */
function resolveEntries(probe: HTMLElement, names: string[]): [string, string][] {
  const entries: [string, string][] = [];
  for (const name of names) {
    const color = resolveColor(probe, name);
    if (!color) continue;
    const oklch = toOklch(probe, color);
    entries.push([name, oklch]);
  }
  return entries;
}

/** Build CSS :root block from resolved entries. */
function buildCssBlock(entries: [string, string][], scheme: string): string[] {
  const groups = groupTokens(entries.map(([n]) => n));
  const valueMap = new Map(entries);
  const lines: string[] = [`  /* ── ${scheme} ── */`];

  let first = true;
  for (const [prefix, names] of groups) {
    if (!first) lines.push('');
    first = false;

    const doc = GROUP_DOCS[prefix];
    if (doc) {
      lines.push('  /* ────────────────────────────────────────────────────');
      for (const line of doc) lines.push(`     ${line}`);
      lines.push('     ──────────────────────────────────────────────────── */');
    } else {
      lines.push(`  /* ── ${prefix} ── */`);
    }

    const maxLen = Math.max(...names.map((n) => n.length));
    for (const name of names) {
      const val = valueMap.get(name);
      if (!val) continue;
      const pad = ' '.repeat(maxLen - name.length);
      lines.push(`  ${name}:${pad} ${val};`);
    }
  }
  return lines;
}

/** Download a text file. */
function download(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ── CSS Export ──

/**
 * Export --n-* tokens as resolved CSS with light/dark modes.
 */
export async function exportCss(scope: Scope): Promise<void> {
  const names = filterByScope(collectTokenNames(), scope);

  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;pointer-events:none;';
  document.body.appendChild(probe);

  const root = document.documentElement;
  const originalScheme = root.style.colorScheme;

  root.style.colorScheme = 'light';
  await waitForRepaint();
  const lightEntries = resolveEntries(probe, names);

  root.style.colorScheme = 'dark';
  await waitForRepaint();
  const darkEntries = resolveEntries(probe, names);

  root.style.colorScheme = originalScheme;
  probe.remove();

  const theme = root.getAttribute('theme') || 'default';
  const prefix = scope === 'computed' ? 'colors-computed' : 'colors-all';
  const totalTokens = new Set([...lightEntries.map(([n]) => n), ...darkEntries.map(([n]) => n)]).size;

  const lines = [
    '/* ════════════════════════════════════════════════════════════════',
    `   ${prefix} (resolved to final values)`,
    `   Generated: ${new Date().toISOString()}`,
    `   Theme: ${theme}`,
    `   Tokens: ${totalTokens} per mode`,
    '   ════════════════════════════════════════════════════════════════ */',
    '',
    '/* ── Light Mode ── */',
    '@media (prefers-color-scheme: light) {',
    ':root {',
    ...buildCssBlock(lightEntries, 'light'),
    '}',
    '}',
    '',
    '/* ── Dark Mode ── */',
    '@media (prefers-color-scheme: dark) {',
    ':root {',
    ...buildCssBlock(darkEntries, 'dark'),
    '}',
    '}',
    '',
  ];

  download(lines.join('\n'), `${prefix}-${theme}.css`, 'text/css');
}

// ── Figma Variables Export ──

/**
 * Mapping from CSS token patterns to Figma variable paths.
 * {f} = family placeholder, replaced at runtime.
 */
const TOKEN_TO_FIGMA: [string, string][] = [
  // Ink
  ['ink-{f}', '{f}.ink.color'],
  ['ink-strong-{f}', '{f}.ink.strong'],
  ['ink-inverse-{f}', '{f}.ink.inverse'],
  ['ink-muted-{f}', '{f}.ink.muted'],
  ['ink-placeholder-{f}', '{f}.ink.placeholder'],
  ['ink-hover-{f}', '{f}.ink.hover'],
  ['ink-active-{f}', '{f}.ink.active'],
  ['ink-disabled-{f}', '{f}.ink.disabled'],

  // Surface (primary fill)
  ['surface-{f}', '{f}.surface.color'],
  ['surface-hover-{f}', '{f}.surface.hover'],
  ['surface-active-{f}', '{f}.surface.active'],
  ['surface-disabled-{f}', '{f}.surface.disabled'],

  // Surface ink (text on surface fills)
  ['surface-ink-{f}', '{f}.surface.ink.color'],
  ['surface-ink-hover-{f}', '{f}.surface.ink.hover'],
  ['surface-ink-active-{f}', '{f}.surface.ink.active'],
  ['surface-ink-disabled-{f}', '{f}.surface.ink.disabled'],

  // Grounds
  ['doc-{f}', '{f}.surface.doc.color'],
  ['doc-hover-{f}', '{f}.surface.doc.hover'],
  ['doc-active-{f}', '{f}.surface.doc.active'],
  ['doc-disabled-{f}', '{f}.surface.doc.disabled'],

  ['body-{f}', '{f}.surface.body.color'],
  ['body-hover-{f}', '{f}.surface.body.hover'],
  ['body-active-{f}', '{f}.surface.body.active'],
  ['body-disabled-{f}', '{f}.surface.body.disabled'],

  ['panel-{f}', '{f}.surface.panel.color'],
  ['panel-hover-{f}', '{f}.surface.panel.hover'],
  ['panel-active-{f}', '{f}.surface.panel.active'],
  ['panel-disabled-{f}', '{f}.surface.panel.disabled'],

  ['control-{f}', '{f}.surface.control.color'],
  ['control-hover-{f}', '{f}.surface.control.hover'],
  ['control-active-{f}', '{f}.surface.control.active'],
  ['control-disabled-{f}', '{f}.surface.control.disabled'],

  ['button-{f}', '{f}.surface.button.color'],
  ['button-hover-{f}', '{f}.surface.button.hover'],
  ['button-active-{f}', '{f}.surface.button.active'],
  ['button-disabled-{f}', '{f}.surface.button.disabled'],

  ['card-{f}', '{f}.surface.card.color'],
  ['card-hover-{f}', '{f}.surface.card.hover'],
  ['card-active-{f}', '{f}.surface.card.active'],
  ['card-disabled-{f}', '{f}.surface.card.disabled'],

  ['modal-{f}', '{f}.surface.modal.color'],
  ['modal-hover-{f}', '{f}.surface.modal.hover'],
  ['modal-active-{f}', '{f}.surface.modal.active'],
  ['modal-disabled-{f}', '{f}.surface.modal.disabled'],

  // Border
  ['border-{f}', '{f}.border.color'],
  ['border-muted-{f}', '{f}.border.muted'],
  ['border-hover-{f}', '{f}.border.hover'],
  ['border-active-{f}', '{f}.border.active'],
  ['border-disabled-{f}', '{f}.border.disabled'],
];

/** Skip intermediate/math tokens that aren't actual colors. */
const SKIP_PREFIXES = ['--n-env-', '--n-C-', '--n-L-'];

const ELEVATION = ['lowest', 'lower', 'low', 'base', 'high', 'higher', 'highest'];
const BRIGHTNESS = ['brightest', 'brighter', 'bright', 'dim', 'dimmer', 'dimmest'];

/**
 * Convert a CSS token name to a Figma variable path with nested folders.
 *
 * Source (raw 1–11):  --n-color-{f}-{N}       → color.source.{f}.{N}
 *                     --n-color-{f}-{N}-scrim  → color.source.{f}.scrim.{N}
 * Semantic (050–950): --n-color-{f}-{NNN}      → color.{f}.{NNN}
 *                     --n-color-{f}-{NNN}-scrim → color.{f}.scrim.{NNN}
 * Named scales:       --n-color-{f}-scrim-tint-{s}  → color.{f}.scrim-tint.{s}
 *                     --n-color-{f}-scrim-shade-{s} → color.{f}.scrim-shade.{s}
 *                     --n-color-{f}-{elevation}     → color.{f}.elevation.{elevation}
 *                     --n-color-{f}-{brightness}    → color.{f}.brightness.{brightness}
 * Base aliases:       --n-color-{f}       → color.{f}.color
 *                     --n-color-{f}-scrim → color.{f}.scrim.color
 */
function tokenToFigmaPath(name: string): string | null {
  const bare = name.replace(/^--n-/, '');

  for (const family of FAMILIES) {
    const prefix = `color-${family}`;
    if (!bare.startsWith(prefix)) continue;

    if (bare === prefix) return `color.${family}.color`;

    const suffix = bare.slice(prefix.length + 1);

    if (suffix === 'scrim') return `color.${family}.scrim.color`;

    const tintMatch = suffix.match(/^scrim-tint-(.+)$/);
    if (tintMatch) return `color.${family}.scrim-tint.${tintMatch[1]}`;

    const shadeMatch = suffix.match(/^scrim-shade-(.+)$/);
    if (shadeMatch) return `color.${family}.scrim-shade.${shadeMatch[1]}`;

    // Source raw steps: 1–11
    const sourceMatch = suffix.match(/^(\d{1,2})$/);
    if (sourceMatch && +sourceMatch[1] >= 1 && +sourceMatch[1] <= 11) {
      return `color.source.${family}.${sourceMatch[1]}`;
    }

    // Source raw scrims: 1-scrim through 11-scrim
    const sourceScrimMatch = suffix.match(/^(\d{1,2})-scrim$/);
    if (sourceScrimMatch && +sourceScrimMatch[1] >= 1 && +sourceScrimMatch[1] <= 11) {
      return `color.source.${family}.scrim.${sourceScrimMatch[1]}`;
    }

    // Semantic steps: 050–950
    const semanticMatch = suffix.match(/^(0\d{2}|\d{3})$/);
    if (semanticMatch) return `color.${family}.${semanticMatch[1]}`;

    // Semantic scrims: 050-scrim through 950-scrim
    const semanticScrimMatch = suffix.match(/^(0\d{2}|\d{3})-scrim$/);
    if (semanticScrimMatch) return `color.${family}.scrim.${semanticScrimMatch[1]}`;

    if (ELEVATION.includes(suffix)) return `color.${family}.elevation.${suffix}`;
    if (BRIGHTNESS.includes(suffix)) return `color.${family}.brightness.${suffix}`;

    return `color.${family}.${suffix}`;
  }

  // Non-color tokens: split on hyphens
  return bare.replace(/-/g, '.');
}

/** Set a deeply nested key on an object. */
function setNested(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in cur) || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
    cur = cur[parts[i]] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

/** Resolve tokens into a Figma-structured mode object. */
function resolveFigmaMode(probe: HTMLElement, tokenNames: string[]): Record<string, unknown> {
  const modeData: Record<string, unknown> = {};
  const handled = new Set<string>();

  // Map family-based semantic tokens via TOKEN_TO_FIGMA
  for (const family of FAMILIES) {
    for (const [cssPattern, figmaPattern] of TOKEN_TO_FIGMA) {
      const cssName = `--n-${cssPattern.replace('{f}', family)}`;
      if (!tokenNames.includes(cssName)) continue;
      const color = resolveColor(probe, cssName);
      if (!color) continue;
      handled.add(cssName);
      setNested(modeData, figmaPattern.replace('{f}', family), {
        $scopes: ['ALL_SCOPES'],
        $type: 'color',
        $value: toHex(color),
      });
    }
  }

  // Remaining tokens → smart path mapping
  for (const name of tokenNames) {
    if (handled.has(name)) continue;
    if (SKIP_PREFIXES.some((p) => name.startsWith(p))) continue;
    const color = resolveColor(probe, name);
    if (!color) continue;
    const figmaPath = tokenToFigmaPath(name);
    if (!figmaPath) continue;
    setNested(modeData, figmaPath, {
      $scopes: ['ALL_SCOPES'],
      $type: 'color',
      $value: toHex(color),
    });
  }

  return modeData;
}

/** Export Figma Variables JSON with light + dark modes. */
export async function exportFigma(scope: Scope): Promise<void> {
  const names = filterByScope(collectTokenNames(), scope);

  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;pointer-events:none;';
  document.body.appendChild(probe);

  const root = document.documentElement;
  const originalScheme = root.style.colorScheme;

  root.style.colorScheme = 'light';
  await waitForRepaint();
  const lightData = resolveFigmaMode(probe, names);

  root.style.colorScheme = 'dark';
  await waitForRepaint();
  const darkData = resolveFigmaMode(probe, names);

  root.style.colorScheme = originalScheme;
  probe.remove();

  const output = [{ Colors: { modes: { light: lightData, dark: darkData } } }];
  const theme = root.getAttribute('theme') || 'default';
  download(JSON.stringify(output, null, 2), `figma-variables-${theme}.json`, 'application/json');
}
