import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Generic CRUD helper for a single Supabase table, used by every admin screen.
// Subscribes to realtime changes so two open dashboards stay in sync.
export function useAdminTable(table, { orderBy = "sort_order", ascending = true } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!supabase) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const query = supabase.from(table).select("*");
      const { data, error: fetchError } = orderBy
        ? await query.order(orderBy, { ascending })
        : await query;
      if (fetchError) {
        const missing = /schema cache|does not exist|relation|Could not find the table/i.test(fetchError.message || "");
        setError(missing ? "" : fetchError.message);
        setRows([]);
        return;
      }
      setRows(data || []);
    } catch (err) {
      setError(err.message || "Could not load this table.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [table, orderBy, ascending]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!supabase) return undefined;
    const channel = supabase
      .channel(`admin-table-${table}-${Math.random().toString(36).slice(2, 7)}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, (payload) => {
        setRows((prev) => {
          if (payload.eventType === "INSERT") {
            if (prev.some((row) => row.id === payload.new.id)) return prev;
            const next = [payload.new, ...prev];
            if (!orderBy) return next;
            return [...next].sort((a, b) => {
              const av = a[orderBy];
              const bv = b[orderBy];
              if (av === bv) return 0;
              if (av == null) return 1;
              if (bv == null) return -1;
              if (av > bv) return ascending ? 1 : -1;
              return ascending ? -1 : 1;
            });
          }
          if (payload.eventType === "UPDATE") {
            return prev.map((row) => (row.id === payload.new.id ? payload.new : row));
          }
          if (payload.eventType === "DELETE") {
            return prev.filter((row) => row.id !== payload.old.id);
          }
          return prev;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, orderBy, ascending]);

  const insert = async (values) => {
    const { error: insertError } = await supabase.from(table).insert([values]);
    if (insertError) throw insertError;
    await refresh();
  };

  const update = async (id, values) => {
    const { error: updateError } = await supabase.from(table).update(values).eq("id", id);
    if (updateError) throw updateError;
    await refresh();
  };

  const remove = async (id) => {
    const { error: deleteError } = await supabase.from(table).delete().eq("id", id);
    if (deleteError) throw deleteError;
    await refresh();
  };

  return { rows, loading, error, refresh, insert, update, remove };
}
