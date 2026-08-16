import { useState, useEffect } from "react";
import { useAdminTable } from "./useAdminTable";

export default function AdminHours() {
  const hours = useAdminTable("hours", { orderBy: "sort_order" });
  const [draft, setDraft] = useState([]);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(hours.rows);
  }, [hours.rows]);

  const updateRow = (id, field, value) => {
    setDraft((d) => d.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const saveAll = async () => {
    setBusy(true);
    setSaved(false);
    for (const row of draft) {
      await hours.update(row.id, { open: row.open, close: row.close, note: row.note || "" });
    }
    setBusy(false);
    setSaved(true);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Opening Hours</h1>
      <div className="admin-card p-6 max-w-2xl">
        <div className="space-y-3">
          {draft.map((row) => (
            <div key={row.id} className="grid grid-cols-3 gap-2 items-center">
              <span className="text-sm">{row.day}</span>
              <input
                value={row.open}
                onChange={(e) => updateRow(row.id, "open", e.target.value)}
                className="rounded-lg bg-char-950 border border-cream/15 px-3 py-2 text-sm"
              />
              <input
                value={row.close}
                onChange={(e) => updateRow(row.id, "close", e.target.value)}
                className="rounded-lg bg-char-950 border border-cream/15 px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
        <button onClick={saveAll} disabled={busy} className="btn-primary mt-6">
          {busy ? "Saving…" : "Save Hours"}
        </button>
        {saved && <p className="text-sm text-corner-200 mt-2">Saved.</p>}
      </div>
    </div>
  );
}
