// ──────────────────────────────────────────────────────────────────────────────
// The Library data now lives in library.json (so the /admin editor can read,
// modify, and commit it). This module just re-exports it in the shape the
// public pages already expect — no consumer changes.
//
// Shape of each book: { slug, title, note, href, why?, epithet?,
//   quote?: { text, cite }, echoes?: [{ path, slug, title, note }] }.
// ──────────────────────────────────────────────────────────────────────────────

import data from './library.json'

export const paths = data.paths
export const pathOrder = data.pathOrder
