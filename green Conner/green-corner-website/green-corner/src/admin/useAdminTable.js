import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Generic CRUD helper for a single Supabase table, used by every admin screen.
export function useAdminTable(table, { orderBy = "sort_order", ascending = true } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    const query = supabase.from(table).select("*");
    const { data, error: fetchError } = orderBy
      ? await query.order(orderBy, { ascending })
      : await query;
    if (fetchError) setError(fetchError.message);
    setRows(data || []);
    setLoading(false);
  }, [table, orderBy, ascending]);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
