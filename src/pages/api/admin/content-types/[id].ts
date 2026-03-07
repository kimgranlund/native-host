import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/permissions';
import { db } from '../../../../db/client';
import { contentType, contentVisibility } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ locals, params }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }

  const [ct] = await db.select().from(contentType).where(eq(contentType.id, id));
  if (!ct) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  // Get visibility rules
  const visibility = await db
    .select()
    .from(contentVisibility)
    .where(eq(contentVisibility.contentTypeId, id));

  return Response.json({ contentType: ct, visibility });
};

export const PATCH: APIRoute = async ({ locals, request, params }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (body.name) updates.name = body.name;
  if (body.slug) updates.slug = body.slug;
  if (body.versioned !== undefined) updates.versioned = body.versioned;

  if (body.schema !== undefined) {
    const schemaStr = typeof body.schema === 'string' ? body.schema : JSON.stringify(body.schema);
    try {
      JSON.parse(schemaStr);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON schema' }), { status: 400 });
    }
    updates.schema = schemaStr;
  }

  await db.update(contentType).set(updates).where(eq(contentType.id, id));
  return Response.json({ ok: true });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }

  // Cascade deletes content objects and visibility rules via FK
  await db.delete(contentType).where(eq(contentType.id, id));
  return Response.json({ ok: true });
};
