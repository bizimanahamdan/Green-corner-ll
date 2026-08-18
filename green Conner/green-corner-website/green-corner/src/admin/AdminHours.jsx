import { useState, useEffect } from "react";
import { useAdminTable } from "./useAdminTable";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AdminHours() {
  const hours = useAdminTable("hours", { orderBy: "sort_order" });
  const [draft, setDraft] = useState([]);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    setDraft(hours.rows);
  }, [hours.rows]);

  const updateRow = (id, field, value) => {
    setDraft((d) => d.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const seedWeek = async () => {
    setBusy(true);
    setErr("");
    try {
      for (let i = 0; i < DAYS.length; i += 1) {
        await hours.insert({ day: DAYS[i], open: "11:00 AM", close: "11:00 PM", sort_order: i + 1 });
      }
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  const saveAll = async () => {
    setBusy(true);
    setSaved(false);
    setErr("");
    try {
      for (const row of draft) {
        await hours.update(row.id, { open: row.open, close: row.close, note: row.note || "" });
      }
      setSaved(true);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-2">Opening Hours</h1>
      <p className="text-sm text-cream/50 mb-6">
        Hours stay hidden on the public site until you add them here. Use 12-hour times like 11:00 AM.
        Type Closed in both fields for a day off.
      </p>
      <div className="admin-card p-6 max-w-2xl">
        {draft.length === 0 && !hours.loading && (
          <div className="mb-6">
            <p className="text-sm text-cream/60 mb-3">No hours yet. Add a full week to start, then edit the times.</p>
            <button onClick={seedWeek} disabled={busy} className="admin-btn-outline">
              {busy ? "Adding…" : "Add a 7-day template"}
            </button>
          </div>
        )}
        <div className="space-y-3">
          {draft.map((row) => (
            <div key={row.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              <span className="text-sm">{row.day}</span>
              <input
                value={row.open}
                onChange={(e) => updateRow(row.id, "open", e.target.value)}
                className="rounded-lg bg-char-950 border border-cream/15 px-3 py-2 text-sm"
                aria-label={`${row.day} opens`}
              />
              <input
                value={row.close}
                onChange={(e) => updateRow(row.id, "close", e.target.value)}
                className="rounded-lg bg-char-950 border border-cream/15 px-3 py-2 text-sm"
                aria-label={`${row.day} closes`}
              />
            </div>
          ))}
        </div>
        {draft.length > 0 && (
          <button onClick={saveAll} disabled={busy} className="btn-primary mt-6">
            {busy ? "Saving…" : "Save Hours"}
          </button>
        )}
        {saved && <p className="text-sm text-corner-200 mt-2">Saved.</p>}
        {err && <p className="text-sm text-ember-400 mt-2">{err}</p>}
      </div>
    </div>
  );
}
