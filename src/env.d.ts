declare namespace App {
  interface Locals {
    /** Set by middleware once an admin session cookie is verified. */
    user?: { ok: true }
  }
}
