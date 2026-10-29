import type { EmailMessage, RateLimit, SendEmail } from '@cloudflare/workers-types';

export interface ContactEnv {
  CONTACT_EMAIL: SendEmail;
  CONTACT_RATE_LIMITER: RateLimit;
  CONTACT_ATTEMPT_LIMITER: RateLimit;
  TURNSTILE_SECRET_KEY: string;
}

const recipient = 'ruslan.savchuk.dev.ca@gmail.com';
const sender = 'website@forms.ruslansavchuk.com';
const maxBodyBytes = 32768;
const services: Record<string, string> = {
  website: 'Вебсайт / Website',
  app: 'Вебзастосунок / Web application',
  shop: 'Інтернет-магазин / Online store',
  other: 'Інше / Other',
};

function respond(status: number, error?: string) {
  return Response.json(error ? { ok: false, error } : { ok: true }, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}

async function readJson(request: Request) {
  if (Number(request.headers.get('Content-Length')) > maxBodyBytes) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let length = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => { void reader.cancel().catch(() => {}); reject(new Error('Body timeout')); }, 5000);
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      length += value.byteLength;
      if (length > maxBodyBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const data: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(bytes));
    return data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, unknown> : null;
  } catch {
    return null;
  } finally {
    if (timeout !== undefined) clearTimeout(timeout);
    reader.releaseLock();
  }
}

function base64(value: string) {
  return btoa(Array.from(new TextEncoder().encode(value), byte => String.fromCharCode(byte)).join(''));
}

export async function handleContact(
  request: Request,
  env: ContactEnv,
  createMessage: (from: string, to: string, raw: string) => EmailMessage,
  // Keep the platform transport bound when replacing it in tests.
  verifyFetch: typeof fetch = (input, init) => globalThis.fetch(input, init),
) {
  if (request.method !== 'POST') {
    const response = respond(405, 'method_not_allowed');
    response.headers.set('Allow', 'POST');
    return response;
  }
  if (request.headers.get('Origin') !== new URL(request.url).origin) return respond(403, 'forbidden');
  const fetchSite = request.headers.get('Sec-Fetch-Site');
  if (fetchSite && fetchSite !== 'same-origin') return respond(403, 'forbidden');
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') return respond(415, 'invalid_content_type');
  if (request.headers.has('Content-Encoding') && request.headers.get('Content-Encoding') !== 'identity') return respond(415, 'invalid_content_type');
  if (!env.CONTACT_EMAIL || !env.CONTACT_RATE_LIMITER || !env.CONTACT_ATTEMPT_LIMITER || !env.TURNSTILE_SECRET_KEY) return respond(503, 'unavailable');
  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  try {
    const { success } = await env.CONTACT_ATTEMPT_LIMITER.limit({ key: `portfolio-contact-attempt:${ip}` });
    if (!success) {
      const response = respond(429, 'rate_limited');
      response.headers.set('Retry-After', '60');
      return response;
    }
  } catch { return respond(503, 'unavailable'); }

  const data = await readJson(request);
  if (!data) return respond(400, 'invalid_request');
  // A visually hidden field is left empty by visitors and catches basic form bots.
  if (typeof data.company === 'string' && data.company.trim()) return respond(200);
  if (data.company !== undefined && typeof data.company !== 'string') return respond(400, 'invalid_fields');

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  // Phone numbers are optional free text: no pattern or country-specific validation.
  if (data.phone !== undefined && typeof data.phone !== 'string') return respond(400, 'invalid_fields');
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const service = typeof data.service === 'string' && Object.hasOwn(services, data.service) ? services[data.service] : '';
  const language = typeof data.language === 'string' && ['uk', 'en', 'fr', 'es', 'de', 'pt', 'it', 'pl', 'ar'].includes(data.language) ? data.language : 'uk';
  if (!name || name.length > 100 || phone.length > 100 || email.length > 254 ||
      !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(email) ||
      message.length < 10 || message.length > 5000 || !service) return respond(400, 'invalid_fields');

  const token = typeof data.turnstileToken === 'string' ? data.turnstileToken.trim() : '';
  if (!token || token.length > 2048) return respond(400, 'verification_required');
  try {
    const { success } = await env.CONTACT_RATE_LIMITER.limit({ key: `portfolio-contact:${ip}` });
    if (!success) {
      const response = respond(429, 'rate_limited');
      response.headers.set('Retry-After', '60');
      return response;
    }
    let verification: { success?: boolean; hostname?: string; action?: string };
    try {
      const result = await verifyFetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, ...(ip !== 'local' ? { remoteip: ip } : {}) }),
        signal: AbortSignal.timeout(8000),
        // Workers does not implement redirect: 'error'. Reject 3xx below instead.
        redirect: 'manual',
      });
      if (!result.ok) {
        console.error('Contact verification provider HTTP status', result.status);
        return respond(503, 'verification_unavailable');
      }
      verification = await result.json();
    } catch (error) {
      console.error('Contact verification request failed', error instanceof Error ? error.name : 'UnknownError');
      return respond(503, 'verification_unavailable');
    }
    if (verification?.success !== true || verification.hostname !== new URL(request.url).hostname || verification.action !== 'contact') {
      return respond(403, 'verification_failed');
    }
    const text = [
      'Нова заявка з ruslansavchuk.com', '',
      `Ім’я / Name: ${name}`,
      `Email: ${email}`,
      `Телефон / Phone: ${phone || 'Не вказано / Not provided'}`,
      `Послуга / Service: ${service}`,
      `Мова / Language: ${language}`, '',
      'Повідомлення / Message:', message,
    ].join('\n');
    const raw = [
      `From: Ruslan Savchuk Portfolio <${sender}>`,
      `To: ${recipient}`,
      `Reply-To: ${email}`,
      'Subject: New enquiry from ruslansavchuk.com',
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${crypto.randomUUID()}@forms.ruslansavchuk.com>`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64', '',
      base64(text).match(/.{1,76}/g)!.join('\r\n'), '',
    ].join('\r\n');
    await env.CONTACT_EMAIL.send(createMessage(sender, recipient, raw));
    return respond(200);
  } catch {
    // Do not log enquiry content or customer contact details.
    console.error('Contact email delivery failed');
    return respond(502, 'delivery_failed');
  }
}
