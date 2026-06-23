// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// ─────────────────────────────────────────────────────────────
// Super Luxury Car Rental — STATIC build. No adapter, no SSR.
// Output: /dist as plain HTML files. Deploy: Cloudflare PAGES
//   Framework preset: Astro · Build: npm run build · Output: dist
// Tailwind v3.4 via @astrojs/tailwind (v4 breaks Cloudflare Pages).
// ─────────────────────────────────────────────────────────────
export default defineConfig({
  site: 'https://demo-superluxury.pages.dev',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) => !/\/(legal|privacy|ar)(\/|$|\.html)/.test(page),
    }),
  ],
  // /page.html instead of /page/index.html → Cloudflare serves without a 308 hop.
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
});
