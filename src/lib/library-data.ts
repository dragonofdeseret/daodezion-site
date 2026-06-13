// ──────────────────────────────────────────────────────────────────────────────
// Library data helpers for the admin editor. The canonical data is
// src/data/library.json ({ pathOrder, paths }); paths.js re-exports it.
//
// Saves are read-modify-write: load the current JSON from GitHub, change one
// text, commit the whole file back — so two edits never clobber each other.
// ──────────────────────────────────────────────────────────────────────────────

import { commitFile, getFileContent } from './github-commit'

export const LIBRARY_PATH = 'src/data/library.json'

export interface Echo {
  path: string
  slug: string
  title: string
  note: string
}
export interface BookText {
  slug: string
  title: string
  note: string
  href: string
  epithet?: string
  quote?: { text: string; cite: string }
  why?: string
  echoes?: Echo[]
}
export interface LibraryData {
  pathOrder: string[]
  paths: Record<string, { core: BookText[]; further: BookText[]; [k: string]: unknown }>
}

export function kebab(s: string): string {
  return String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48)
    .replace(/^-+|-+$/g, '')
}

export async function loadLibrary(): Promise<LibraryData> {
  return JSON.parse(await getFileContent(LIBRARY_PATH)) as LibraryData
}

export async function commitLibrary(data: LibraryData, message: string): Promise<void> {
  await commitFile({
    path: LIBRARY_PATH,
    content: JSON.stringify(data, null, 2) + '\n',
    message,
  })
}

/** Locate a text by slug across every path/tier. */
export function findText(
  data: LibraryData,
  slug: string,
): { path: string; tier: 'core' | 'further'; index: number } | null {
  for (const path of data.pathOrder) {
    for (const tier of ['core', 'further'] as const) {
      const idx = data.paths[path]?.[tier]?.findIndex((b) => b.slug === slug)
      if (idx != null && idx >= 0) return { path, tier, index: idx }
    }
  }
  return null
}

/** Build a clean BookText, dropping empty optional fields. */
export function buildText(fields: {
  slug: string
  title: string
  note: string
  href: string
  epithet: string
  quoteText: string
  quoteCite: string
  why: string
  echoes: Echo[]
}): BookText {
  const book: BookText = {
    slug: fields.slug,
    title: fields.title,
    note: fields.note,
    href: fields.href,
  }
  if (fields.why.trim()) book.why = fields.why.trim()
  if (fields.epithet.trim()) book.epithet = fields.epithet.trim()
  if (fields.quoteText.trim()) {
    book.quote = { text: fields.quoteText.trim(), cite: fields.quoteCite.trim() }
  }
  if (Array.isArray(fields.echoes) && fields.echoes.length) book.echoes = fields.echoes
  return book
}
