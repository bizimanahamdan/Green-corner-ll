import { useAdminTable } from "./useAdminTable";

const statusColors = {
  new: "text-ember-400",
  confirmed: "text-corner-200",
  cancelled: "text-cream/40"
};

export default function AdminBookings() {
  const { rows, loading, error, update, remove } = useAdminTable("table_bookings", {
    orderBy: "created_at",
    ascending: false
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-2">Table bookings</h1>
      <p className="text-sm text-cream/50 mb-6">
        These are requests, not locked seats. Confirm by phone or WhatsApp before holding the table.
      </p>
      {loading && <p className="text-cream/50">Loading…</p>}
      {error && <p className="text-sm text-ember-400 mb-4">{error}</p>}
      {!loading && !error && rows.length === 0 && (
        <p className="text-cream/50">No table requests yet.</p>
      )}

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="admin-card p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium">
                {r.name}{" "}
                <span className={`text-xs ml-2 ${statusColors[r.status] || ""}`}>{r.status}</span>
              </p>
              <p className="text-sm text-cream/60">
                {r.date} at {r.time}
                {r.guests ? ` · ${r.guests} guest${r.guests === 1 ? "" : "s"}` : ""}
                {r.occasion ? ` · ${r.occasion}` : ""}
                {" · "}
                <a href={`tel:${r.phone}`} className="hover:text-ember-400">{r.phone}</a>
              </p>
              {r.message && <p className="text-sm text-cream/50 mt-2 whitespace-pre-line">{r.message}</p>}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <select
                value={r.status}
                onChange={(e) => update(r.id, { status: e.target.value })}
                className="rounded-lg bg-char-950 border border-cream/15 px-2 py-1 text-sm"
              >
                <option value="new">New</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={() => remove(r.id)} className="text-xs text-ember-400 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
