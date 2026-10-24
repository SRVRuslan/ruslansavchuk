import { EmailMessage } from 'cloudflare:email';
import type { Fetcher } from '@cloudflare/workers-types';
import { handleContact, type ContactEnv } from './contact';

interface Env extends ContactEnv {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname === '/api/contact') {
      return handleContact(request, env, (from, to, raw) => new EmailMessage(from, to, raw));
    }
    return env.ASSETS.fetch(request);
  },
};
