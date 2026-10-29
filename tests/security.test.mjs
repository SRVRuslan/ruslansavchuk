import test from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from '../worker/handler.ts';

const origin = 'https://ruslansavchuk.com';
const policy = "default-src 'none'; script-src 'self'; frame-ancestors 'none'";
const env = { ASSETS: { fetch: async () => new Response('<!doctype html><title>Portfolio</title>', {
  headers: { 'Content-Type': 'text/html', 'Content-Security-Policy': policy, ETag: 'asset-version' },
}) } };
const run = (url = origin, options, bindings = env) => handleRequest(new Request(url, options), bindings, () => {
  throw new Error('Security tests must not deliver mail');
});

function assertHeaders(response) {
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(response.headers.get('X-Frame-Options'), 'DENY');
  assert.equal(response.headers.get('Strict-Transport-Security'), 'max-age=31536000');
  assert.equal(response.headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
  assert.match(response.headers.get('Content-Security-Policy'), /frame-ancestors 'none'/);
  assert.match(response.headers.get('Permissions-Policy'), /camera=\(\)/);
  assert.equal(response.headers.get('Cross-Origin-Opener-Policy'), 'same-origin');
}

test('security headers preserve static content, build CSP hashes and cache validators', async () => {
  const response = await run();
  assertHeaders(response);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Content-Security-Policy'), policy);
  assert.equal(response.headers.get('ETag'), 'asset-version');
  assert.match(await response.text(), /Portfolio/);
});

test('HTTPS and www redirects retain paths and parameters and include security headers', async () => {
  for (const url of ['https://www.ruslansavchuk.com/path?lang=ar', 'http://ruslansavchuk.com/path?lang=ar']) {
    const response = await run(url);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), `${origin}/path?lang=ar`);
    assert.equal(response.headers.get('X-Frame-Options'), 'DENY');
    if (url.startsWith('https:')) assertHeaders(response);
    else assert.equal(response.headers.has('Strict-Transport-Security'), false);
  }
});

test('alternate hosts cannot bypass the production hostname restrictions', async () => {
  const response = await run('https://unexpected.workers.dev/api/contact');
  assertHeaders(response);
  assert.equal(response.status, 421);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('static assets reject writes, API errors are protected and uncached', async () => {
  for (const [url, status, allow] of [[origin, 405, 'GET, HEAD'], [`${origin}/api/contact`, 405, 'POST']]) {
    const response = await run(url, url === origin ? { method: 'POST' } : undefined);
    assertHeaders(response);
    assert.equal(response.status, status);
    assert.equal(response.headers.get('Allow'), allow);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  }
});

test('unexpected backend failures do not disclose internal details', async () => {
  const response = await run(origin, undefined, { ASSETS: { fetch: async () => { throw new Error('private provider details'); } } });
  assertHeaders(response);
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /private provider/);
});
