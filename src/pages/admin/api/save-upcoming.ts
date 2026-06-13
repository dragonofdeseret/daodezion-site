export const prerender = false

import type { APIRoute } from 'astro'
import { commitFile } from '../../../lib/github-commit'

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

  const capRaw = body.capacity
  const upcoming = {
    scheduled: Boolean(body.scheduled),
    title: String(body.title ?? '').trim(),
    date: String(body.date ?? '').trim(),
    location: String(body.location ?? '').trim(),
    format: String(body.format ?? '').trim(),
    topic: String(body.topic ?? '').trim(),
    reading: String(body.reading ?? '').trim(),
    eventKey: String(body.eventKey ?? '').trim(),
    rsvpUrl: String(body.rsvpUrl ?? '').trim(),
    capacity: capRaw == null || capRaw === '' ? null : Number(capRaw),
  }

  if (upcoming.scheduled && (!upcoming.title || !upcoming.date)) {
    return json({ error: 'A scheduled session needs at least a title and a date.' }, 400)
  }

  try {
    await commitFile({
      path: 'public/upcoming.json',
      content: JSON.stringify(upcoming, null, 2) + '\n',
      message: upcoming.scheduled
        ? `Schedule upcoming session: ${upcoming.title}`
        : 'Clear upcoming session',
    })
    return json({ ok: true }, 200)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin save-upcoming] failed:', msg)
    return json({ error: msg }, 500)
  }
}
