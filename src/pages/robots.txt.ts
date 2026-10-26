import config from '../data/config.js';

export function GET() {
  return new Response(`User-agent: *
Allow: /

Sitemap: ${new URL('sitemap.xml', config.siteUrl).href}
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
