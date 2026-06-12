// ──────────────────────────────────────────────────────────────────────────────
// Lodge session <-> markdown helpers, shared by the admin save handler.
// A session is a markdown file under src/content/sessions/<slug>.md:
// typed frontmatter + the proceedings as the body.
// ──────────────────────────────────────────────────────────────────────────────

export interface SessionFields {
  date: string // YYYY-MM-DD
  location: string
  attendees: string
  topic: string
  filed: string
  proceedings: string
}

const COLLECTION_DIR = 'src/content/sessions'

function kebab(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48)
    .replace(/^-+|-+$/g, '')
}

/** A stable slug for a new session, from its date + topic. */
export function makeSlug(fields: { date: string; topic: string }): string {
  const date = (fields.date || '').trim() || 'undated'
  const topicSlug = kebab(fields.topic || '') || 'session'
  return `${date}-${topicSlug}`
}

export function sessionFilePath(slug: string): string {
  return `${COLLECTION_DIR}/${slug}.md`
}

/** Double-quote + escape a YAML scalar so any value is safe in frontmatter. */
function yamlString(value: string): string {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

/** Serialize session fields to the markdown file body. */
export function sessionToMarkdown(fields: SessionFields): string {
  const fm = [
    '---',
    `date: ${yamlString(fields.date)}`,
    `location: ${yamlString(fields.location)}`,
  ]
  if (fields.attendees.trim()) fm.push(`attendees: ${yamlString(fields.attendees)}`)
  fm.push(`topic: ${yamlString(fields.topic)}`)
  if (fields.filed.trim()) fm.push(`filed: ${yamlString(fields.filed)}`)
  fm.push('---', '')
  const body = (fields.proceedings || '').trim()
  return `${fm.join('\n')}\n${body ? body + '\n' : ''}`
}
