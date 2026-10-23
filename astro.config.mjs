import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // Keep the original spacing between inline elements and in the code artwork.
  compressHTML: false,
  devToolbar: { enabled: false },
});
