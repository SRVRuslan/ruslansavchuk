import { readFile, writeFile } from 'node:fs/promises';

// Use Astro's generated hashes instead of maintaining a second CSP allowlist.
export default function securityHeaders() {
  return {
    name: 'portfolio-security-headers',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const html = await readFile(new URL('index.html', dir), 'utf8');
        const tag = html.match(/<meta\s+[^>]*http-equiv="content-security-policy"[^>]*>/i)?.[0];
        const encoded = tag?.match(/\bcontent="([^"]+)"/i)?.[1];
        if (!encoded) throw new Error('Build must produce a Content Security Policy');
        const policy = encoded.replace(/&quot;/g, '"').replace(/&#(?:39|x27);|&apos;/g, "'").replace(/&amp;/g, '&');
        const header = `Content-Security-Policy: ${policy.replace(/;\s*$/, '')}; frame-ancestors 'none'`;
        if (header.length > 2000 || /[\r\n]/.test(header)) throw new Error('CSP exceeds the Cloudflare _headers line limit');
        await writeFile(new URL('_headers', dir), `/*\n  ${header}\n`);
      },
    },
  };
}
