// Works out whether the business is open right now, based on the hours list
// (same shape as demoData.hours / the `hours` table: { day, open, close }).
// Handles close times past midnight and all-day closed rows.

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseTimeToMinutes(time) {
  if (!time || /closed/i.test(time)) return null;
  const match = /(\d+):(\d+)\s*(AM|PM)/i.exec(time);
  if (!match) return null;
  let [, h, m, period] = match;
  h = parseInt(h, 10);
  m = parseInt(m, 10);
  if (/PM/i.test(period) && h !== 12) h += 12;
  if (/AM/i.test(period) && h === 12) h = 0;
  return h * 60 + m;
}

function isClosedValue(value) {
  return typeof value === "string" && /closed/i.test(value);
}

export function getOpenStatus(hours, now = new Date()) {
  if (!Array.isArray(hours) || hours.length === 0) return { known: false };

  const todayName = DAY_NAMES[now.getDay()];
  const today = hours.find((h) => h.day === todayName);
  if (!today) return { known: false };

  if (isClosedValue(today.open) || isClosedValue(today.close)) {
    return { known: true, isOpen: false, closedAllDay: true, closeTime: null, openTime: today.open };
  }

  const openMin = parseTimeToMinutes(today.open);
  const closeMin = parseTimeToMinutes(today.close);
  if (openMin === null || closeMin === null) return { known: false };

  const nowMin = now.getHours() * 60 + now.getMinutes();
  const closesPastMidnight = closeMin <= openMin;

  const isOpen = closesPastMidnight
    ? nowMin >= openMin || nowMin < closeMin
    : nowMin >= openMin && nowMin < closeMin;

  return { known: true, isOpen, closedAllDay: false, closeTime: today.close, openTime: today.open };
}
