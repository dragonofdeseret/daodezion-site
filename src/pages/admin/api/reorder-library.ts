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
  const direction = String(body.direction ?? '')
  if (!slug || (direction !== 'up' && direction !== 'down')) {
    return json({ error: 'slug + direction ("up"/"down") required.' }, 400)
  }

  try {
    const data = await loadLibrary()
    const found = findText(data, slug)
    if (!found) return json({ error: `No text "${slug}".` }, 404)

    const arr = data.paths[found.path][found.tier]
    const target = direction === 'up' ? found.index - 1 : found.index + 1
    if (target < 0 || target >= arr.length) {
      return json({ ok: true, moved: false }, 200) // already at the edge
    }

    ;[arr[found.index], arr[target]] = [arr[target], arr[found.index]]
    await commitLibrary(data, `Reorder library: move "${slug}" ${direction}`)
    return json({ ok: true, moved: true }, 200)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin reorder-library] failed:', msg)
    return json({ error: msg }, 500)
  }
}
