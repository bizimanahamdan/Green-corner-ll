import { isPlaceholderText } from "./media";

const KNOWN_DUMMY_NUMBERS = new Set([
  "250700000000",
  "0000000000",
  "00000000000"
]);

export function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export function isConfirmedPhone(value) {
  if (!value || isPlaceholderText(value)) return false;
  const digits = digitsOnly(value);
  if (digits.length < 10) return false;
  if (/^0+$/.test(digits)) return false;
  if (KNOWN_DUMMY_NUMBERS.has(digits)) return false;
  return true;
}

export function isConfirmedWhatsApp(value) {
  return isConfirmedPhone(value);
}

export function isConfirmedText(value) {
  return Boolean(value && !isPlaceholderText(value) && String(value).trim());
}

export function telHref(value) {
  if (!isConfirmedPhone(value)) return null;
  return `tel:+${digitsOnly(value)}`;
}

export function whatsappHref(number, message = "") {
  if (!isConfirmedWhatsApp(number)) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digitsOnly(number)}${text}`;
}

export function parsePrice(price) {
  if (price == null) return null;
  if (isPlaceholderText(String(price))) return null;
  const n = Number(String(price).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function formatPrice(price) {
  const n = typeof price === "number" ? price : parsePrice(price);
  if (n == null) return null;
  return `RF ${n.toLocaleString("en-US")}`;
}

export function displayPrice(price) {
  return formatPrice(price) || "Ask staff";
}

export const GREEN_CORNER_MAPS_LINK = "https://maps.app.goo.gl/WCUh9TFjBn4mHRUW6";

export const GREEN_CORNER_MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5581.074783342215!2d30.04515947749625!3d-1.9739374980081856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca5c10ade3205%3A0x32acd7b0fa43e48a!2sGreen%20Corner!5e0!3m2!1sen!2srw!4v1787127910398!5m2!1sen!2srw";

export function mapsFallback(business) {
  return [business?.neighborhood, business?.city].filter(Boolean).join(", ");
}

export function mapsDirectionsHref(mapsQuery, fallback = "") {
  const value = String(mapsQuery || fallback || "").trim();
  if (!value) return GREEN_CORNER_MAPS_LINK;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
}

export function mapsEmbedSrc(mapsQuery = "") {
  const value = String(mapsQuery || "").trim();
  if (/\/maps\/embed/i.test(value)) return value;
  return GREEN_CORNER_MAP_EMBED;
}

export function kigaliTodayISO() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Kigali",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

export function instagramHref(handle) {
  if (!isConfirmedText(handle)) return null;
  const slug = String(handle).replace(/^@/, "").trim();
  if (!slug) return null;
  return `https://instagram.com/${slug}`;
}

export function buildOrderMessage({ name, phone, date, time, items, notes, language = "en" }) {
  const lines = language === "rw"
    ? [
        "Muraho Green Corner! Ndashaka gutumiza kugira nzafate ibyo natumije.",
        "",
        name ? `Amazina: ${name}` : null,
        phone ? `Telefone: ${phone}` : null,
        date || time ? `Igihe cyo kubikura: ${[date, time].filter(Boolean).join(" · ")}` : null,
        "",
        "Ibyo natumije:"
      ]
    : [
        "Hello Green Corner! I'd like to place an order for pickup.",
        "",
        name ? `Name: ${name}` : null,
        phone ? `Phone: ${phone}` : null,
        date || time ? `Pickup: ${[date, time].filter(Boolean).join(" at ")}` : null,
        "",
        "Order:"
      ];

  const itemLines = (items || []).map((item) => {
    const price = formatPrice(item.price);
    return `- ${item.qty}x ${item.name}${price ? ` (${price})` : ""}`;
  });

  const total = (items || []).reduce((sum, item) => {
    const unit = parsePrice(item.price);
    return sum + (unit == null ? 0 : unit * item.qty);
  }, 0);

  return [
    ...lines.filter((line) => line !== null),
    ...(itemLines.length ? itemLines : [language === "rw" ? "- (ntacyo cyanditswe)" : "- (no items listed yet)"]),
    total ? `\n${language === "rw" ? "Igiteranyo" : "Estimated total"}: ${formatPrice(total)}` : null,
    notes ? `\n${language === "rw" ? "Icyo nifuza" : "Notes"}: ${notes}` : null
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildBookingMessage({ name, phone, date, time, guests, occasion, notes, language = "en" }) {
  const rw = language === "rw";
  return [
    rw
      ? "Muraho Green Corner! Ndashaka gufata ameza."
      : "Hello Green Corner! I'd like to book a table.",
    "",
    name ? `${rw ? "Amazina" : "Name"}: ${name}` : null,
    phone ? `${rw ? "Telefone" : "Phone"}: ${phone}` : null,
    date || time ? `${rw ? "Igihe" : "When"}: ${[date, time].filter(Boolean).join(rw ? " · " : " at ")}` : null,
    guests ? `${rw ? "Abashyitsi" : "Guests"}: ${guests}` : null,
    occasion ? `${rw ? "Impamvu" : "Occasion"}: ${occasion}` : null,
    notes ? `${rw ? "Icyo nifuza" : "Notes"}: ${notes}` : null
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function buildBookingInquiryMessage(payload, language = "en") {
  return buildBookingMessage({
    name: payload.name,
    phone: payload.phone,
    date: payload.date,
    time: payload.time,
    guests: payload.guests,
    occasion: payload.occasion,
    notes: payload.message,
    language
  });
}
