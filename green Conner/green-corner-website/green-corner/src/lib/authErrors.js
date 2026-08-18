export function explainAuthError(error) {
  const raw = (error?.message || "").toLowerCase();
  if (!raw) return "Sign-in failed. Check the email and password, then try again.";

  if (raw.includes("not connected") || raw.includes("vite_supabase")) {
    return "This deploy is not connected to Supabase. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify, then trigger a new deploy.";
  }
  if (raw.includes("invalid login") || raw.includes("invalid credentials")) {
    return "That email or password is not a Supabase Auth user. In Supabase go to Authentication → Users → Add user, tick Auto Confirm User, then use that email and password here.";
  }
  if (raw.includes("email not confirmed")) {
    return "This account exists but the email is not confirmed. Open the user in Authentication → Users and confirm it, or add the user again with Auto Confirm User ticked.";
  }
  if (raw.includes("user not found")) {
    return "No Auth user exists for that email. Create one in Supabase → Authentication → Users. The dashboard login is not your Supabase account password.";
  }
  if (raw.includes("too many requests") || raw.includes("rate limit")) {
    return "Too many sign-in attempts. Wait a minute and try again.";
  }
  if (raw.includes("fetch") || raw.includes("network") || raw.includes("failed to fetch")) {
    return "The browser could not reach Supabase. Check the project URL, that the project is not paused, and that this site is allowed under Authentication → URL configuration.";
  }
  return error.message;
}
