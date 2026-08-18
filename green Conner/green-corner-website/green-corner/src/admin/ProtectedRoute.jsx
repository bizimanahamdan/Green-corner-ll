import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { isSupabaseConfigured } from "../lib/supabaseClient";

function Shell({ children }) {
  return (
    <div data-theme="dark" style={{ minHeight: "100vh", background: "#0b0a08", color: "#efe7d6" }} className="flex items-center justify-center p-6">
      {children}
    </div>
  );
}

export default function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <Shell>
        <div className="max-w-md text-center admin-card p-8">
          <h1 className="font-display text-xl font-semibold mb-3">Admin not connected yet</h1>
          <p className="text-sm text-cream/60">
            Add <code className="text-ember-400">VITE_SUPABASE_URL</code> and{" "}
            <code className="text-ember-400">VITE_SUPABASE_ANON_KEY</code> in Netlify, then redeploy.
          </p>
        </div>
      </Shell>
    );
  }

  if (loading) {
    return (
      <Shell>
        <p className="text-cream/70">Loading admin…</p>
      </Shell>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
