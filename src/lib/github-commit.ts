// ──────────────────────────────────────────────────────────────────────────────
// GitHub content commit helper — the admin "Save"/"Delete" handlers commit a
// markdown file change back to the repo. Vercel auto-rebuilds on push, so a
// successful commit means the live site updates within ~30–60s.
// ──────────────────────────────────────────────────────────────────────────────

import { Octokit } from '@octokit/rest'
import { getGithubRepo, getGithubToken } from './env'

let cached: Octokit | null = null
function client(): Octokit {
  if (!cached) cached = new Octokit({ auth: getGithubToken() })
  return cached
}

/** Create or update a single file. `path` is repo-relative. */
export async function commitFile(args: {
  path: string
  content: string
  message: string
}): Promise<{ commitSha: string }> {
  const { owner, repo, branch } = getGithubRepo()
  const gh = client()

  let existingSha: string | undefined
  try {
    const existing = await gh.repos.getContent({ owner, repo, path: args.path, ref: branch })
    if (!Array.isArray(existing.data) && 'sha' in existing.data) {
      existingSha = existing.data.sha
    }
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status
    if (status !== 404) throw err // 404 = creating, not updating
  }

  const encoded = Buffer.from(args.content, 'utf8').toString('base64')
  const result = await gh.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: args.path,
    branch,
    message: args.message,
    content: encoded,
    sha: existingSha,
  })
  return { commitSha: result.data.commit.sha ?? '' }
}

/** Delete a single file. */
export async function deleteFile(args: {
  path: string
  message: string
}): Promise<{ commitSha: string }> {
  const { owner, repo, branch } = getGithubRepo()
  const gh = client()

  const existing = await gh.repos.getContent({ owner, repo, path: args.path, ref: branch })
  if (Array.isArray(existing.data) || !('sha' in existing.data)) {
    throw new Error(`Cannot delete: ${args.path} isn't a file`)
  }
  const result = await gh.repos.deleteFile({
    owner,
    repo,
    path: args.path,
    branch,
    message: args.message,
    sha: existing.data.sha,
  })
  return { commitSha: result.data.commit.sha ?? '' }
}
