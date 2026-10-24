import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContact } from '../worker/contact.ts';

const origin = 'https://ruslansavchuk.com';
const enquiry = {
  name: 'Тестовий клієнт', email: 'client@example.com', phone: '',
  service: 'website', message: 'Хочу замовити новий сайт для свого бізнесу.', language: 'uk', company: '',
};
const request = (data = enquiry, options = {}) => new Request(`${origin}/api/contact`, {
  method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1' },
  body: JSON.stringify(data), ...options,
});
function setup(overrides = {}) {
  const deliveries = [];
  const env = {
    CONTACT_EMAIL: { send: async message => { deliveries.push(message); } },
    CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) },
    ...overrides,
  };
  const run = req => handleContact(req, env, (from, to, raw) => ({ from, to, raw }));
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
