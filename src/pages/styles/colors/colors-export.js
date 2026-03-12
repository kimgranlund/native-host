/**
 * Color token export utilities.
 * Resolves --n-* custom properties from the live DOM and exports as CSS or Figma Variables JSON.
 * Adapted from native-ui/src/styles/colors.export.ts for Astro host.
 */

const FAMILIES = ['neutral', 'accent', 'info', 'success', 'warning', 'danger'];

/** Wait for styles to recompute after a color-scheme change. */
function waitForRepaint() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

/** Resolve a custom property to its computed color. */
function resolveColor(probe, name) {
  probe.style.backgroundColor = '';
  probe.style.backgroundColor = `var(${name})`;
  const val = getComputedStyle(probe).backgroundColor;
  if (!val || val === 'rgba(0, 0, 0, 0)' || val === 'transparent') return null;
  return val;
}

/** Convert computed color to oklch via CSS. */
function toOklch(probe, color) {
  probe.style.color = color;
  return getComputedStyle(probe).color;
}

/** Convert a computed color string to hex via canvas. */
function toHex(color) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d');
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
function collectTokenNames() {
  const names = [];
  const re = /(--n-[a-zA-Z0-9_-]+)\s*:/g;
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        const text = rule.cssText || '';
        let m;
        re.lastIndex = 0;
        while ((m = re.exec(text)) !== null) {
          if (!names.includes(m[1])) names.push(m[1]);
        }
      }
    } catch (e) {
      // Cross-origin sheets can't be read — skip
    }
  }
  return names;
}

/** Group token names by prefix. */
function groupTokens(names) {
  const groups = new Map();
  for (const name of names) {
    const prefix = name.replace(/^--n-/, '').split('-')[0];
    if (!groups.has(prefix)) groups.set(prefix, []);
    groups.get(prefix).push(name);
  }
  return groups;
}

/** Build CSS :root block from resolved entries. */
function buildCssBlock(entries, scheme) {
  const groups = groupTokens(entries.map(([n]) => n));
  const valueMap = new Map(entries);
  const lines = [`  /* ── ${scheme} ── */`];
  let first = true;
  for (const [prefix, names] of groups) {
    if (!first) lines.push('');
    first = false;
    lines.push(`  /* ── ${prefix} ── */`);
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

/** Resolve entries for a given scheme. */
function resolveEntries(probe, names) {
  const entries = [];
  for (const name of names) {
    const color = resolveColor(probe, name);
    if (!color) continue;
    const oklch = toOklch(probe, color);
    entries.push([name, oklch]);
  }
  return entries;
}

/** Download a text file. */
function download(content, filename, type) {
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

/**
 * Export all --n-* tokens as resolved CSS with light/dark modes.
 * @param {'all' | 'computed' | 'semantic'} scope
 */
export async function exportCss(scope) {
  const allNames = collectTokenNames();
  let names = allNames;
  if (scope === 'computed') names = allNames.filter((n) => n.startsWith('--n-color-'));
  if (scope === 'semantic') names = allNames.filter((n) => !n.startsWith('--n-color-') && !n.startsWith('--n-env-'));

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

  const totalTokens = new Set([...lightEntries.map(([n]) => n), ...darkEntries.map(([n]) => n)]).size;
  const lines = [
    `/* colors-${scope} (resolved to final values)`,
    `   Generated: ${new Date().toISOString()}`,
    `   Tokens: ${totalTokens} per mode */`,
    '',
    '@media (prefers-color-scheme: light) {',
    ':root {',
    ...buildCssBlock(lightEntries, 'light'),
    '}',
    '}',
    '',
    '@media (prefers-color-scheme: dark) {',
    ':root {',
    ...buildCssBlock(darkEntries, 'dark'),
    '}',
    '}',
    '',
  ];

  download(lines.join('\n'), `colors-${scope}.css`, 'text/css');
}

/** Figma token mapping: CSS pattern → Figma path */
const TOKEN_TO_FIGMA = [
  ['ink-{f}', '{f}.ink.color'], ['ink-strong-{f}', '{f}.ink.strong'], ['ink-inverse-{f}', '{f}.ink.inverse'],
  ['ink-muted-{f}', '{f}.ink.muted'], ['ink-placeholder-{f}', '{f}.ink.placeholder'],
  ['ink-hover-{f}', '{f}.ink.hover'], ['ink-active-{f}', '{f}.ink.active'], ['ink-disabled-{f}', '{f}.ink.disabled'],
  ['surface-{f}', '{f}.surface.color'], ['surface-hover-{f}', '{f}.surface.hover'],
  ['surface-active-{f}', '{f}.surface.active'], ['surface-disabled-{f}', '{f}.surface.disabled'],
  ['surface-ink-{f}', '{f}.surface.ink.color'], ['surface-ink-hover-{f}', '{f}.surface.ink.hover'],
  ['surface-ink-active-{f}', '{f}.surface.ink.active'], ['surface-ink-disabled-{f}', '{f}.surface.ink.disabled'],
  ['doc-{f}', '{f}.surface.doc.color'], ['body-{f}', '{f}.surface.body.color'],
  ['panel-{f}', '{f}.surface.panel.color'], ['control-{f}', '{f}.surface.control.color'],
  ['button-{f}', '{f}.surface.button.color'], ['card-{f}', '{f}.surface.card.color'],
  ['modal-{f}', '{f}.surface.modal.color'],
  ['border-{f}', '{f}.border.color'], ['border-muted-{f}', '{f}.border.muted'],
];

/** Set a deeply nested key on an object. */
function setNested(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in cur) || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

/** Resolve tokens into a Figma-structured mode object. */
function resolveFigmaMode(probe, tokenNames) {
  const modeData = {};
  const handled = new Set();

  for (const family of FAMILIES) {
    for (const [cssPattern, figmaPattern] of TOKEN_TO_FIGMA) {
      const cssName = `--n-${cssPattern.replace('{f}', family)}`;
      if (!tokenNames.includes(cssName)) continue;
      const color = resolveColor(probe, cssName);
      if (!color) continue;
      handled.add(cssName);
      setNested(modeData, figmaPattern.replace('{f}', family), {
        $scopes: ['ALL_SCOPES'], $type: 'color', $value: toHex(color),
      });
    }
  }

  // Remaining color tokens
  for (const name of tokenNames) {
    if (handled.has(name)) continue;
    if (name.startsWith('--n-env-') || name.startsWith('--n-C-') || name.startsWith('--n-L-')) continue;
    const color = resolveColor(probe, name);
    if (!color) continue;
    const bare = name.replace(/^--n-/, '').replace(/-/g, '.');
    setNested(modeData, bare, { $scopes: ['ALL_SCOPES'], $type: 'color', $value: toHex(color) });
  }

  return modeData;
}

/** Export Figma Variables JSON with light + dark modes. */
export async function exportFigma() {
  const allNames = collectTokenNames();

  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;pointer-events:none;';
  document.body.appendChild(probe);

  const root = document.documentElement;
  const originalScheme = root.style.colorScheme;

  root.style.colorScheme = 'light';
  await waitForRepaint();
  const lightData = resolveFigmaMode(probe, allNames);

  root.style.colorScheme = 'dark';
  await waitForRepaint();
  const darkData = resolveFigmaMode(probe, allNames);

  root.style.colorScheme = originalScheme;
  probe.remove();

  const output = [{ Colors: { modes: { light: lightData, dark: darkData } } }];
  download(JSON.stringify(output, null, 2), 'figma-variables.json', 'application/json');
}
