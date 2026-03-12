import type { APIRoute } from 'astro';
import { db } from '../../db/client';
import { contentType, contentObject } from '../../db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/patterns — Public endpoint returning all active A2UI patterns.
 * Used by the training library and builder for real-time pattern data.
 */
export const GET: APIRoute = async () => {
  const [pt] = await db.select().from(contentType).where(eq(contentType.slug, 'a2ui-pattern'));
  if (!pt) return Response.json([]);

  const entries = await db.select()
    .from(contentObject)
    .where(eq(contentObject.contentTypeId, pt.id));

  const patterns = entries
    .filter(e => e.status === 'active')
    .map(e => {
      try { return JSON.parse(e.data); } catch { return null; }
    })
    .filter(Boolean);

  return Response.json(patterns);
};
