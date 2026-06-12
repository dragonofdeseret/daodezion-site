// ──────────────────────────────────────────────────────────────────────────────
// Content collections.
//
// `sessions` — the Lodge of Zion meeting register. One markdown file per
// gathering: typed frontmatter (date, location, attendees, topic, filed) plus
// the proceedings as the markdown body. The public Lodge page renders these
// server-side at build; the /admin editor creates and edits them by committing
// markdown back to the repo.
// ──────────────────────────────────────────────────────────────────────────────

import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const sessions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sessions' }),
  schema: z.object({
    // ISO date, kept as a string (quote it in YAML) so sorting + display
    // stay simple and frontmatter doesn't coerce to a Date object.
    date: z.string(),
    location: z.string(),
    attendees: z.string().default('Not recorded'),
    topic: z.string(),
    filed: z.string().default(''),
  }),
})

export const collections = { sessions }
