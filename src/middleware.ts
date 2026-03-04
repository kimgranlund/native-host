import { defineMiddleware } from 'astro:middleware';
import { auth } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (isAuthed) {
    context.locals.user = isAuthed.user;
    context.locals.session = isAuthed.session;
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }

  const response = await next();

  if (context.locals.user) {
    response.headers.set('Cache-Control', 'private, no-cache');
  } else {
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    response.headers.set('Vary', 'Cookie');
  }

  return response;
});
