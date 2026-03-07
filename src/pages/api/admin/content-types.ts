import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../lib/permissions';
import { db } from '../../../db/client';
import { contentType, contentObject, contentVisibility } from '../../../db/schema';
import { eq, count } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

export const GET: APIRoute = async ({ locals }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const types = await db.select().from(contentType);

  // Get object counts per type
  const counts = await db
    .select({ contentTypeId: contentObject.contentTypeId, count: count() })
    .from(contentObject)
    .groupBy(contentObject.contentTypeId);

  const countMap = new Map(counts.map(c => [c.contentTypeId, c.count]));

  const result = types.map(t => ({
    ...t,
    objectCount: countMap.get(t.id) || 0,
  }));

  return Response.json({ types: result });
};

export const POST: APIRoute = async ({ locals, request }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { slug, name, schema, versioned } = await request.json();
  if (!slug || !name) {
    return new Response(JSON.stringify({ error: 'slug and name required' }), { status: 400 });
  }

  // Check uniqueness
  const [existing] = await db.select().from(contentType).where(eq(contentType.slug, slug));
  if (existing) {
    return new Response(JSON.stringify({ error: 'A content type with this slug already exists' }), { status: 409 });
  }

  // Validate schema is valid JSON
  const schemaStr = typeof schema === 'string' ? schema : JSON.stringify(schema || { type: 'object' });
  try {
    JSON.parse(schemaStr);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON schema' }), { status: 400 });
  }

  const now = new Date();
  const id = randomUUID();
  await db.insert(contentType).values({
    id,
    slug,
    name,
    schema: schemaStr,
    versioned: versioned ?? true,
    createdAt: now,
    updatedAt: now,
  });

  return Response.json({ ok: true, id });
};
