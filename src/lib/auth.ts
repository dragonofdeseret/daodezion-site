// ──────────────────────────────────────────────────────────────────────────────
// Admin session — a single-user password gate with an HMAC-signed cookie.
//
// No database, no third-party auth. Login (POST /admin/api/login) verifies the
// password against ADMIN_PASSWORD and sets a cookie whose value is
// `<expiry>.<hmac>`. The middleware verifies that signature on every /admin
// request. ADMIN_SESSION_SECRET signs it.
// ──────────────────────────────────────────────────────────────────────────────

import { createHmac, timingSafeEqual } from 'node:crypto'
import { getSessionSecret } from './env'

export const COOKIE_NAME = 'ddz-admin'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

function sign(payload: string): string {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url')
}

/** Build the cookie value for a fresh session. */
export function createSessionValue(): string {
  const expiry = Date.now() + MAX_AGE_SECONDS * 1000
  return `${expiry}.${sign(String(expiry))}`
}

/** True if the cookie value is well-formed, unexpired, and correctly signed. */
export function verifySessionValue(value: string | undefined): boolean {
  try {
    if (!value) return false
    const dot = value.indexOf('.')
    if (dot === -1) return false
    const expiryStr = value.slice(0, dot)
    const sig = value.slice(dot + 1)
    const expiry = Number(expiryStr)
    if (!Number.isFinite(expiry) || expiry < Date.now()) return false
    const expected = sign(expiryStr)
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    return a.length === b.length && timingSafeEqual(a, b)
  } catch {
    // Missing secret / malformed input → treat as not authenticated.
    return false
  }
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: import.meta.env.PROD,
  path: '/',
  maxAge: MAX_AGE_SECONDS,
}
