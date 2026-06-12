// ──────────────────────────────────────────────────────────────────────────────
// Server-side env accessors (lazy — only thrown when an /admin route actually
// uses them, so public prerendered pages never touch these).
//
// Local dev: copy .env.example → .env and fill in.
// Vercel: set the same vars in Project Settings → Environment Variables.
// ──────────────────────────────────────────────────────────────────────────────

function required(name: string): string {
  const value = import.meta.env[name] ?? process.env[name]
  if (!value) {
    throw new Error(
      `Missing env var ${name}. Set it in .env (local) or Vercel project settings (deploy).`,
    )
  }
  return String(value)
}

function optional(name: string): string | undefined {
  const value = import.meta.env[name] ?? process.env[name]
  return value ? String(value) : undefined
}

/** The single admin password checked at /admin/api/login. */
export function getAdminPassword(): string {
  return required('ADMIN_PASSWORD')
}

/** Secret used to HMAC-sign the admin session cookie. Any long random string. */
export function getSessionSecret(): string {
  return required('ADMIN_SESSION_SECRET')
}

/** GitHub fine-grained PAT with Contents: read+write on the content repo. */
export function getGithubToken(): string {
  return required('GITHUB_TOKEN')
}

/** Repo the editor commits to. GITHUB_REPO = "owner/repo"; branch defaults to main. */
export function getGithubRepo(): { owner: string; repo: string; branch: string } {
  const raw = required('GITHUB_REPO')
  const [owner, repo] = raw.split('/')
  if (!owner || !repo) {
    throw new Error(`GITHUB_REPO must be "owner/repo" (got "${raw}")`)
  }
  return { owner, repo, branch: optional('GITHUB_BRANCH') ?? 'main' }
}
