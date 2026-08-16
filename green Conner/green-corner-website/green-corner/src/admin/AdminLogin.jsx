import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
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
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) setError(signInError.message);
  };

  return (
    <div className="min-h-screen bg-char-950 text-cream flex items-center justify-center p-6">
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
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg bg-char-950 border border-cream/15 px-3 py-2 text-sm outline-none focus:border-ember-400"
          />
        </div>
        <div>
          <label className="text-sm text-cream/70" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg bg-char-950 border border-cream/15 px-3 py-2 text-sm outline-none focus:border-ember-400"
          />
        </div>

        {error && <p className="text-sm text-ember-400">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
