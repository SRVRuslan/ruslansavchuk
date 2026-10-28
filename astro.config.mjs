import { defineConfig } from 'astro/config';
import config from './src/data/config.js';

export default defineConfig({
  site: config.siteUrl,
  output: 'static',
  // This single-page site can paint without waiting for a separate stylesheet.
  build: { inlineStylesheets: 'always' },
  // Keep the original spacing between inline elements and in the code artwork.
  compressHTML: false,
  devToolbar: { enabled: false },
});
