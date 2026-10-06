// The third path was renamed Zion → Deseret. Old per-text links
// (/zion/<slug>) 301 to their new home; /zion itself is a static
// redirect in astro.config.mjs.
import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = ({ params, redirect }) =>
  redirect(`/deseret/${params.slug}`, 301)
