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
