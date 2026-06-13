export const prerender = false

import type { APIRoute } from 'astro'
import { commitLibrary, loadLibrary } from '../../../lib/library-data'

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

  const path = String(body.path ?? '').trim()
  const str = (k: string) => String(body[k] ?? '').trim()

  try {
    const data = await loadLibrary()
    const p = data.paths[path]
    if (!p) return json({ error: `Unknown path "${path}".` }, 400)

    // Update intro/meta fields only — leave core/further/slug untouched.
    p.name = str('name')
    p.subtitle = str('subtitle')
    p.glyph = str('glyph')
    p.sancai = str('sancai')
    p.triadBlurb = str('triadBlurb')
    p.lede = str('lede')
    p.statement = str('statement')
    p.why = str('why')

    await commitLibrary(data, `Update path intro: ${path}`)
    return json({ ok: true }, 200)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin save-path] failed:', msg)
    return json({ error: msg }, 500)
  }
}
