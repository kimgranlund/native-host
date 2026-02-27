// Snippet loading utilities for dynamic routes.
// Uses import.meta.glob to load raw HTML files from docs/snippets/.

// Glob all snippet HTML files at build time
const allSnippets = import.meta.glob<string>('/docs/snippets/**/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export interface SnippetData {
  title: string;
  content: string;
  styles: string;
  scripts: string;
}

/**
 * Extract the meaningful content from a full HTML snippet page.
 * Pulls out <main> content, inline <style> blocks (excluding link tags),
 * and inline <script> blocks (excluding the register import).
 */
export function parseSnippet(raw: string): SnippetData {
  // Extract title
  const titleMatch = raw.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch?.[1]?.split('—')[0]?.trim() ?? '';

  // Extract <main>...</main> content
  const mainMatch = raw.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  const content = mainMatch?.[1] ?? '';

  // Extract inline <style> blocks (page-specific styles, not the link tags)
  const styleBlocks: string[] = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
  let styleMatch;
  while ((styleMatch = styleRegex.exec(raw)) !== null) {
    styleBlocks.push(styleMatch[1]);
  }
  const styles = styleBlocks.join('\n');

  // Extract inline <script type="module"> blocks, filtering out the register import
  const scriptBlocks: string[] = [];
  const scriptRegex = /<script[^>]*type="module"[^>]*>([\s\S]*?)<\/script>/g;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(raw)) !== null) {
    // Skip pure register-only scripts
    const body = scriptMatch[1].trim();
    const stripped = body
      .replace(/import\s+['"]@nonoun\/native-ui\/register['"];?\s*/g, '')
      .replace(/import\s+\{[^}]*\}\s+from\s+['"]@nonoun\/native-ui[^'"]*['"];?\s*/g, '')
      .trim();
    if (stripped) scriptBlocks.push(stripped);
  }
  // Wrap in an async IIFE that waits for the BaseLayout module to expose globals.
  // Without this, inline module scripts can execute before the external BaseLayout
  // module that populates window with native-ui exports.
  const scripts = scriptBlocks.length > 0
    ? `(async () => { await (window.__nativeUIReady || Promise.resolve());\n${scriptBlocks.join('\n')}\n})();`
    : '';

  return { title, content, styles, scripts };
}

/**
 * Get a snippet by its relative path (e.g., "components/ui-button.html").
 */
export function getSnippet(relativePath: string): SnippetData | null {
  const key = `/docs/snippets/${relativePath}`;
  const raw = allSnippets[key];
  if (!raw) return null;
  return parseSnippet(raw);
}

/**
 * List all snippet files matching a directory prefix.
 * Returns an array of { slug, path } for use in getStaticPaths.
 */
export function listSnippets(dir: string): { slug: string; path: string }[] {
  const prefix = `/docs/snippets/${dir}/`;
  return Object.keys(allSnippets)
    .filter(key => key.startsWith(prefix) && key.endsWith('.html'))
    .map(key => ({
      slug: key.slice(prefix.length, -5), // remove prefix and .html
      path: key,
    }));
}
