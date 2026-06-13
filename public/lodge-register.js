/*
  LODGE OF ZION — UPCOMING SESSION + RSVP
  ---------------------------------------
  The meeting register (archive of past proceedings) is rendered server-side on
  the Lodge page from the `sessions` content collection.

  This client script renders only the live "upcoming session" card. Its config
  now lives in /upcoming.json (edited in /admin → Upcoming Session); attendee
  counts come from a published Google Sheet CSV.
*/

const RSVP_SHEET = {
  enabled: true,
  csvUrl:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQL1gI6WH9-h_AELPF048JlZ9QfO9sYFvp57TTMqPhH-yOiVy5R3dfhTqkrnScb4uSk4LtIBpwzZeyy/pub?gid=1163879655&single=true&output=csv",
  columns: {
    eventKey: "eventKey",
    name: "Name",
    attendeeCount: "No. of attendees"
  },
  attendeeDisplayMode: "count"
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateLong(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') { current += '"'; i += 1; }
      else { inQuotes = !inQuotes; }
    } else if (char === "," && !inQuotes) {
      result.push(current); current = "";
    } else { current += char; }
  }
  result.push(current);
  return result;
}

function parseCsv(text) {
  const lines = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') { current += '"'; i += 1; }
      else { inQuotes = !inQuotes; }
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (current.trim() !== "") lines.push(current);
      current = "";
      if (char === "\r" && next === "\n") i += 1;
    } else { current += char; }
  }
  if (current.trim() !== "") lines.push(current);
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCsvLine(lines[i]);
    const row = {};
    headers.forEach((header, index) => { row[header] = (values[index] || "").trim(); });
    rows.push(row);
  }
  return rows;
}

function toPositiveInt(value) {
  const n = parseInt(String(value || "").trim(), 10);
  return Number.isNaN(n) || n < 1 ? 0 : n;
}

function isEventPast(dateStr) {
  return new Date() > new Date(`${dateStr}T23:59:59`);
}

async function fetchUpcoming() {
  try {
    const res = await fetch("/upcoming.json", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Lodge upcoming.json fetch failed:", error);
    return null;
  }
}

async function fetchSheetRows() {
  if (!RSVP_SHEET.enabled || !RSVP_SHEET.csvUrl) return [];
  try {
    const response = await fetch(RSVP_SHEET.csvUrl, { method: "GET", cache: "no-store" });
    if (!response.ok) throw new Error(`Sheet request failed with ${response.status}`);
    return parseCsv(await response.text());
  } catch (error) {
    console.error("Lodge RSVP sheet fetch failed:", error);
    return [];
  }
}

function totalAttendeesForEvent(rows, eventKey) {
  const key = String(eventKey || "").trim();
  if (!key) return 0;
  let total = 0;
  rows.forEach((row) => {
    if (String(row[RSVP_SHEET.columns.eventKey] || "").trim() === key) {
      total += toPositiveInt(row[RSVP_SHEET.columns.attendeeCount]);
    }
  });
  return total;
}

function getCapacityState(upcoming, total) {
  const capacity = upcoming.capacity;
  if (capacity == null || Number.isNaN(Number(capacity)) || Number(capacity) < 1) {
    return { enabled: false, isFull: false, display: null, remaining: null };
  }
  const safe = Number(capacity);
  const remaining = Math.max(safe - total, 0);
  const isFull = total >= safe;
  return {
    enabled: true,
    isFull,
    remaining,
    display: isFull ? `${safe} / ${safe} registered · Full` : `${total} / ${safe} registered`
  };
}

function attendeeText(total, capacityState) {
  if (capacityState.enabled) return capacityState.display;
  if (!total) return "No registrations yet.";
  return total === 1 ? "1 registered" : `${total} registered`;
}

function buildDormantCard(el) {
  el.innerHTML = `
    <article class="card event-card ink-card">
      <p class="eyebrow">Upcoming</p>
      <h2>No session currently scheduled</h2>
      <div class="archive-notes">
        <p>The Lodge gathers as the season and the company allow. When the next session is set, it will be posted here and entered into the register.</p>
      </div>
    </article>
  `;
}

function buildUpcomingCard(el, upcoming, total) {
  const past = isEventPast(upcoming.date);
  const capacityState = getCapacityState(upcoming, total);
  const closed = past || capacityState.isFull;
  const hasRealRsvp = upcoming.rsvpUrl && upcoming.rsvpUrl !== "#";
  const rsvpAttrs = !closed && hasRealRsvp
    ? `href="${escapeHtml(upcoming.rsvpUrl)}" target="_blank" rel="noopener noreferrer"`
    : `href="#" aria-disabled="true" style="opacity:0.55;pointer-events:none;"`;
  const statusText = past ? "Closed" : capacityState.isFull ? "Full" : "Open";
  const seatText = capacityState.enabled
    ? (capacityState.isFull ? "Capacity reached." : `${capacityState.remaining} seat(s) remaining.`)
    : "";

  el.innerHTML = `
    <article class="card event-card ink-card">
      <p class="eyebrow">Upcoming</p>
      <h2>${escapeHtml(upcoming.title)}</h2>
      <dl class="archive-ledger">
        <div class="archive-ledger-row"><dt>Date</dt><dd>${escapeHtml(formatDateLong(upcoming.date))}</dd></div>
        <div class="archive-ledger-row"><dt>Location</dt><dd>${escapeHtml(upcoming.location)}</dd></div>
        ${upcoming.format ? `<div class="archive-ledger-row"><dt>Format</dt><dd>${escapeHtml(upcoming.format)}</dd></div>` : ""}
        <div class="archive-ledger-row"><dt>Topic</dt><dd>${escapeHtml(upcoming.topic)}</dd></div>
        ${upcoming.reading ? `<div class="archive-ledger-row"><dt>Suggested Reading</dt><dd>${escapeHtml(upcoming.reading)}</dd></div>` : ""}
        <div class="archive-ledger-row"><dt>Attendees</dt><dd>${escapeHtml(attendeeText(total, capacityState))}</dd></div>
        ${capacityState.enabled ? `<div class="archive-ledger-row"><dt>Capacity</dt><dd>${escapeHtml(seatText)}</dd></div>` : ""}
        <div class="archive-ledger-row"><dt>Status</dt><dd>${escapeHtml(statusText)}</dd></div>
      </dl>
      <div class="button-row">
        <a class="button" ${rsvpAttrs}>${past ? "RSVP Closed" : capacityState.isFull ? "Event Full" : "RSVP"}</a>
      </div>
    </article>
  `;
}

async function renderLodgeUpcoming() {
  const el = document.querySelector("[data-lodge-upcoming]");
  if (!el) return;

  const upcoming = await fetchUpcoming();
  const isScheduled = upcoming && upcoming.scheduled !== false && upcoming.scheduled !== "false";

  if (!isScheduled) {
    buildDormantCard(el);
    return;
  }

  const rows = await fetchSheetRows();
  const total = totalAttendeesForEvent(rows, upcoming.eventKey);
  buildUpcomingCard(el, upcoming, total);
}

document.addEventListener("DOMContentLoaded", renderLodgeUpcoming);
