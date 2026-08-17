// Our bundled placeholder graphics all live under /images/illustrations/.
// Real photos (uploaded via the admin dashboard, or any external URL) should
// fill their container; flat illustrations look better contained with padding
// so they don't get stretched or cropped oddly.
export function isIllustration(url) {
  return typeof url === "string" && url.includes("/images/illustrations/");
}

// Sample/demo data uses a "PLACEHOLDER — ..." prefix internally so the admin
// and developer always know which fields still need real content from the
// business owner. Customers must never see that literal text. Use this to
// check a field before rendering it, and fall back to omitting the field
// entirely rather than showing raw placeholder copy.
export function isPlaceholderText(value) {
  return typeof value === "string" && value.trim().toUpperCase().startsWith("PLACEHOLDER");
}

// Strips a "PLACEHOLDER — " prefix for admin-only contexts where we still
// want to show the sample text, just without the loud label.
export function stripPlaceholderPrefix(value) {
  if (!isPlaceholderText(value)) return value;
  return value.replace(/^PLACEHOLDER\s*[—-]\s*/i, "");
}
