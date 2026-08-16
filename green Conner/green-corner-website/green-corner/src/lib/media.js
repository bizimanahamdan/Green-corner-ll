// Our bundled placeholder graphics all live under /images/illustrations/.
// Real photos (uploaded via the admin dashboard, or any external URL) should
// fill their container; flat illustrations look better contained with padding
// so they don't get stretched or cropped oddly.
export function isIllustration(url) {
  return typeof url === "string" && url.includes("/images/illustrations/");
}
