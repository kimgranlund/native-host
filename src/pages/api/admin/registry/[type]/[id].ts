import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../../lib/permissions';
import { db } from '../../../../../db/client';
import { contentObject } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ locals, params }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }

  const [entry] = await db.select().from(contentObject).where(eq(contentObject.id, id));
  if (!entry) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  return Response.json({ entry });
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

  if (body.slug) updates.slug = body.slug;
  if (body.data) updates.data = typeof body.data === 'string' ? body.data : JSON.stringify(body.data);
  if (body.status) updates.status = body.status;
  if (body.version !== undefined) updates.version = body.version;

  await db.update(contentObject).set(updates).where(eq(contentObject.id, id));
  return Response.json({ ok: true });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }

  await db.delete(contentObject).where(eq(contentObject.id, id));
  return Response.json({ ok: true });
};
