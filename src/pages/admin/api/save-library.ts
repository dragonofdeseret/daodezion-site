export const prerender = false

import type { APIRoute } from 'astro'
import {
  buildText,
  commitLibrary,
  findText,
  loadLibrary,
  type Echo,
} from '../../../lib/library-data'

function json(obj: unknown, status: number): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Not authorized' }, 401)

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'Body must be JSON' }, 400)
  }

  const isNew = Boolean(body.isNew)
  const path = String(body.path ?? '').trim()
  const tier = String(body.tier ?? '').trim()
  const title = String(body.title ?? '').trim()
  const slug = String(body.slug ?? '').trim()
  const originalSlug = String(body.originalSlug ?? '').trim()

  if (!path || (tier !== 'core' && tier !== 'further')) {
    return json({ error: 'A valid path and tier (core/further) are required.' }, 400)
  }
  if (!title) return json({ error: 'Title is required.' }, 400)
  if (!slug) return json({ error: 'Slug is required.' }, 400)

  // Parse the advanced echoes field (JSON array).
  let echoes: Echo[] = []
  const echoesRaw = String(body.echoes ?? '').trim()
  if (echoesRaw) {
    try {
      const parsed = JSON.parse(echoesRaw)
      if (!Array.isArray(parsed)) throw new Error('not an array')
      echoes = parsed
    } catch {
      return json({ error: 'Echoes must be a valid JSON array (or left blank).' }, 400)
    }
  }

  const text = buildText({
    slug,
    title,
    note: String(body.note ?? '').trim(),
    href: String(body.href ?? '').trim(),
    epithet: String(body.epithet ?? ''),
    quoteText: String(body.quoteText ?? ''),
    quoteCite: String(body.quoteCite ?? ''),
    why: String(body.why ?? ''),
    echoes,
  })

  try {
    const data = await loadLibrary()
    if (!data.paths[path]) return json({ error: `Unknown path "${path}".` }, 400)

    const existing = findText(data, isNew ? slug : originalSlug || slug)

    if (isNew) {
      if (existing) return json({ error: `A text with slug "${slug}" already exists.` }, 409)
      data.paths[path][tier].push(text)
    } else if (existing && existing.path === path && existing.tier === tier) {
      // In-place edit — preserve position.
      data.paths[existing.path][existing.tier][existing.index] = text
    } else {
      // Moved (or original not found) — remove old, append to target.
      if (existing) data.paths[existing.path][existing.tier].splice(existing.index, 1)
      data.paths[path][tier].push(text)
    }

    await commitLibrary(data, `${isNew ? 'Add' : 'Update'} library text: ${title}`)
    return json({ ok: true, slug }, 200)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin save-library] failed:', msg)
    return json({ error: msg }, 500)
  }
}
