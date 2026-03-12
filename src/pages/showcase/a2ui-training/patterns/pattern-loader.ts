/**
 * Pattern Loader — Runtime access to the pattern catalog and individual patterns.
 * Adapted from native-ai/src/a2ui/patterns/pattern-loader.ts for Astro host.
 */

import type { PatternCatalog, CatalogEntry, Pattern, PatternCategory } from './pattern-types.ts';
import catalogData from './pattern-catalog.json';

/** Cached catalog singleton. */
const catalog = catalogData as unknown as PatternCatalog;

/** Eagerly import all pattern JSON files via Vite glob. */
const patternModules = import.meta.glob(
  ['./**/*.json', '!./pattern-catalog.json'],
  { import: 'default', eager: true },
) as Record<string, Pattern>;

/** Returns the full pattern catalog (System of Record). */
export function loadCatalog(): PatternCatalog {
  return catalog;
}

/**
 * Match patterns by concept keywords.
 */
export function matchPatterns(
  keywords: string[],
  options?: {
    tier?: 'block' | 'micro';
    category?: PatternCategory;
    limit?: number;
  },
): CatalogEntry[] {
  const lowerKeywords = keywords.map(k => k.toLowerCase());
  const limit = options?.limit ?? 5;

  const scored = catalog.patterns
    .filter(entry => {
      if (options?.tier && entry.tier !== options.tier) return false;
      if (options?.category && entry.category !== options.category) return false;
      return true;
    })
    .map(entry => {
      let score = 0;
      const concepts = entry.concepts.map(c => c.toLowerCase());
      const desc = entry.description.toLowerCase();
      const label = entry.label.toLowerCase();

      for (const kw of lowerKeywords) {
        if (concepts.includes(kw)) score += 3;
        else if (concepts.some(c => c.includes(kw) || kw.includes(c))) score += 2;
        if (desc.includes(kw)) score += 1;
        if (label.includes(kw)) score += 1;
      }
      return { entry, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(s => s.entry);
}

/**
 * Load a full pattern by ID.
 */
export async function loadPattern(id: string): Promise<Pattern | null> {
  const entry = catalog.patterns.find(p => p.id === id);
  if (!entry) return null;

  const folder = entry.tier === 'micro' ? 'micro' : 'blocks';
  const key = `./${folder}/${id}.json`;
  const data = patternModules[key];
  if (!data) return null;
  return data as Pattern;
}
