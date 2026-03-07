import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/permissions';
import { db } from '../../../../db/client';
import { contentType, contentObject } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

export const GET: APIRoute = async ({ locals, params }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const typeSlug = params.type;
  if (!typeSlug) {
    return new Response(JSON.stringify({ error: 'Missing type' }), { status: 400 });
  }

  const [ct] = await db.select().from(contentType).where(eq(contentType.slug, typeSlug));
  if (!ct) return Response.json({ entries: [] });

  const entries = await db.select().from(contentObject).where(eq(contentObject.contentTypeId, ct.id));
  return Response.json({ entries });
};

export const POST: APIRoute = async ({ locals, request, params }) => {
  const ctx = await requireAdmin(locals);
  if (ctx instanceof Response) return ctx;

  const typeSlug = params.type;
  if (!typeSlug) {
    return new Response(JSON.stringify({ error: 'Missing type' }), { status: 400 });
  }

  // Get or create content type
  let [ct] = await db.select().from(contentType).where(eq(contentType.slug, typeSlug));
  if (!ct) {
    const now = new Date();
    const ctId = randomUUID();
    const defaultSchema = JSON.stringify({ type: 'object' });
    const nameMap: Record<string, string> = {
      'llm-description': 'LLM Description',
      'connector': 'Connector',
    };
    const name = nameMap[typeSlug] || typeSlug;
    await db.insert(contentType).values({
      id: ctId,
      slug: typeSlug,
      name,
      schema: defaultSchema,
      versioned: true,
      createdAt: now,
      updatedAt: now,
    });
    [ct] = await db.select().from(contentType).where(eq(contentType.slug, typeSlug));
  }

  const { slug, data, status } = await request.json();
  if (!slug || !data) {
    return new Response(JSON.stringify({ error: 'slug and data required' }), { status: 400 });
  }

  const now = new Date();
  await db.insert(contentObject).values({
    id: randomUUID(),
    contentTypeId: ct.id,
    slug,
    data: typeof data === 'string' ? data : JSON.stringify(data),
    version: 1,
    status: status || 'active',
    createdAt: now,
    updatedAt: now,
  });

  return Response.json({ ok: true });
};
