// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'

// https://astro.build/config
export default defineConfig({
  // Canonical domain. Used for every absolute URL the build emits:
  // sitemap, canonical link tags, OG urls.
  site: 'https://daodezion.com',
  // Static by default — every public page is prerendered to HTML at build
  // time and served as a fast static file. The Vercel adapter lets the
  // /admin editor routes opt INTO on-demand server rendering via
  // `export const prerender = false`; everything else stays static.
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
})
