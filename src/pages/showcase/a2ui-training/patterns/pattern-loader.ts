/**
 * Pattern Loader — Runtime access to the pattern catalog and individual patterns.
 *
 * Loads patterns from the DB via /api/patterns (real-time edits from the admin CMS).
 * Falls back to static JSON files if the API is unavailable.
 */

import type { PatternCatalog, CatalogEntry, Pattern, PatternCategory } from './pattern-types.ts';
import catalogData from './pattern-catalog.json';

/** Static fallback catalog. */
const staticCatalog = catalogData as unknown as PatternCatalog;

/** Eagerly import all static pattern JSON files via Vite glob (fallback). */
const patternModules = import.meta.glob(
  ['./**/*.json', '!./pattern-catalog.json'],
  { import: 'default', eager: true },
) as Record<string, Pattern>;

/** Cached patterns loaded from the API. */
let dbPatterns: Pattern[] | null = null;
let dbCatalog: PatternCatalog | null = null;
let fetchPromise: Promise<void> | null = null;

/** Fetch patterns from the DB API once. */
async function fetchFromDB(): Promise<void> {
  if (dbPatterns !== null) return;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch('/api/patterns');
      if (!res.ok) return;
      const patterns = await res.json() as Pattern[];
      if (!Array.isArray(patterns) || patterns.length === 0) return;

      dbPatterns = patterns;

      // Build catalog from DB patterns
      const categories: Record<string, string[]> = {};
      const catalogEntries: CatalogEntry[] = [];

      for (const p of patterns) {
        const cat = p.category || 'primitive';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(p.id);

        catalogEntries.push({
          id: p.id,
          label: p.label,
          tier: p.tier,
          concepts: p.concepts || [],
          description: p.description || '',
          category: cat,
          componentCount: (p.components || []).length,
          composedOf: p.composedOf,
        });
      }

      dbCatalog = {
        version: staticCatalog.version,
        count: patterns.length,
        categories,
        patterns: catalogEntries,
      };
    } catch {
      // API unavailable — fall back to static files
    }
  })();

  return fetchPromise;
}

/** Returns the full pattern catalog (prefers DB, falls back to static). */
export function loadCatalog(): PatternCatalog {
  return dbCatalog ?? staticCatalog;
}

/** Ensure DB patterns are loaded. Call at page boot. */
export async function initPatterns(): Promise<void> {
  await fetchFromDB();
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
  const catalog = loadCatalog();
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
 * Load a full pattern by ID. Prefers DB patterns, falls back to static files.
 */
export async function loadPattern(id: string): Promise<Pattern | null> {
  // Try DB first
  if (dbPatterns) {
    const found = dbPatterns.find(p => p.id === id);
    if (found) return found;
  }

  // Fallback to static
  const catalog = loadCatalog();
  const entry = catalog.patterns.find(p => p.id === id);
  if (!entry) return null;

  const folder = entry.tier === 'micro' ? 'micro' : 'blocks';
  const key = `./${folder}/${id}.json`;
  const data = patternModules[key];
  if (!data) return null;
  return data as Pattern;
}
