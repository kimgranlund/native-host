// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { resolve } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const LOCAL_UI = process.env.LOCAL_UI === '1';
const uiRoot = fileURLToPath(new URL('../native-ui', import.meta.url));

/**
 * Read each local @nonoun package's exports map and generate Vite
 * resolve aliases so `@nonoun/native-ui/register`, `@nonoun/native-ui/css`,
 * etc. all resolve to the local dist files.
 */
function resolveLocalPackages() {
  if (!LOCAL_UI) return {};

  const pkgDirs = [
    uiRoot,
    ...['native-a2ui', 'native-app', 'native-chat', 'native-tokens',
        'native-codemirror', 'native-editor', 'native-playground',
    ].map(name => resolve(uiRoot, 'packages', name)),
  ];

  /** @type {Record<string, string>} */
  const aliases = {};

  for (const dir of pkgDirs) {
    const pkgPath = resolve(dir, 'package.json');
    if (!existsSync(pkgPath)) continue;

    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const exports = pkg.exports || {};

    for (const [subpath, target] of Object.entries(exports)) {
      const importPath = subpath === '.'
        ? pkg.name
        : `${pkg.name}/${subpath.slice(2)}`;

      const file = typeof target === 'string'
        ? target
        : target.import || target.default;

      if (file) {
        aliases[importPath] = resolve(dir, file);
      }
    }
  }

  // Sort longest-first so sub-path aliases (e.g. native-ui/css)
  // match before base package aliases (e.g. native-ui)
  const sorted = Object.entries(aliases)
    .sort(([a], [b]) => b.length - a.length)
    .map(([find, replacement]) => ({ find, replacement }));

  console.log(`[LOCAL_UI] Resolving @nonoun packages from ${uiRoot}`);
  for (const { find } of sorted) {
    console.log(`  ${find}`);
  }

  return sorted;
}

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: {
    optimizeDeps: {
      include: ['better-auth/client'],
    },
    css: {
      // Allow @import of npm packages in <style> blocks
      preprocessorOptions: {},
    },
    resolve: {
      alias: resolveLocalPackages(),
    },
    server: LOCAL_UI ? {
      fs: {
        // Allow Vite to serve files from the native-ui sibling directory
        allow: ['.', uiRoot],
      },
    } : {},
  },
});
