export const prerender = false

import type { APIRoute } from 'astro'
import { getAdminPassword } from '../../../lib/env'
import { COOKIE_NAME, COOKIE_OPTIONS, createSessionValue } from '../../../lib/auth'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData()
  const password = String(form.get('password') || '')
  const next = String(form.get('next') || '/admin')

  let expected = ''
  try {
    expected = getAdminPassword()
  } catch {
    // ADMIN_PASSWORD not configured — fail closed.
  }

  if (!expected || password !== expected) {
    return redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`)
  }

  cookies.set(COOKIE_NAME, createSessionValue(), COOKIE_OPTIONS)
  // Only honor same-site /admin redirects.
  return redirect(next.startsWith('/admin') ? next : '/admin')
}
