import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../../lib/permissions';
import { db } from '../../../../../db/client';
import { groupMembership, user } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

export const GET: APIRoute = async ({ params, locals }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const members = await db
    .select({
      id: groupMembership.id,
      tierOverride: groupMembership.tierOverride,
      userName: user.name,
      userEmail: user.email,
    })
    .from(groupMembership)
    .innerJoin(user, eq(groupMembership.userId, user.id))
    .where(eq(groupMembership.groupId, params.id!));

  return Response.json({ members });
};

export const POST: APIRoute = async ({ params, locals, request }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { userId, tierOverride } = await request.json();
  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId required' }), { status: 400 });
  }

  await db.insert(groupMembership).values({
    id: randomUUID(),
    groupId: params.id!,
    userId,
    tierOverride: tierOverride || null,
    createdAt: new Date(),
  });

  return Response.json({ ok: true });
};

export const DELETE: APIRoute = async ({ params, locals, request }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { membershipId } = await request.json();
  if (!membershipId) {
    return new Response(JSON.stringify({ error: 'membershipId required' }), { status: 400 });
  }

  await db.delete(groupMembership).where(eq(groupMembership.id, membershipId));

  return Response.json({ ok: true });
};
