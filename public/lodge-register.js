/*
  LODGE OF ZION — UPCOMING SESSION + RSVP
  ---------------------------------------
  The meeting register (archive of past proceedings) is now rendered
  server-side on the Lodge page from the `sessions` content collection.

  This client script handles only the live "upcoming session" card and its
  RSVP, which reads a published Google Sheet CSV. To post the next session,
  set upcoming.scheduled = true and fill in the fields below, including a
  fresh eventKey + its matching prefilled rsvpUrl.

  REQUIRED GOOGLE FORM FIELDS: eventKey, Email, Name, No. of attendees, Questions/Notes
  REQUIRED SHEET HEADERS: Timestamp,eventKey,Email,Name,No. of attendees,Questions/Notes
*/

const RSVP_SHEET = {
  enabled: true,
  csvUrl:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQL1gI6WH9-h_AELPF048JlZ9QfO9sYFvp57TTMqPhH-yOiVy5R3dfhTqkrnScb4uSk4LtIBpwzZeyy/pub?gid=1163879655&single=true&output=csv",
  columns: {
    eventKey: "eventKey",
    email: "Email",
    name: "Name",
    attendeeCount: "No. of attendees",
    notes: "Questions/Notes"
  },
  attendeeDisplayMode: "count"
};

const LODGE_DATA = {
  upcoming: {
    // Set scheduled:true and update the fields below to post the next session.
    scheduled: false,
    title: "Session II — Kings, Queens, and the Soul",
    date: "2026-05-16",
    eventKey: "ams-2026-05-16",
    location: "Beech Residence / To be confirmed",
    format: "Open discussion",
    topic:
      "What remains necessary in inherited religious order once one has discovered more organic modes of being?",
    reading: "Suggested Reading: Iron John by Robert Bly",
    capacity: null,
    rsvpUrl: "https://docs.google.com/forms/d/e/1FAIpQLScqq-wtybruOtKTV5Khf8jfltQhG_sukFfl8JNDfuBW-F02Ng/viewform?usp=pp_url&entry.1051735444=ams-2026-05-16"
  }
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
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
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

function titleCaseName(name) {
  return String(name || "").trim().replace(/\s+/g, " ").split(" ")
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part)).join(" ");
}

function uniqueNames(names) {
  const seen = new Set();
  const result = [];
  names.forEach((name) => {
    const key = name.toLowerCase();
    if (!seen.has(key)) { seen.add(key); result.push(name); }
  });
  return result;
}

function isEventPast(dateStr) {
  return new Date() > new Date(`${dateStr}T23:59:59`);
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

function filterRowsForUpcomingEvent(rows) {
  if (!LODGE_DATA.upcoming || LODGE_DATA.upcoming.scheduled === false) return [];
  const currentEventKey = String(LODGE_DATA.upcoming.eventKey || "").trim();
  if (!currentEventKey) return [];
  return rows.filter((row) => String(row[RSVP_SHEET.columns.eventKey] || "").trim() === currentEventKey);
}

function summarizeUpcomingRows(rows) {
  const names = [];
  let totalAttendees = 0;
  rows.forEach((row) => {
    const name = titleCaseName(row[RSVP_SHEET.columns.name] || "");
    if (name) names.push(name);
    totalAttendees += toPositiveInt(row[RSVP_SHEET.columns.attendeeCount]);
  });
  return { names: uniqueNames(names).sort((a, b) => a.localeCompare(b)), totalAttendees };
}

function formatUpcomingAttendeeDisplay(summary) {
  if (RSVP_SHEET.attendeeDisplayMode === "names") {
    return summary.names.length ? summary.names.join(", ") : "No registrations yet.";
  }
  if (!summary.totalAttendees) return "No registrations yet.";
  return summary.totalAttendees === 1 ? "1 registered" : `${summary.totalAttendees} registered`;
}

function getCapacityState(summary) {
  const capacity = LODGE_DATA.upcoming.capacity;
  if (capacity == null || Number.isNaN(Number(capacity)) || Number(capacity) < 1) {
    return { enabled: false, isFull: false, display: null, remaining: null, capacity: null };
  }
  const safeCapacity = Number(capacity);
  const total = summary.totalAttendees;
  const remaining = Math.max(safeCapacity - total, 0);
  const isFull = total >= safeCapacity;
  return {
    enabled: true,
    capacity: safeCapacity,
    isFull,
    remaining,
    display: isFull ? `${safeCapacity} / ${safeCapacity} registered · Full` : `${total} / ${safeCapacity} registered`
  };
}

function getSeatStatusText(state) {
  if (!state.enabled) return null;
  if (state.isFull) return "Capacity reached.";
  return state.remaining === 1 ? "1 seat remaining." : `${state.remaining} seats remaining.`;
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

function buildUpcomingCard(summary) {
  const upcoming = LODGE_DATA.upcoming;
  const el = document.querySelector("[data-lodge-upcoming]");
  if (!el) return;

  if (!upcoming || upcoming.scheduled === false) {
    buildDormantCard(el);
    return;
  }

  const past = isEventPast(upcoming.date);
  const capacityState = getCapacityState(summary);
  const closed = past || capacityState.isFull;
  const attendeeText = capacityState.enabled ? capacityState.display : formatUpcomingAttendeeDisplay(summary);
  const seatStatusText = getSeatStatusText(capacityState);
  const hasRealRsvp = upcoming.rsvpUrl && upcoming.rsvpUrl !== "#";
  const rsvpAttrs = !closed && hasRealRsvp
    ? `href="${escapeHtml(upcoming.rsvpUrl)}" target="_blank" rel="noopener noreferrer"`
    : `href="#" aria-disabled="true" style="opacity:0.55;pointer-events:none;"`;
  const statusText = past ? "Closed" : capacityState.isFull ? "Full" : "Open";

  el.innerHTML = `
    <article class="card event-card ink-card">
      <p class="eyebrow">Upcoming</p>
      <h2>${escapeHtml(upcoming.title)}</h2>
      <dl class="archive-ledger">
        <div class="archive-ledger-row"><dt>Date</dt><dd>${escapeHtml(formatDateLong(upcoming.date))}</dd></div>
        <div class="archive-ledger-row"><dt>Location</dt><dd>${escapeHtml(upcoming.location)}</dd></div>
        <div class="archive-ledger-row"><dt>Format</dt><dd>${escapeHtml(upcoming.format)}</dd></div>
        <div class="archive-ledger-row"><dt>Topic</dt><dd>${escapeHtml(upcoming.topic)}</dd></div>
        <div class="archive-ledger-row"><dt>Suggested Reading</dt><dd>${escapeHtml(upcoming.reading)}</dd></div>
        <div class="archive-ledger-row"><dt>Attendees</dt><dd>${escapeHtml(attendeeText)}</dd></div>
        ${capacityState.enabled ? `<div class="archive-ledger-row"><dt>Capacity</dt><dd>${escapeHtml(seatStatusText || "")}</dd></div>` : ""}
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
  // Dormant state needs no network; only fetch the sheet for a live event.
  if (!LODGE_DATA.upcoming || LODGE_DATA.upcoming.scheduled === false) {
    buildUpcomingCard({ names: [], totalAttendees: 0 });
    return;
  }
  const rows = await fetchSheetRows();
  const summary = summarizeUpcomingRows(filterRowsForUpcomingEvent(rows));
  buildUpcomingCard(summary);
}

document.addEventListener("DOMContentLoaded", renderLodgeUpcoming);
