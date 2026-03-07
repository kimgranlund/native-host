import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../lib/permissions';
import { db } from '../../../db/client';
import { member, user } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '../../../lib/auth';

export const GET: APIRoute = async ({ locals }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const members = await db
    .select({
      id: member.id,
      role: member.role,
      createdAt: member.createdAt,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
    })
    .from(member)
    .innerJoin(user, eq(member.userId, user.id))
    .where(eq(member.organizationId, ctx.orgId));

  return Response.json({ members });
};

export const POST: APIRoute = async ({ locals, request }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const { email, role } = await request.json();
  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
  }

  // Use better-auth org API to create invitation
  try {
    const result = await auth.api.createInvitation({
      headers: request.headers,
      body: {
        email,
        role: role || 'member',
        organizationId: ctx.orgId,
      },
    });
    return Response.json({ ok: true, invitation: result });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to invite' }), { status: 500 });
  }
};
