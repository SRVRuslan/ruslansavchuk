import { defineConfig } from 'astro/config';
import config from './src/data/config.js';
import securityHeaders from './build/security-headers.mjs';

export default defineConfig({
  site: config.siteUrl,
  output: 'static',
  integrations: [securityHeaders()],
  security: {
    csp: {
      scriptDirective: { resources: [
        { resource: "'self'", kind: 'element' },
        { resource: 'https://challenges.cloudflare.com', kind: 'element' },
        { resource: 'https://static.cloudflareinsights.com', kind: 'element' },
        { resource: "'none'", kind: 'attribute' },
      ] },
      styleDirective: { resources: [{ resource: "'self'", kind: 'element' }, { resource: "'none'", kind: 'attribute' }] },
      directives: [
        "default-src 'none'", "base-uri 'none'", "object-src 'none'",
        "form-action 'self'",
        "img-src 'self' data: https://photo.ruslan-savchuk-dev-ca.workers.dev",
        "font-src 'self'", "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com",
        'frame-src https://challenges.cloudflare.com', "manifest-src 'self'", 'upgrade-insecure-requests',
      ],
    },
  },
  markdown: { syntaxHighlight: false },
  // This single-page site can paint without waiting for a separate stylesheet.
  build: { inlineStylesheets: 'always' },
  // Keep the original spacing between inline elements and in the code artwork.
  compressHTML: false,
  devToolbar: { enabled: false },
});
