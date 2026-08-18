import { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      return { error: { message: "Supabase is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env" } };
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error: { message: error?.message || "Failed to reach Supabase." } };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
