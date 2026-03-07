import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/permissions';
import { db } from '../../../../db/client';
import { member } from '../../../../db/schema';
import { eq, and } from 'drizzle-orm';

export const PATCH: APIRoute = async ({ params, locals, request }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { role } = await request.json();
  if (!role || !['owner', 'admin', 'member'].includes(role)) {
    return new Response(JSON.stringify({ error: 'Invalid role' }), { status: 400 });
  }

  // Prevent demoting self
  const [target] = await db
    .select({ userId: member.userId })
    .from(member)
    .where(and(eq(member.id, params.id!), eq(member.organizationId, ctx.orgId)));

  if (!target) {
    return new Response(JSON.stringify({ error: 'Member not found' }), { status: 404 });
  }
  if (target.userId === ctx.user.id) {
    return new Response(JSON.stringify({ error: 'Cannot change your own role' }), { status: 400 });
  }

  await db
    .update(member)
    .set({ role })
    .where(and(eq(member.id, params.id!), eq(member.organizationId, ctx.orgId)));

  return Response.json({ ok: true });
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const [target] = await db
    .select({ userId: member.userId })
    .from(member)
    .where(and(eq(member.id, params.id!), eq(member.organizationId, ctx.orgId)));

  if (!target) {
    return new Response(JSON.stringify({ error: 'Member not found' }), { status: 404 });
  }
  if (target.userId === ctx.user.id) {
    return new Response(JSON.stringify({ error: 'Cannot remove yourself' }), { status: 400 });
  }

  await db
    .delete(member)
    .where(and(eq(member.id, params.id!), eq(member.organizationId, ctx.orgId)));

  return Response.json({ ok: true });
};
