import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/permissions';
import { db } from '../../../../db/client';
import { invitation } from '../../../../db/schema';
import { eq, and } from 'drizzle-orm';

export const DELETE: APIRoute = async ({ params, locals }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  await db
    .delete(invitation)
    .where(and(eq(invitation.id, params.id!), eq(invitation.organizationId, ctx.orgId)));

  return Response.json({ ok: true });
};
