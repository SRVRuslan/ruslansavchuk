import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContact } from '../worker/contact.ts';

const origin = 'https://ruslansavchuk.com';
const enquiry = {
  name: 'Тестовий клієнт', email: 'client@example.com', phone: '',
  service: 'website', message: 'Хочу замовити новий сайт для свого бізнесу.', language: 'uk', company: '',
  turnstileToken: 'unit-test-token',
};
const request = (data = enquiry, options = {}) => new Request(`${origin}/api/contact`, {
  method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1' },
  body: JSON.stringify(data), ...options,
});
function setup(overrides = {}, verifyFetch = async () => Response.json({ success: true, hostname: 'ruslansavchuk.com', action: 'contact' })) {
  const deliveries = [];
  const env = {
    CONTACT_EMAIL: { send: async message => { deliveries.push(message); } },
    CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) },
    CONTACT_ATTEMPT_LIMITER: { limit: async () => ({ success: true }) },
    TURNSTILE_SECRET_KEY: 'unit-test-secret',
    ...overrides,
  };
  const run = req => handleContact(req, env, (from, to, raw) => ({ from, to, raw }), verifyFetch);
  return { run, deliveries };
}
const bodyOf = mail => Buffer.from(mail.raw.split('\r\n\r\n')[1].replace(/\r\n/g, ''), 'base64').toString('utf8');

test('sends without a phone, to the fixed owner, with the visitor as Reply-To', async () => {
  const { run, deliveries } = setup();
  const response = await run(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(deliveries.length, 1);
  const mail = deliveries[0];
  assert.equal(mail.to, 'ruslan.savchuk.dev.ca@gmail.com');
  assert.equal(mail.from, 'website@forms.ruslansavchuk.com');
  assert.match(mail.raw, /Reply-To: client@example.com\r\n/);
  const body = bodyOf(mail);
  assert.ok(body.includes(enquiry.name) && body.includes(enquiry.message));
  assert.ok(body.includes('Не вказано / Not provided'));
});

test('phone accepts arbitrary text and punctuation without a phone-number pattern', async () => {
  for (const phone of ['+1 (403) 555-0123 ext. 42', 'WhatsApp: 050 123 45 67, після 18:00', '123', '☎ будь-який формат']) {
    const { run, deliveries } = setup();
    assert.equal((await run(request({ ...enquiry, phone }))).status, 200);
    assert.ok(bodyOf(deliveries[0]).includes(phone));
  }
  const { run } = setup();
  const { phone, ...withoutPhone } = enquiry;
  assert.equal((await run(request(withoutPhone))).status, 200);
});

test('Spanish enquiries preserve their language and accented characters in the email', async () => {
  const { run, deliveries } = setup();
  const response = await run(request({ ...enquiry, language: 'es', name: 'José Muñoz', message: 'Necesito un sitio para una cafetería con menú y teléfono.' }));
  assert.equal(response.status, 200);
  assert.equal(deliveries.length, 1);
  const body = bodyOf(deliveries[0]);
  assert.match(body, /Мова \/ Language: es/);
  assert.ok(body.includes('José Muñoz') && body.includes('cafetería con menú y teléfono'));
});

test('German enquiries preserve their language, umlauts and sharp S in the email', async () => {
  const { run, deliveries } = setup();
  const response = await run(request({ ...enquiry, language: 'de', name: 'Jürgen Müller', message: 'Ich möchte eine Website für mein Café in der Hauptstraße.' }));
  assert.equal(response.status, 200);
  assert.equal(deliveries.length, 1);
  const body = bodyOf(deliveries[0]);
  assert.match(body, /Мова \/ Language: de/);
  assert.ok(body.includes('Jürgen Müller') && body.includes('möchte eine Website für mein Café in der Hauptstraße'));
});

test('Portuguese enquiries preserve their language and accented characters in the email', async () => {
  const { run, deliveries } = setup();
  const response = await run(request({ ...enquiry, language: 'pt', name: 'João Gonçalves', message: 'Preciso de um site para o meu café, com preços e informações.' }));
  assert.equal(response.status, 200);
  assert.equal(deliveries.length, 1);
  const body = bodyOf(deliveries[0]);
  assert.match(body, /Мова \/ Language: pt/);
  assert.ok(body.includes('João Gonçalves') && body.includes('café, com preços e informações'));
});

test('Italian enquiries preserve their language, accents and apostrophes in the email', async () => {
  const { run, deliveries } = setup();
  const response = await run(request({ ...enquiry, language: 'it', name: 'Niccolò D’Angelo', message: 'Vorrei un sito per la mia attività, con menu del caffè e contatti.' }));
  assert.equal(response.status, 200);
  assert.equal(deliveries.length, 1);
  const body = bodyOf(deliveries[0]);
  assert.match(body, /Мова \/ Language: it/);
  assert.ok(body.includes('Niccolò D’Angelo') && body.includes('attività, con menu del caffè'));
});

test('Polish enquiries preserve their language and diacritics in the email', async () => {
  const { run, deliveries } = setup();
  const response = await run(request({ ...enquiry, language: 'pl', name: 'Łukasz Żółkiewicz', message: 'Chcę stronę dla mojej kawiarni z menu, zdjęciami i możliwością kontaktu.' }));
  assert.equal(response.status, 200);
  assert.equal(deliveries.length, 1);
  const body = bodyOf(deliveries[0]);
  assert.match(body, /Мова \/ Language: pl/);
  assert.ok(body.includes('Łukasz Żółkiewicz') && body.includes('zdjęciami i możliwością kontaktu'));
});

test('Arabic enquiries preserve their language, RTL text and international phone numbers', async () => {
  const { run, deliveries } = setup();
  const response = await run(request({ ...enquiry, language: 'ar', name: 'أحمد عبدالله', phone: '+971 50 123 4567', message: 'أريد موقعًا لمقهى يعرض قائمة الطعام والصور وبيانات التواصل.' }));
  assert.equal(response.status, 200);
  assert.equal(deliveries.length, 1);
  const body = bodyOf(deliveries[0]);
  assert.match(body, /Мова \/ Language: ar/);
  assert.ok(body.includes('أحمد عبدالله') && body.includes('قائمة الطعام والصور'));
  assert.ok(body.includes('+971 50 123 4567'));
});

test('customer fields cannot override recipient, sender, or inject email headers', async () => {
  const { run, deliveries } = setup();
  assert.equal((await run(request({ ...enquiry, to: 'attacker@example.com', from: 'attacker@example.com', name: 'Name\r\nBcc: attacker@example.com', phone: '\r\nBcc: attacker@example.com' }))).status, 200);
  assert.equal(deliveries[0].to, 'ruslan.savchuk.dev.ca@gmail.com');
  assert.doesNotMatch(deliveries[0].raw, /\r\nBcc:/);
  assert.equal((await run(request({ ...enquiry, email: 'client@example.com\r\nBcc: attacker@example.com' }))).status, 400);
  assert.equal(deliveries.length, 1);
});

test('invalid enquiries never send emails', async () => {
  const { run, deliveries } = setup();
  for (const fields of [{ name: ' ' }, { name: 'a'.repeat(101) }, { email: 'bad' }, { message: 'short' }, { message: 'a'.repeat(5001) }, { service: 'constructor' }, { service: 'invalid' }, { phone: 403 }]) {
    assert.equal((await run(request({ ...enquiry, ...fields }))).status, 400, JSON.stringify(fields).slice(0, 100));
  }
  for (const body of ['{bad', 'null', '[]', ' '.repeat(32769)]) {
    assert.equal((await run(request(enquiry, { body }))).status, 400);
  }
  assert.equal(deliveries.length, 0);
});

test('rejects oversized streamed bodies even without Content-Length', async () => {
  const { run, deliveries } = setup();
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(32769)); controller.close(); } });
  const response = await run(request(enquiry, { body: stream, duplex: 'half' }));
  assert.equal(response.status, 400);
  assert.equal(deliveries.length, 0);
});

test('rejects foreign origins, wrong content type, and wrong methods', async () => {
  const { run, deliveries } = setup();
  assert.equal((await run(request(enquiry, { headers: { Origin: 'https://example.net', 'Content-Type': 'application/json' } }))).status, 403);
  assert.equal((await run(request(enquiry, { headers: { 'Content-Type': 'application/json' } }))).status, 403);
  assert.equal((await run(request(enquiry, { headers: { Origin: origin, 'Content-Type': 'text/plain' } }))).status, 415);
  const getResponse = await run(new Request(`${origin}/api/contact`));
  assert.equal(getResponse.status, 405);
  assert.equal(getResponse.headers.get('Allow'), 'POST');
  assert.equal(deliveries.length, 0);
});

test('honeypot submissions are ignored', async () => {
  const { run, deliveries } = setup();
  assert.equal((await run(request({ ...enquiry, company: 'spam' }))).status, 200);
  assert.equal(deliveries.length, 0);
});

test('rate limiting prevents delivery and tells the browser when to retry', async () => {
  let limiterKey;
  const { run, deliveries } = setup({ CONTACT_RATE_LIMITER: { limit: async ({ key }) => { limiterKey = key; return { success: false }; } } });
  const response = await run(request());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '60');
  assert.equal(limiterKey, 'portfolio-contact:192.0.2.1');
  assert.equal(deliveries.length, 0);
});

test('only reports success after the email service has accepted the message', async () => {
  let accept;
  const pending = new Promise(resolve => { accept = resolve; });
  const { run } = setup({ CONTACT_EMAIL: { send: () => pending } });
  let responded = false;
  const response = run(request()).then(value => { responded = true; return value; });
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(responded, false);
  accept();
  assert.equal((await response).status, 200);
});

test('provider failures or missing bindings cannot produce a false success', async () => {
  const failure = setup({ CONTACT_EMAIL: { send: async () => { throw new Error('mail provider rejected'); } } });
  assert.equal((await failure.run(request())).status, 502);
  const missing = setup({ CONTACT_EMAIL: undefined });
  assert.equal((await missing.run(request())).status, 503);
});

test('missing or oversized challenge tokens never reach the verification provider or email', async () => {
  const { run, deliveries } = setup({}, () => { throw new Error('Must not verify invalid input'); });
  for (const turnstileToken of [undefined, '', ' ', 123, 'x'.repeat(2049)]) {
    assert.equal((await run(request({ ...enquiry, turnstileToken }))).status, 400);
  }
  assert.equal(deliveries.length, 0);
});

test('only successful contact challenges for this exact hostname can deliver mail', async () => {
  for (const result of [null, {}, { success: false }, { success: 'true', hostname: 'ruslansavchuk.com', action: 'contact' },
    { success: true, hostname: 'attacker.example', action: 'contact' },
    { success: true, hostname: 'ruslansavchuk.com', action: 'login' },
    { success: true, hostname: 'ruslansavchuk.com' }]) {
    const { run, deliveries } = setup({}, async () => Response.json(result));
    assert.equal((await run(request())).status, 403);
    assert.equal(deliveries.length, 0);
  }
});

test('verification uses the private secret, token and trusted CF IP at the fixed endpoint', async () => {
  let called = false;
  const { run, deliveries } = setup({}, async (url, options) => {
    called = true;
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    assert.equal(options.redirect, 'error');
    assert.ok(options.signal instanceof AbortSignal);
    assert.deepEqual(JSON.parse(options.body), { secret: 'unit-test-secret', response: 'unit-test-token', remoteip: '192.0.2.1' });
    return Response.json({ success: true, hostname: 'ruslansavchuk.com', action: 'contact' });
  });
  assert.equal((await run(request())).status, 200);
  assert.ok(called);
  assert.equal(deliveries.length, 1);
});

test('provider timeouts, bad JSON and HTTP failures fail closed without sending mail', async () => {
  for (const verify of [async () => { throw new Error('timeout'); }, async () => new Response('unavailable', { status: 503 }), async () => new Response('bad json')]) {
    const { run, deliveries } = setup({}, verify);
    assert.equal((await run(request())).status, 503);
    assert.equal(deliveries.length, 0);
  }
  for (const binding of ['TURNSTILE_SECRET_KEY', 'CONTACT_ATTEMPT_LIMITER', 'CONTACT_RATE_LIMITER', 'CONTACT_EMAIL']) {
    const { run, deliveries } = setup({ [binding]: undefined });
    assert.equal((await run(request())).status, 503);
    assert.equal(deliveries.length, 0);
  }
});

test('a reused token rejected by Turnstile cannot deliver a second message', async () => {
  let verified = false;
  const { run, deliveries } = setup({}, async () => {
    const success = !verified;
    verified = true;
    return Response.json({ success, hostname: 'ruslansavchuk.com', action: 'contact' });
  });
  assert.equal((await run(request())).status, 200);
  assert.equal((await run(request())).status, 403);
  assert.equal(deliveries.length, 1);
});

test('attempt limiter stops requests before parsing bodies or calling external providers', async () => {
  let key;
  const { run, deliveries } = setup({ CONTACT_ATTEMPT_LIMITER: { limit: async options => { key = options.key; return { success: false }; } } },
    () => { throw new Error('Must not verify a blocked request'); });
  const response = await run(request(enquiry, { body: '{bad' }));
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '60');
  assert.equal(key, 'portfolio-contact-attempt:192.0.2.1');
  assert.equal(deliveries.length, 0);
});

test('cross-site Fetch Metadata and compressed payloads are rejected', async () => {
  const { run, deliveries } = setup();
  const headers = { Origin: origin, 'Content-Type': 'application/json' };
  for (const site of ['cross-site', 'same-site', 'none']) {
    assert.equal((await run(request(enquiry, { headers: { ...headers, 'Sec-Fetch-Site': site } }))).status, 403);
  }
  assert.equal((await run(request(enquiry, { headers: { ...headers, 'Content-Encoding': 'gzip' } }))).status, 415);
  assert.equal(deliveries.length, 0);
});

test('phone length is bounded while preserving optional free-format input', async () => {
  const { run, deliveries } = setup();
  assert.equal((await run(request({ ...enquiry, phone: 'a'.repeat(101) }))).status, 400);
  assert.equal((await run(request({ ...enquiry, phone: 'a'.repeat(100) }))).status, 200);
  assert.equal(deliveries.length, 1);
});
