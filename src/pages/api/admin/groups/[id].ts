import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/permissions';
import { db } from '../../../../db/client';
import { group } from '../../../../db/schema';
import { eq, and } from 'drizzle-orm';

export const PATCH: APIRoute = async ({ params, locals, request }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { name, description, defaultTier } = await request.json();

  await db
    .update(group)
    .set({
      ...(name && { name }),
      ...(description !== undefined && { description: description || null }),
      ...(defaultTier && { defaultTier }),
      updatedAt: new Date(),
    })
    .where(and(eq(group.id, params.id!), eq(group.organizationId, ctx.orgId)));

  return Response.json({ ok: true });
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  await db
    .delete(group)
    .where(and(eq(group.id, params.id!), eq(group.organizationId, ctx.orgId)));

  return Response.json({ ok: true });
};
