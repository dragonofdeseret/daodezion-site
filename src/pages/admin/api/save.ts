export const prerender = false

import type { APIRoute } from 'astro'
import { commitFile } from '../../../lib/github-commit'
import { makeSlug, sessionFilePath, sessionToMarkdown } from '../../../lib/sessions-file'

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

  const fields = {
    date: String(body.date ?? '').trim(),
    location: String(body.location ?? '').trim(),
    attendees: String(body.attendees ?? '').trim(),
    topic: String(body.topic ?? '').trim(),
    filed: String(body.filed ?? '').trim(),
    proceedings: String(body.proceedings ?? ''),
  }

  if (!fields.date || !fields.location || !fields.topic) {
    return json({ error: 'Date, location, and topic are required.' }, 400)
  }

  const isNew = Boolean(body.isNew)
  const slug = isNew ? makeSlug(fields) : String(body.slug ?? '').trim()
  if (!slug) return json({ error: 'Missing slug.' }, 400)

  try {
    await commitFile({
      path: sessionFilePath(slug),
      content: sessionToMarkdown(fields),
      message: `${isNew ? 'Add' : 'Update'} lodge session: ${fields.topic}`,
    })
    return json({ ok: true, slug }, 200)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin save] failed:', msg)
    return json({ error: msg }, 500)
  }
}
