import type { EmailMessage, Fetcher } from '@cloudflare/workers-types';
import { handleContact, type ContactEnv } from './contact.ts';
import { secureResponse } from './security.ts';

export interface Env extends ContactEnv { ASSETS: Fetcher; }

export async function handleRequest(
  request: Request,
  env: Env,
  createMessage: (from: string, to: string, raw: string) => EmailMessage,
): Promise<Response> {
  const url = new URL(request.url);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  let response: Response;
  try {
    if (!local && !['ruslansavchuk.com', 'www.ruslansavchuk.com'].includes(url.hostname)) {
      response = new Response('Misdirected Request', { status: 421 });
    } else if (!local && (url.hostname === 'www.ruslansavchuk.com' || url.protocol !== 'https:')) {
      url.hostname = 'ruslansavchuk.com';
      url.protocol = 'https:';
      url.port = '';
      response = Response.redirect(url.href, 301);
    } else if (url.pathname === '/api/contact') {
      response = await handleContact(request, env, createMessage);
    } else if (!['GET', 'HEAD'].includes(request.method)) {
      response = new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    } else {
      response = await env.ASSETS.fetch(request);
    }
  } catch {
    // No request bodies, visitor details, secrets or provider errors in logs.
    console.error('Request handling failed');
    response = new Response('Service unavailable', { status: 503 });
  }
  if (response.status >= 400) {
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'no-store');
    response = new Response(response.body, { status: response.status, headers });
  }
  return secureResponse(response, request);
}
