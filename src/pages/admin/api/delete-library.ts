export const prerender = false

import type { APIRoute } from 'astro'
import { commitLibrary, findText, loadLibrary } from '../../../lib/library-data'

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

  const slug = String(body.slug ?? '').trim()
  if (!slug) return json({ error: 'Missing slug.' }, 400)

  try {
    const data = await loadLibrary()
    const found = findText(data, slug)
    if (!found) return json({ error: `No text with slug "${slug}".` }, 404)
    const [removed] = data.paths[found.path][found.tier].splice(found.index, 1)
    await commitLibrary(data, `Delete library text: ${removed?.title ?? slug}`)
    return json({ ok: true }, 200)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin delete-library] failed:', msg)
    return json({ error: msg }, 500)
  }
}
