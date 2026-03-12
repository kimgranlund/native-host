import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/permissions';
import { db } from '../../../../db/client';
import { contentType, contentObject } from '../../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

/**
 * POST /api/admin/patterns/bulk
 * Body: { patterns: Pattern[] }
 * Upserts patterns by slug — existing patterns are updated, new ones are inserted.
 */
export const POST: APIRoute = async ({ locals, request }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { patterns } = await request.json();
  if (!Array.isArray(patterns) || patterns.length === 0) {
    return new Response(JSON.stringify({ error: 'patterns array required' }), { status: 400 });
  }

  // Get or create content type
  let [pt] = await db.select().from(contentType).where(eq(contentType.slug, 'a2ui-pattern'));
  if (!pt) {
    const now = new Date();
    const id = randomUUID();
    await db.insert(contentType).values({
      id,
      slug: 'a2ui-pattern',
      name: 'A2UI Pattern',
      schema: JSON.stringify({ type: 'object' }),
      versioned: false,
      createdAt: now,
      updatedAt: now,
    });
    [pt] = await db.select().from(contentType).where(eq(contentType.slug, 'a2ui-pattern'));
  }

  const now = new Date();
  let inserted = 0;
  let updated = 0;

  for (const pattern of patterns) {
    const slug = pattern.id;
    if (!slug) continue;

    const data = JSON.stringify(pattern);

    // Check if pattern already exists
    const [existing] = await db.select()
      .from(contentObject)
      .where(and(eq(contentObject.contentTypeId, pt.id), eq(contentObject.slug, slug)));

    if (existing) {
      await db.update(contentObject)
        .set({ data, updatedAt: now })
        .where(eq(contentObject.id, existing.id));
      updated++;
    } else {
      await db.insert(contentObject).values({
        id: randomUUID(),
        contentTypeId: pt.id,
        slug,
        data,
        version: 1,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      });
      inserted++;
    }
  }

  return Response.json({ ok: true, inserted, updated, total: inserted + updated });
};
