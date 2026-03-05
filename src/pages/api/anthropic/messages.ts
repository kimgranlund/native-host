import type { APIRoute } from 'astro';

const UPSTREAM = 'https://api.anthropic.com/v1/messages';
const STRIP_HEADERS = new Set(['host', 'connection', 'cookie', 'origin', 'referer']);

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: { message: 'Unauthorized', provider: 'anthropic', status: 401 } }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'CLAUDE_API_KEY not configured', provider: 'anthropic', status: 500 } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const requestId = crypto.randomUUID();
  const start = Date.now();

  const headers: Record<string, string> = {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  };
  request.headers.forEach((value, key) => {
    if (!STRIP_HEADERS.has(key.toLowerCase()) && key.toLowerCase() !== 'x-api-key') {
      headers[key] = value;
    }
  });

  const upstream = await fetch(UPSTREAM, {
    method: 'POST',
    headers,
    body: request.body,
    // @ts-expect-error — Node fetch supports duplex for streaming request bodies
    duplex: 'half',
  });

  const duration = Date.now() - start;
  console.log(JSON.stringify({
    route: '/api/anthropic/messages',
    provider: 'anthropic',
    request_id: requestId,
    user_id: locals.user.id,
    status_code: upstream.status,
    duration_ms: duration,
    upstream_request_id: upstream.headers.get('request-id') ?? undefined,
  }));

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      'Cache-Control': 'no-cache',
      'x-request-id': requestId,
    },
  });
};
