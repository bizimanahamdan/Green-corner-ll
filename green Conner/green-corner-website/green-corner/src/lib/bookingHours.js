import { kigaliTodayISO } from "./business";

export { kigaliTodayISO };

export const KIGALI_TZ = "Africa/Kigali";
const SLOT_MINUTES = 30;
const HORIZON_DAYS = 21;

export function kigaliClock(now = new Date()) {
  const parts = {};
  for (const part of new Intl.DateTimeFormat("en-US", {
    timeZone: KIGALI_TZ,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(now)) {
    if (part.type !== "literal") parts[part.type] = part.value;
  }
  return {
    weekday: parts.weekday,
    iso: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute)
  };
}

export function addDaysISO(iso, days) {
  const [year, month, day] = String(iso).split("-").map(Number);
  if (!year || !month || !day) return iso;
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
}

export function weekdayFromISO(iso) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: KIGALI_TZ,
    weekday: "long"
  }).format(new Date(`${iso}T12:00:00+02:00`));
}

export function shortDateLabel(iso) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: KIGALI_TZ,
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(new Date(`${iso}T12:00:00+02:00`));
}

export function parseClockToMinutes(value) {
  if (!value || typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw || /^closed$/i.test(raw)) return null;

  const ampm = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i.exec(raw);
  if (ampm) {
    let hour = Number(ampm[1]);
    const minute = Number(ampm[2] || 0);
    const period = ampm[3].toUpperCase();
    if (hour > 12 || minute > 59) return null;
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour * 60 + minute;
  }

  const h24 = /^(\d{1,2}):(\d{2})$/.exec(raw);
  if (h24) {
    const hour = Number(h24[1]);
    const minute = Number(h24[2]);
    if (hour > 23 || minute > 59) return null;
    return hour * 60 + minute;
  }

  return null;
}

export function minutesToHHMM(mins) {
  const wrapped = ((mins % 1440) + 1440) % 1440;
  const hour = Math.floor(wrapped / 60);
  const minute = wrapped % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatSlotLabel(hhmm) {
  const [hour, minute] = String(hhmm).split(":").map(Number);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export function hoursArePosted(hours) {
  return Array.isArray(hours) && hours.some((row) => {
    const open = parseClockToMinutes(row.open);
    const close = parseClockToMinutes(row.close);
    return open != null && close != null;
  });
}

function isClosedRow(row) {
  if (!row) return true;
  if (/closed/i.test(String(row.open || "")) || /closed/i.test(String(row.close || ""))) return true;
  return parseClockToMinutes(row.open) == null || parseClockToMinutes(row.close) == null;
}

export function dayWindow(hours, iso) {
  if (!hoursArePosted(hours)) return { status: "none" };
  const row = (hours || []).find((item) => item.day === weekdayFromISO(iso));
  if (!row) return { status: "unknown" };
  if (isClosedRow(row)) return { status: "closed", day: row.day };
  const openMin = parseClockToMinutes(row.open);
  const closeMin = parseClockToMinutes(row.close);
  return {
    status: "open",
    day: row.day,
    open: row.open,
    close: row.close,
    openMin,
    closeMin,
    overnight: closeMin <= openMin
  };
}

function slotsFromRange(startMin, endMin) {
  const slots = [];
  for (let cursor = startMin; cursor < endMin; cursor += SLOT_MINUTES) {
    slots.push(minutesToHHMM(cursor));
  }
  return slots;
}

export function hoursSlotsForDate(hours, iso) {
  const window = dayWindow(hours, iso);
  const slots = [];
  if (window.status === "open") {
    const end = window.overnight ? window.closeMin + 1440 : window.closeMin;
    slots.push(...slotsFromRange(window.openMin, end));
  }
  return [...new Set(slots)].sort();
}

export function timeSlotsForDate(hours, iso, now = new Date()) {
  const clock = kigaliClock(now);
  const today = clock.iso;
  if (!iso || iso < today) return [];

  const window = dayWindow(hours, iso);
  const slots = [];

  if (window.status === "open") {
    const end = window.overnight ? window.closeMin + 1440 : window.closeMin;
    slots.push(...slotsFromRange(window.openMin, end));
  }

  if (iso === today) {
    const prev = dayWindow(hours, addDaysISO(iso, -1));
    if (prev.status === "open" && prev.overnight && clock.minutes < prev.closeMin) {
      slots.push(...slotsFromRange(0, prev.closeMin));
    }
  }

  const unique = [...new Set(slots)].sort();
  if (iso !== today) return unique;

  return unique.filter((slot) => {
    const [hour, minute] = slot.split(":").map(Number);
    return hour * 60 + minute > clock.minutes;
  });
}

export function listBookableDates(hours, now = new Date()) {
  if (!hoursArePosted(hours)) return [];
  const today = kigaliTodayISO();
  const dates = [];
  for (let i = 0; i < HORIZON_DAYS; i += 1) {
    const iso = addDaysISO(today, i);
    const slots = timeSlotsForDate(hours, iso, now);
    if (!slots.length) continue;
    const window = dayWindow(hours, iso);
    dates.push({
      iso,
      weekday: weekdayFromISO(iso),
      label: shortDateLabel(iso),
      isToday: iso === today,
      slots,
      window
    });
  }
  return dates;
}

export function clampDateToTodayOrLater(value) {
  const today = kigaliTodayISO();
  if (!value || value < today) return today;
  return value;
}

export function bookingSelectionError(hours, date, time, now = new Date()) {
  const today = kigaliTodayISO();
  if (!hoursArePosted(hours)) return "noHours";
  if (!date) return "needDetails";
  if (date < today) return "pastDate";
  const window = dayWindow(hours, date);
  if (window.status === "closed" || window.status === "unknown") return "closedDay";
  const slots = timeSlotsForDate(hours, date, now);
  if (!slots.length) return "noSlots";
  if (!time) return "needTime";
  if (!slots.includes(time)) return "outsideHours";
  return null;
}
