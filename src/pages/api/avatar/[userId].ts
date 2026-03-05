import type { APIRoute } from 'astro';
import { db } from '../../../db/client';
import { user } from '../../../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Proxy avatar images through our server to avoid Google CDN rate limits (429).
 * Caches upstream response for 7 days. Falls back to 404 if no image URL stored.
 */
export const GET: APIRoute = async ({ params }) => {
  const { userId } = params;
  if (!userId) return new Response(null, { status: 400 });

  const rows = await db.select({ image: user.image }).from(user).where(eq(user.id, userId));
  const imageUrl = rows[0]?.image;
  if (!imageUrl) return new Response(null, { status: 404 });

  try {
    const upstream = await fetch(imageUrl);
    if (!upstream.ok) return new Response(null, { status: upstream.status });

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const body = await upstream.arrayBuffer();

    return new Response(body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
};
