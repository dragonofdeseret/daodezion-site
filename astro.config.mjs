// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  // Canonical domain. Used for every absolute URL the build emits:
  // sitemap, canonical link tags, OG urls.
  site: 'https://daodezion.com',
  // Static output — every page is prerendered to HTML at build time.
  // The site has no server needs: the Lodge register reads a public
  // Google Sheet CSV client-side. Deploys on Vercel with zero adapter
  // config (Vercel auto-detects Astro and serves dist/).
  output: 'static',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
})
