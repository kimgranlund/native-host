import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../lib/permissions';
import { db } from '../../../db/client';
import { group } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

export const GET: APIRoute = async ({ locals }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const rows = await db.select().from(group).where(eq(group.organizationId, ctx.orgId));
  return Response.json({ groups: rows });
};

export const POST: APIRoute = async ({ locals, request }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { name, description, defaultTier } = await request.json();
  if (!name) {
    return new Response(JSON.stringify({ error: 'Name required' }), { status: 400 });
  }

  const now = new Date();
  await db.insert(group).values({
    id: randomUUID(),
    organizationId: ctx.orgId,
    name,
    description: description || null,
    defaultTier: defaultTier || 'user',
    createdAt: now,
    updatedAt: now,
  });

  return Response.json({ ok: true });
};
