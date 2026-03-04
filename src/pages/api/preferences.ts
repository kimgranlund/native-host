import type { APIRoute } from 'astro';
import { db } from '../../db/client';
import { userPreferences } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const rows = await db.select().from(userPreferences).where(eq(userPreferences.userId, locals.user.id));
  const prefs = rows[0];

  if (!prefs) {
    return Response.json({
      colorScheme: '',
      sidebarCollapsed: false,
      groupStates: {},
      showCode: false,
    });
  }

  return Response.json({
    colorScheme: prefs.colorScheme ?? '',
    sidebarCollapsed: prefs.sidebarCollapsed ?? false,
    groupStates: JSON.parse(prefs.groupStates ?? '{}'),
    showCode: prefs.showCode ?? false,
  });
};

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  const userId = locals.user.id;

  const existing = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));

  const data = {
    colorScheme: body.colorScheme ?? existing[0]?.colorScheme ?? '',
    sidebarCollapsed: body.sidebarCollapsed ?? existing[0]?.sidebarCollapsed ?? false,
    groupStates: body.groupStates !== undefined
      ? JSON.stringify(body.groupStates)
      : existing[0]?.groupStates ?? '{}',
    showCode: body.showCode ?? existing[0]?.showCode ?? false,
    updatedAt: new Date(),
  };

  if (existing.length > 0) {
    await db.update(userPreferences).set(data).where(eq(userPreferences.userId, userId));
  } else {
    await db.insert(userPreferences).values({ userId, ...data });
  }

  return Response.json({ ok: true });
};
