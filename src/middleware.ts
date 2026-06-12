// ──────────────────────────────────────────────────────────────────────────────
// Auth gate for /admin/**.
//
// Public paths pass straight through (this runs for prerendered pages at build
// too, so it must never touch env for non-admin routes). For /admin we verify
// the signed session cookie; login + its POST endpoint are exempt (chicken/egg).
// ──────────────────────────────────────────────────────────────────────────────

import { defineMiddleware } from 'astro:middleware'
import { COOKIE_NAME, verifySessionValue } from './lib/auth'

const LOGIN_PATH = '/admin/login'
const LOGIN_API = '/admin/api/login'

export const onRequest = defineMiddleware((context, next) => {
  const { url, cookies, redirect, locals } = context
  const path = url.pathname

  if (!path.startsWith('/admin')) return next()
  if (path === LOGIN_PATH || path === LOGIN_API) return next()

  const cookie = cookies.get(COOKIE_NAME)?.value
  if (!verifySessionValue(cookie)) {
    const next = encodeURIComponent(path + url.search)
    return redirect(`${LOGIN_PATH}?next=${next}`)
  }

  locals.user = { ok: true }
  return next()
})
