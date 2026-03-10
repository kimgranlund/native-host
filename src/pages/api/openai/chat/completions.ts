import type { APIRoute } from 'astro';

const UPSTREAM = 'https://api.openai.com/v1/chat/completions';
const STRIP_HEADERS = new Set(['host', 'connection', 'cookie', 'origin', 'referer']);

export const POST: APIRoute = async ({ request, locals }) => {
  const apiKey = import.meta.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'OPENAI_API_KEY not configured', provider: 'openai', status: 500 } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const requestId = crypto.randomUUID();
  const start = Date.now();

  const headers: Record<string, string> = {
    'authorization': `Bearer ${apiKey}`,
  };
  const org = import.meta.env.OPENAI_ORGANIZATION;
  if (org) headers['openai-organization'] = org;

  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!STRIP_HEADERS.has(lower) && lower !== 'authorization') {
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
    route: '/api/openai/chat/completions',
    provider: 'openai',
    request_id: requestId,
    user_id: locals.user?.id ?? 'anonymous',
    status_code: upstream.status,
    duration_ms: duration,
    upstream_request_id: upstream.headers.get('x-request-id') ?? undefined,
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
