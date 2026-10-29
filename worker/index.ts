import { EmailMessage } from 'cloudflare:email';
import { handleRequest, type Env } from './handler.ts';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env, (from, to, raw) => new EmailMessage(from, to, raw));
  },
};
