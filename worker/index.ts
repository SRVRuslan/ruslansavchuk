import { EmailMessage } from 'cloudflare:email';
import type { Fetcher } from '@cloudflare/workers-types';
import { handleContact, type ContactEnv } from './contact';

interface Env extends ContactEnv {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname === 'www.ruslansavchuk.com') {
      url.hostname = 'ruslansavchuk.com';
      url.protocol = 'https:';
      url.port = '';
      return Response.redirect(url.href, 301);
    }
    if (url.pathname === '/api/contact') {
      return handleContact(request, env, (from, to, raw) => new EmailMessage(from, to, raw));
    }
    return env.ASSETS.fetch(request);
  },
};
