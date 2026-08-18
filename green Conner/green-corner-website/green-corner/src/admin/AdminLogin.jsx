import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import SEO from "../components/SEO";

function loginErrorMessage(error) {
  const raw = (error?.message || "").toLowerCase();
  if (raw.includes("invalid login") || raw.includes("invalid credentials") || raw.includes("user not found")) {
    return "Incorrect email or password.";
  }
  if (raw.includes("email not confirmed")) {
    return "This account is not confirmed yet.";
  }
  if (raw.includes("too many requests") || raw.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (raw.includes("fetch") || raw.includes("network") || raw.includes("failed to fetch") || raw.includes("not connected")) {
    return "Could not sign in right now. Please try again.";
  }
  return "Could not sign in. Check your email and password.";
}

export default function AdminLogin() {
  const { session, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (session) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: signInError } = await signIn(email.trim(), password);
      if (signInError) setError(loginErrorMessage(signInError));
    } catch (err) {
      setError(loginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-theme="dark" className="min-h-screen bg-[#0b0a08] text-cream flex items-center justify-center p-6">
      <SEO title="Admin Login" path="/admin/login" noindex />
      <form onSubmit={handleSubmit} className="w-full max-w-sm admin-card p-8 space-y-4">
        <div className="text-center mb-2">
          <p className="font-display text-2xl font-semibold">
            <span className="text-ember-400">Green</span> Corner
          </p>
          <p className="text-sm text-cream/50 mt-1">Admin dashboard</p>
        </div>

        <div>
          <label className="text-sm text-cream/70" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg bg-[#0b0a08] border border-cream/15 px-3 py-2 text-sm outline-none focus:border-ember-400"
          />
        </div>
        <div>
          <label className="text-sm text-cream/70" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg bg-[#0b0a08] border border-cream/15 px-3 py-2 text-sm outline-none focus:border-ember-400"
          />
        </div>

        {error && <p className="text-sm text-ember-400" role="alert">{error}</p>}

        <button type="submit" disabled={loading || !isSupabaseConfigured} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
