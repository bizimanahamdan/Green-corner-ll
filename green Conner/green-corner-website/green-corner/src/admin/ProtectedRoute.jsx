import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { isSupabaseConfigured } from "../lib/supabaseClient";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-char-950 text-cream flex items-center justify-center p-6">
        <div className="max-w-md text-center admin-card p-8">
          <h1 className="font-display text-xl font-semibold mb-3">Admin not connected yet</h1>
          <p className="text-sm text-cream/60">
            The admin dashboard needs Supabase to be connected. Add <code className="text-ember-400">VITE_SUPABASE_URL</code> and{" "}
            <code className="text-ember-400">VITE_SUPABASE_ANON_KEY</code> to your <code className="text-ember-400">.env</code> file,
            then run the migration in <code className="text-ember-400">supabase/schema.sql</code>.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-char-950 text-cream flex items-center justify-center">
        <p className="text-cream/50">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
