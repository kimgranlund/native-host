import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/permissions';
import { db } from '../../../../db/client';
import { grant } from '../../../../db/schema';
import { eq, and } from 'drizzle-orm';

export const DELETE: APIRoute = async ({ locals, params }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }

  await db
    .delete(grant)
    .where(and(eq(grant.id, id), eq(grant.organizationId, ctx.orgId)));

  return Response.json({ ok: true });
};
