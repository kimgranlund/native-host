import type { APIRoute } from 'astro';

const UPSTREAM = 'https://api.anthropic.com/v1/messages';

const STRIP_HEADERS = new Set(['host', 'connection', 'cookie', 'origin', 'referer']);

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: { message: 'Unauthorized' } }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'ANTHROPIC_API_KEY not configured' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Forward all request headers, add API key
  const headers: Record<string, string> = { 'x-api-key': apiKey };
  request.headers.forEach((value, key) => {
    if (!STRIP_HEADERS.has(key.toLowerCase())) headers[key] = value;
  });

  const upstream = await fetch(UPSTREAM, {
    method: 'POST',
    headers,
    body: request.body,
    // @ts-expect-error — Node fetch supports duplex for streaming request bodies
    duplex: 'half',
  });

  // Pipe response through (SSE or JSON)
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
};
