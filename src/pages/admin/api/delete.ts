export const prerender = false

import type { APIRoute } from 'astro'
import { deleteFile } from '../../../lib/github-commit'
import { sessionFilePath } from '../../../lib/sessions-file'

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
    await deleteFile({
      path: sessionFilePath(slug),
      message: `Delete lodge session: ${slug}`,
    })
    return json({ ok: true }, 200)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin delete] failed:', msg)
    return json({ error: msg }, 500)
  }
}
