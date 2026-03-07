import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../lib/permissions';
import { db } from '../../../db/client';
import { grant } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

export const GET: APIRoute = async ({ locals }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const rows = await db.select().from(grant).where(eq(grant.organizationId, ctx.orgId));
  return Response.json({ grants: rows });
};

export const POST: APIRoute = async ({ locals, request }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { subjectType, subjectId, permissionId, effect, resourceId } = await request.json();
  if (!subjectType || !subjectId || !permissionId) {
    return new Response(JSON.stringify({ error: 'subjectType, subjectId, permissionId required' }), { status: 400 });
  }

  await db.insert(grant).values({
    id: randomUUID(),
    organizationId: ctx.orgId,
    subjectType,
    subjectId,
    permissionId,
    effect: effect || 'allow',
    resourceId: resourceId || null,
    createdAt: new Date(),
  });

  return Response.json({ ok: true });
};
