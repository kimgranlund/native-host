import type { APIRoute } from 'astro';

const UPSTREAM = 'https://api.openai.com/v1/models';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: { message: 'Unauthorized', provider: 'openai', status: 401 } }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'OPENAI_API_KEY not configured', provider: 'openai', status: 500 } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const headers: Record<string, string> = {
    'authorization': `Bearer ${apiKey}`,
  };
  const org = process.env.OPENAI_ORGANIZATION;
  if (org) headers['openai-organization'] = org;

  const upstream = await fetch(UPSTREAM, { headers });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'private, max-age=300',
    },
  });
};
