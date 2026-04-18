/*
  AXIS MUNDI SOCIETY REGISTER
  ---------------------------
  DURABLE ARCHITECTURE
  One reusable Google Form + one master Google Sheet + eventKey filtering

  WHAT THIS VERSION ADDS
  ----------------------
  - capacity limit display for upcoming event
  - RSVP closes automatically when:
      1. event date has passed, or
      2. capacity has been reached
  - attendee count remains live for upcoming event
  - archive remains manual/static for historical integrity

  REQUIRED GOOGLE FORM FIELDS
  ---------------------------
    eventKey
    Email
    Name
    No. of attendees
    Questions/Notes

  REQUIRED SHEET HEADERS
  ----------------------
    Timestamp,eventKey,Email,Name,No. of attendees,Questions/Notes
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
}

  attendeeDisplayMode: "count"
};

const AMS_DATA = {
  seriesTitle: "Axis Mundi Society Proceedings",
  registerStatus: "Open register",

  upcoming: {
    title: "Session II — Kings and Queens",
    date: "2026-05-16",
    eventKey: "ams-2026-05-16",
    location: "Beech Residence / To be confirmed",
    format: "Open discussion",
    topic:
      "What remains necessary in inherited religious order once one has discovered more organic modes of being?",
    reading: "Suggested Reading: Iron John by Robert Bly",

    /*
      Set capacity to a number to enable capacity display.
      Set capacity to null to disable it.
    */
    capacity: null,

    /*
      Replace this with the PREFILLED Google Form URL for THIS event.
      The prefilled form should already contain:
        eventKey = ams-2026-05-16
    */
    rsvpUrl: "https://docs.google.com/forms/d/e/1FAIpQLScqq-wtybruOtKTV5Khf8jfltQhG_sukFfl8JNDfuBW-F02Ng/viewform?usp=pp_url&entry.1051735444=ams-2026-05-16",
  },

  registerStandard: {
    recordNo:
      "Accession numbers are generated automatically by year: AMS-2026-001, AMS-2026-002, and so on.",
    include:
      "Date, location, attendees, topic, assigned reading, and notes worth revisiting.",
    aim:
      "Let the archive carry continuity so the Society accumulates rather than merely recurs.",
    readings:
      "Keep assigned selections short enough that a first-time guest can still enter intelligently.",
    flow:
      "One reusable Google Form → one master Google Sheet → filtered by eventKey."
  },

  records: [
    {
      date: "2026-03-28",
      location: "Beech Residence",
      staticAttendees: "Founding group",
      topic: "The Paths Forward",
      filed: "Initial gathering",
      notes: ["Minutes of gathering to add later"]
    }
  ]
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function padNumber(value) {
  return String(value).padStart(3, "0");
}

function formatDateLong(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function getYearFromISO(isoDate) {
  return Number(String(isoDate).slice(0, 4));
}

function compareISOAsc(a, b) {
  return a.date.localeCompare(b.date);
}

function compareYearDesc(a, b) {
  return b - a;
}

function normalizeRecords(records) {
  const byYear = new Map();

  records.forEach((record) => {
    const normalized = {
      ...record,
      year: getYearFromISO(record.date)
    };

    if (!byYear.has(normalized.year)) {
      byYear.set(normalized.year, []);
    }

    byYear.get(normalized.year).push(normalized);
  });

  const normalizedRecords = [];

  Array.from(byYear.keys())
    .sort(compareYearDesc)
    .forEach((year) => {
      const yearRecords = byYear.get(year).sort(compareISOAsc);

      yearRecords.forEach((record, index) => {
        normalizedRecords.push({
          ...record,
          recordNo: `AMS-${year}-${padNumber(index + 1)}`
        });
      });
    });

  return normalizedRecords;
}

function groupRecordsByYear(records) {
  const grouped = {};

  records.forEach((record) => {
    if (!grouped[record.year]) {
      grouped[record.year] = [];
    }
    grouped[record.year].push(record);
  });

  return grouped;
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function parseCsv(text) {
  const rows = [];
  let current = "";
  let inQuotes = false;
  const lines = [];

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (current.trim() !== "") {
        lines.push(current);
      }
      current = "";

      if (char === "\r" && next === "\n") {
        i += 1;
      }
    } else {
      current += char;
    }
  }

  if (current.trim() !== "") {
    lines.push(current);
  }

  if (!lines.length) return rows;

  const headers = parseCsvLine(lines[0]).map((header) => header.trim());

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCsvLine(lines[i]);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = (values[index] || "").trim();
    });

    rows.push(row);
  }

  return rows;
}

function toPositiveInt(value) {
  const numeric = parseInt(String(value || "").trim(), 10);
  if (Number.isNaN(numeric) || numeric < 1) return 0;
  return numeric;
}

function titleCaseName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((part) => {
      if (!part) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function uniqueNames(names) {
  const seen = new Set();
  const result = [];

  names.forEach((name) => {
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(name);
    }
  });

  return result;
}

function isEventPast(dateStr) {
  const now = new Date();
  const eventDate = new Date(`${dateStr}T23:59:59`);
  return now > eventDate;
}

async function fetchSheetRows() {
  if (!RSVP_SHEET.enabled || !RSVP_SHEET.csvUrl) {
    return [];
  }

  try {
    const response = await fetch(RSVP_SHEET.csvUrl, {
      method: "GET",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Sheet request failed with ${response.status}`);
    }

    const csvText = await response.text();
    return parseCsv(csvText);
  } catch (error) {
    console.error("AMS RSVP sheet fetch failed:", error);
    return [];
  }
}

function filterRowsForUpcomingEvent(rows) {
  const eventKeyColumn = RSVP_SHEET.columns.eventKey;
  const currentEventKey = String(AMS_DATA.upcoming.eventKey || "").trim();

  if (!currentEventKey) return [];

  return rows.filter((row) => {
    return String(row[eventKeyColumn] || "").trim() === currentEventKey;
  });
}

function summarizeUpcomingRows(rows) {
  const nameColumn = RSVP_SHEET.columns.name;
  const attendeeCountColumn = RSVP_SHEET.columns.attendeeCount;

  const names = [];
  let totalAttendees = 0;

  rows.forEach((row) => {
    const rawName = row[nameColumn];
    const rawCount = row[attendeeCountColumn];

    const name = titleCaseName(rawName || "");
    const attendeeCount = toPositiveInt(rawCount);

    if (name) {
      names.push(name);
    }

    totalAttendees += attendeeCount;
  });

  return {
    names: uniqueNames(names).sort((a, b) => a.localeCompare(b)),
    totalAttendees
  };
}

function formatUpcomingAttendeeDisplay(summary) {
  if (RSVP_SHEET.attendeeDisplayMode === "names") {
    if (!summary.names.length) return "No registrations yet.";
    return summary.names.join(", ");
  }

  if (!summary.totalAttendees) return "No registrations yet.";
  if (summary.totalAttendees === 1) return "1 registered";

  return `${summary.totalAttendees} registered`;
}

function getCapacityState(summary) {
  const capacity = AMS_DATA.upcoming.capacity;

  if (capacity == null || Number.isNaN(Number(capacity)) || Number(capacity) < 1) {
    return {
      enabled: false,
      capacity: null,
      total: summary.totalAttendees,
      remaining: null,
      isFull: false,
      display: null
    };
  }

  const safeCapacity = Number(capacity);
  const total = summary.totalAttendees;
  const remaining = Math.max(safeCapacity - total, 0);
  const isFull = total >= safeCapacity;

  let display = `${total} / ${safeCapacity} registered`;

  if (isFull) {
    display = `${safeCapacity} / ${safeCapacity} registered · Full`;
  }

  return {
    enabled: true,
    capacity: safeCapacity,
    total,
    remaining,
    isFull,
    display
  };
}

function getSeatStatusText(capacityState) {
  if (!capacityState.enabled) return null;
  if (capacityState.isFull) return "Capacity reached.";

  if (capacityState.remaining === 1) {
    return "1 seat remaining.";
  }

  return `${capacityState.remaining} seats remaining.`;
}

function buildUpcomingCard(upcomingSummary) {
  const upcoming = AMS_DATA.upcoming;
  const upcomingEl = document.querySelector("[data-ams-upcoming]");
  if (!upcomingEl) return;

  const past = isEventPast(upcoming.date);
  const capacityState = getCapacityState(upcomingSummary);
  const closedByCapacity = capacityState.isFull;
  const closed = past || closedByCapacity;

  const attendeeText = capacityState.enabled
    ? capacityState.display
    : formatUpcomingAttendeeDisplay(upcomingSummary);

  const seatStatusText = getSeatStatusText(capacityState);

  const hasRealRsvp = upcoming.rsvpUrl && upcoming.rsvpUrl !== "#";
  const rsvpAttrs = !closed && hasRealRsvp
    ? `href="${escapeHtml(upcoming.rsvpUrl)}" target="_blank" rel="noopener noreferrer"`
    : `href="#" aria-disabled="true" style="opacity:0.55;pointer-events:none;"`;

  let statusText = "Open";
  if (past) {
    statusText = "Closed";
  } else if (closedByCapacity) {
    statusText = "Full";
  }

  upcomingEl.innerHTML = `
    <article class="card event-card ink-card">
      <p class="eyebrow">Upcoming</p>
      <h2>${escapeHtml(upcoming.title)}</h2>

      <dl class="archive-ledger">
        <div class="archive-ledger-row">
          <dt>Date</dt>
          <dd>${escapeHtml(formatDateLong(upcoming.date))}</dd>
        </div>
        <div class="archive-ledger-row">
          <dt>Location</dt>
          <dd>${escapeHtml(upcoming.location)}</dd>
        </div>
        <div class="archive-ledger-row">
          <dt>Format</dt>
          <dd>${escapeHtml(upcoming.format)}</dd>
        </div>
        <div class="archive-ledger-row">
          <dt>Topic</dt>
          <dd>${escapeHtml(upcoming.topic)}</dd>
        </div>
        <div class="archive-ledger-row">
          <dt>Suggested Reading</dt>
          <dd>${escapeHtml(upcoming.reading)}</dd>
        </div>
        <div class="archive-ledger-row">
          <dt>Attendees</dt>
          <dd>${escapeHtml(attendeeText)}</dd>
        </div>
        ${
          capacityState.enabled
            ? `
        <div class="archive-ledger-row">
          <dt>Capacity</dt>
          <dd>${escapeHtml(
            seatStatusText || `${capacityState.capacity} seats available.`
          )}</dd>
        </div>
        `
            : ""
        }
        <div class="archive-ledger-row">
          <dt>Status</dt>
          <dd>${escapeHtml(statusText)}</dd>
        </div>
      </dl>

      <div class="button-row">
        <a class="button" ${rsvpAttrs}>
          ${
            past
              ? "RSVP Closed"
              : closedByCapacity
              ? "Event Full"
              : "RSVP"
          }
        </a>
      </div>
    </article>
  `;
}

function buildRegisterStandardCard() {
  const standard = AMS_DATA.registerStandard;
  const standardEl = document.querySelector("[data-ams-standard]");
  if (!standardEl) return;

  standardEl.innerHTML = `
    <article class="card event-card record-standard-card ink-card">
      <p class="eyebrow">Register standard</p>

      <dl class="archive-ledger">
        <div class="archive-ledger-row">
          <dt>Record no.</dt>
          <dd>${escapeHtml(standard.recordNo)}</dd>
        </div>
        <div class="archive-ledger-row">
          <dt>Include</dt>
          <dd>${escapeHtml(standard.include)}</dd>
        </div>
        <div class="archive-ledger-row">
          <dt>Aim</dt>
          <dd>${escapeHtml(standard.aim)}</dd>
        </div>
        <div class="archive-ledger-row">
          <dt>Readings</dt>
          <dd>${escapeHtml(standard.readings)}</dd>
        </div>
        <div class="archive-ledger-row">
          <dt>RSVP flow</dt>
          <dd>${escapeHtml(standard.flow)}</dd>
        </div>
      </dl>
    </article>
  `;
}

function buildRegisterIndex(records) {
  const indexEl = document.querySelector("[data-ams-register-index]");
  if (!indexEl) return;

  const years = Array.from(new Set(records.map((record) => record.year))).sort(compareYearDesc);
  const currentYear = years[0] || getYearFromISO(AMS_DATA.upcoming.date);

  indexEl.innerHTML = `
    <div class="register-index card ink-card">
      <p class="eyebrow">Index</p>
      <div class="register-index-grid">
        <p><strong>Series</strong><span>${escapeHtml(AMS_DATA.seriesTitle)}</span></p>
        <p><strong>Current year</strong><span>${escapeHtml(currentYear)}</span></p>
        <p><strong>Records entered</strong><span>${escapeHtml(records.length)}</span></p>
        <p><strong>Status</strong><span>${escapeHtml(AMS_DATA.registerStatus)}</span></p>
      </div>
    </div>
  `;
}

function buildYearNav(groupedRecords) {
  const yearNavEl = document.querySelector("[data-ams-year-nav]");
  if (!yearNavEl) return;

  const years = Object.keys(groupedRecords)
    .map(Number)
    .sort(compareYearDesc);

  if (!years.length) {
    yearNavEl.innerHTML = "";
    return;
  }

  yearNavEl.innerHTML = `
    <div class="register-index card ink-card" style="margin-bottom: 1rem;">
      <p class="eyebrow">Years</p>
      <div class="button-row" style="padding-top: 0;">
        ${years
          .map(
            (year) =>
              `<a class="button" href="#ams-year-${year}" style="margin-right: 0.55rem; margin-bottom: 0.55rem;">${year}</a>`
          )
          .join("")}
      </div>
    </div>
  `;
}

function buildRegisterYears(groupedRecords) {
  const yearsEl = document.querySelector("[data-ams-register-years]");
  if (!yearsEl) return;

  const years = Object.keys(groupedRecords)
    .map(Number)
    .sort(compareYearDesc);

  yearsEl.innerHTML = years
    .map((year) => {
      const entries = groupedRecords[year]
        .sort(compareISOAsc)
        .map((record) => {
          const notesHtml = record.notes
            .map((note) => `<p>${escapeHtml(note)}</p>`)
            .join("");

          return `
            <article class="archive-entry recorded-entry ink-card">
              <div class="archive-meta archive-meta-formal">
                <p><strong>Record no.</strong><span>${escapeHtml(record.recordNo)}</span></p>
                <p><strong>Date</strong><span>${escapeHtml(formatDateLong(record.date))}</span></p>
                <p><strong>Location</strong><span>${escapeHtml(record.location)}</span></p>
                <p><strong>Attendees</strong><span>${escapeHtml(record.staticAttendees || "Not recorded")}</span></p>
                <p><strong>Topic</strong><span>${escapeHtml(record.topic)}</span></p>
                <p><strong>Filed</strong><span>${escapeHtml(record.filed)}</span></p>
              </div>

              <div class="archive-notes archive-notes-recorded">
                <div class="record-heading">
                  <p class="record-type">Proceedings</p>
                  <h3>Minutes / Notes</h3>
                </div>
                ${notesHtml}
              </div>
            </article>
          `;
        })
        .join("");

      return `
        <section class="archive-year" id="ams-year-${year}">
          <div class="archive-year-heading">
            <p class="archive-year-label">Register Year</p>
            <h3>${escapeHtml(year)}</h3>
          </div>
          ${entries}
        </section>
      `;
    })
    .join("");
}

async function renderAMSRegister() {
  const normalizedRecords = normalizeRecords(AMS_DATA.records);
  const groupedRecords = groupRecordsByYear(normalizedRecords);

  const rows = await fetchSheetRows();
  const filteredRows = filterRowsForUpcomingEvent(rows);
  const upcomingSummary = summarizeUpcomingRows(filteredRows);

  buildUpcomingCard(upcomingSummary);
  buildRegisterStandardCard();
  buildRegisterIndex(normalizedRecords);
  buildYearNav(groupedRecords);
  buildRegisterYears(groupedRecords);
}

document.addEventListener("DOMContentLoaded", renderAMSRegister);