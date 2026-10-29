import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Run after npm run build so a clean checkout checks the actual deployment files.
test('production CSP is enforced as an HTTP header with matching inline style/script hashes', () => {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const headers = readFileSync(new URL('../dist/_headers', import.meta.url), 'utf8');
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /base-uri 'none'/);
  assert.match(headers, /script-src-attr 'none'/);
  assert.match(headers, /style-src-attr 'none'/);
  assert.doesNotMatch(headers, /'unsafe-inline'|'unsafe-eval'|https:\s|\*\./);
  assert.match(html, /data-sitekey="0x4AAAAAAFqVLM7r_tqtlHtU"/);
  assert.doesNotMatch(html, /data-sitekey="1x00000000000000000000AA"/);
  for (const match of html.matchAll(/<(style|script)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    const [, tag, attributes, content] = match;
    if (tag === 'script' && (/\bsrc=/.test(attributes) || /\btype="application\//.test(attributes))) continue;
    const hash = `'sha256-${createHash('sha256').update(content).digest('base64')}'`;
    assert.ok(headers.includes(hash), `Missing CSP hash for inline ${tag}`);
  }
});
