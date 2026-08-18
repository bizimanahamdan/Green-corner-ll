import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { explainAuthError } from "../lib/authErrors";
import SEO from "../components/SEO";

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
      if (signInError) setError(explainAuthError(signInError));
    } catch (err) {
      setError(explainAuthError(err));
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

        <p className={`text-xs text-center rounded-full px-3 py-1 ${isSupabaseConfigured ? "bg-leaf-500/15 text-leaf-300" : "bg-ember-500/15 text-ember-300"}`}>
          {isSupabaseConfigured ? "Supabase is connected" : "Supabase keys are missing on this deploy"}
        </p>

        {!isSupabaseConfigured && (
          <p className="text-sm text-cream/60">
            In Netlify → Site settings → Environment variables, add{" "}
            <code className="text-ember-400">VITE_SUPABASE_URL</code> and{" "}
            <code className="text-ember-400">VITE_SUPABASE_ANON_KEY</code>, then
            trigger a new deploy. Vite only reads those keys at build time.
          </p>
        )}

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

        <p className="text-xs text-cream/45 leading-relaxed">
          Use a user from Supabase → Authentication → Users, not the Supabase
          dashboard password. When adding the user, tick Auto Confirm User.
        </p>
      </form>
    </div>
  );
}
