import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../lib/permissions';
import { db } from '../../../db/client';
import { tierPermission } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

export const GET: APIRoute = async ({ locals }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const rows = await db.select().from(tierPermission);
  return Response.json({ tierPermissions: rows });
};

export const PUT: APIRoute = async ({ locals, request }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  // Only owners can modify tier permissions
  if (ctx.tier !== 'owner') {
    return new Response(JSON.stringify({ error: 'Only owners can modify tier permissions' }), { status: 403 });
  }

  const { tier, permissionId, enabled } = await request.json();
  if (!tier || !permissionId) {
    return new Response(JSON.stringify({ error: 'tier and permissionId required' }), { status: 400 });
  }

  // Can't modify owner tier (always has all)
  if (tier === 'owner') {
    return new Response(JSON.stringify({ error: 'Cannot modify owner permissions' }), { status: 400 });
  }

  if (enabled) {
    // Insert if not exists
    const existing = await db
      .select()
      .from(tierPermission)
      .where(and(eq(tierPermission.tier, tier), eq(tierPermission.permissionId, permissionId)));
    if (existing.length === 0) {
      await db.insert(tierPermission).values({
        id: randomUUID(),
        tier,
        permissionId,
      });
    }
  } else {
    // Delete
    await db
      .delete(tierPermission)
      .where(and(eq(tierPermission.tier, tier), eq(tierPermission.permissionId, permissionId)));
  }

  return Response.json({ ok: true });
};
