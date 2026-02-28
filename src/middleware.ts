import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();

  // Cache at CDN edge for 1 hour, serve stale for 1 day while revalidating.
  // Vary on Cookie so each preference combination gets its own cache entry.
  response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  response.headers.set('Vary', 'Cookie');

  return response;
});
